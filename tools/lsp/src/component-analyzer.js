import * as acorn from 'acorn';

/*
  Analyzes a Semantic UI component .js file to extract the ComponentModel.
  Uses acorn for AST parsing — lightweight (~200KB vs ~20MB for typescript).

  Takes source text directly — no filesystem access needed.
*/

export function analyzeComponent(source, filePath) {
  let ast;
  try {
    ast = acorn.parse(source, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
  }
  catch {
    return emptyModel(filePath);
  }

  const model = emptyModel(filePath);

  const imports = extractImports(ast, filePath);
  model.templatePath = imports.template;
  model.specPath = imports.spec;

  const varDecls = buildVarDeclMap(ast);
  const defineCall = findDefineComponentCall(ast);
  if (!defineCall) {
    return model;
  }

  const options = defineCall.arguments[0];
  if (!options || options.type !== 'ObjectExpression') {
    return model;
  }

  for (const prop of options.properties) {
    const name = getPropertyName(prop);
    if (!name) { continue; }

    const resolved = resolvePropertyValue(prop, varDecls);

    switch (name) {
      case 'tagName':
        model.tagName = getStringValue(prop)
          || (resolved?.type === 'Literal' && typeof resolved.value === 'string' ? resolved.value : null);
        break;
      case 'createComponent':
        model.instance = extractCreateComponentMethods(resolved, source);
        break;
      case 'defaultState':
        model.state = extractObjectFields(resolved);
        break;
      case 'defaultSettings':
        model.settings = extractObjectFields(resolved);
        break;
      case 'events':
        model.events = extractEventKeys(resolved);
        break;
      case 'subTemplates':
        model.subTemplates = extractSubTemplateNames(resolved);
        break;
    }
  }

  return model;
}

function emptyModel(filePath) {
  return {
    filePath,
    tagName: null,
    templatePath: null,
    specPath: null,
    instance: [],
    state: [],
    settings: [],
    events: [],
    subTemplates: {},
  };
}

/*
  Walks the AST to find defineComponent({...}).
*/
function findDefineComponentCall(ast) {
  let result = null;

  function visit(node) {
    if (result) { return; }
    if (
      node.type === 'CallExpression'
      && node.callee.type === 'Identifier'
      && node.callee.name === 'defineComponent'
    ) {
      result = node;
      return;
    }
    for (const key of Object.keys(node)) {
      const child = node[key];
      if (child && typeof child === 'object') {
        if (Array.isArray(child)) {
          for (const item of child) {
            if (item && item.type) { visit(item); }
          }
        }
        else if (child.type) {
          visit(child);
        }
      }
    }
  }

  visit(ast);
  return result;
}

/*
  Builds a map of variable name → initializer node for top-level declarations.
*/
function buildVarDeclMap(ast) {
  const map = new Map();
  for (const stmt of ast.body) {
    if (stmt.type === 'VariableDeclaration') {
      for (const decl of stmt.declarations) {
        if (decl.id.type === 'Identifier' && decl.init) {
          map.set(decl.id.name, decl.init);
        }
      }
    }
    // export const X = ...
    if (stmt.type === 'ExportNamedDeclaration' && stmt.declaration?.type === 'VariableDeclaration') {
      for (const decl of stmt.declaration.declarations) {
        if (decl.id.type === 'Identifier' && decl.init) {
          map.set(decl.id.name, decl.init);
        }
      }
    }
  }
  return map;
}

/*
  Resolves the value of a property in defineComponent's options.
*/
function resolvePropertyValue(prop, varDecls) {
  if (prop.type === 'Property') {
    if (prop.shorthand) {
      return varDecls.get(prop.key.name) || null;
    }
    return prop.value;
  }
  return null;
}

/*
  Extracts method names and parameter info from createComponent's return value.
*/
function extractCreateComponentMethods(funcBody, source) {
  const methods = [];
  if (!funcBody) { return methods; }

  let returnExpr = null;

  // Arrow function: () => ({...}) or () => { return {...} }
  if (funcBody.type === 'ArrowFunctionExpression') {
    if (funcBody.body.type === 'ObjectExpression') {
      returnExpr = funcBody.body;
    }
    else if (funcBody.body.type === 'BlockStatement') {
      returnExpr = findReturnExpression(funcBody.body);
    }
  }
  // Function expression: function() { return {...} }
  else if (funcBody.type === 'FunctionExpression' && funcBody.body) {
    returnExpr = findReturnExpression(funcBody.body);
  }

  if (!returnExpr || returnExpr.type !== 'ObjectExpression') {
    return methods;
  }

  for (const member of returnExpr.properties) {
    const methodName = getPropertyName(member);
    if (!methodName) { continue; }

    const value = member.value || member;

    // Method shorthand: foo() {...} or property with function value
    if (value.type === 'FunctionExpression' || value.type === 'ArrowFunctionExpression') {
      const params = (value.params || []).map(p => ({
        name: getParamName(p),
        type: undefined,
      }));
      methods.push({
        name: methodName,
        params,
        line: lineFromOffset(source, member.start),
      });
    }
    // Non-function property
    else {
      methods.push({ name: methodName, params: [], line: lineFromOffset(source, member.start) });
    }
  }

  return methods;
}

/*
  Finds the return statement's expression in a block.
*/
function findReturnExpression(block) {
  for (const stmt of block.body) {
    if (stmt.type === 'ReturnStatement' && stmt.argument) {
      return stmt.argument;
    }
  }
  return null;
}

/*
  Extracts keys and inferred types from an object literal node.
*/
function extractObjectFields(node) {
  const fields = [];
  if (!node || node.type !== 'ObjectExpression') { return fields; }

  for (const prop of node.properties) {
    if (prop.type !== 'Property') { continue; }
    const name = getPropertyName(prop);
    if (!name) { continue; }

    fields.push({
      name,
      inferredType: inferTypeFromValue(prop.value),
      defaultValue: getLiteralValue(prop.value),
    });
  }

  return fields;
}

function extractEventKeys(node) {
  const keys = [];
  if (!node || node.type !== 'ObjectExpression') { return keys; }

  for (const prop of node.properties) {
    const name = getPropertyName(prop);
    if (name) { keys.push(name); }
  }
  return keys;
}

function extractSubTemplateNames(node) {
  const names = {};
  if (!node || node.type !== 'ObjectExpression') { return names; }

  for (const prop of node.properties) {
    const name = getPropertyName(prop);
    if (name) { names[name] = true; }
  }
  return names;
}

/*
  Resolves imports for template, spec, and CSS file paths.
*/
function extractImports(ast, filePath) {
  const dir = filePath ? pathDirname(filePath) : '';
  const result = { template: null, spec: null, css: null };

  for (const stmt of ast.body) {
    // import template from './button.html?raw'
    if (stmt.type === 'ImportDeclaration') {
      const specifier = stmt.source.value || '';
      const defaultImport = stmt.specifiers?.find(s => s.type === 'ImportDefaultSpecifier');
      const importName = defaultImport?.local?.name || '';

      if (specifier.endsWith('?raw')) {
        const cleanPath = specifier.replace('?raw', '');
        if (importName === 'template' || cleanPath.endsWith('.html')) {
          result.template = dir ? pathJoin(dir, cleanPath) : cleanPath;
        }
        else if (importName === 'css' || cleanPath.endsWith('.css')) {
          result.css = dir ? pathJoin(dir, cleanPath) : cleanPath;
        }
      }
      if (importName === 'componentSpec' || specifier.includes('.component')) {
        result.spec = dir ? pathJoin(dir, specifier) : specifier;
      }
    }

    // const template = await getText('./component.html')
    if (stmt.type === 'VariableDeclaration') {
      for (const decl of stmt.declarations) {
        if (!decl.init || decl.id.type !== 'Identifier') { continue; }
        const name = decl.id.name;

        let callExpr = decl.init;
        if (callExpr.type === 'AwaitExpression') {
          callExpr = callExpr.argument;
        }
        if (
          callExpr.type === 'CallExpression'
          && callExpr.callee.type === 'Identifier'
          && callExpr.callee.name === 'getText'
          && callExpr.arguments.length > 0
        ) {
          const arg = callExpr.arguments[0];
          if (arg.type === 'Literal' && typeof arg.value === 'string') {
            if (name === 'template' || arg.value.endsWith('.html')) {
              result.template = arg.value;
            }
            else if (name === 'css' || arg.value.endsWith('.css')) {
              result.css = arg.value;
            }
          }
        }
      }
    }
  }

  return result;
}

// Minimal path ops — no 'path' import needed
function pathDirname(p) {
  const i = p.lastIndexOf('/');
  return i > 0 ? p.substring(0, i) : (i === 0 ? '/' : '');
}

function pathJoin(dir, file) {
  // Normalize ./relative paths
  const cleanFile = file.startsWith('./') ? file.slice(2) : file;
  return dir.endsWith('/') ? dir + cleanFile : dir + '/' + cleanFile;
}

/*
  Helpers
*/

function getPropertyName(prop) {
  if (prop.type === 'Property') {
    if (prop.key.type === 'Identifier') { return prop.key.name; }
    if (prop.key.type === 'Literal') { return String(prop.key.value); }
  }
  return undefined;
}

function getStringValue(prop) {
  if (prop.type === 'Property' && prop.value?.type === 'Literal' && typeof prop.value.value === 'string') {
    return prop.value.value;
  }
  return null;
}

function getParamName(param) {
  if (param.type === 'Identifier') { return param.name; }
  if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') { return param.left.name; }
  if (param.type === 'ObjectPattern') { return '{...}'; }
  if (param.type === 'RestElement') { return '...' + getParamName(param.argument); }
  return '?';
}

function lineFromOffset(source, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < source.length; i++) {
    if (source[i] === '\n') { line++; }
  }
  return line;
}

function isNegativeNumeric(node) {
  return node.type === 'UnaryExpression'
    && node.operator === '-'
    && node.argument.type === 'Literal'
    && typeof node.argument.value === 'number';
}

function inferTypeFromValue(node) {
  if (!node) { return 'any'; }
  if (node.type === 'Literal') {
    if (typeof node.value === 'number') { return 'number'; }
    if (typeof node.value === 'string') { return 'string'; }
    if (typeof node.value === 'boolean') { return 'boolean'; }
    if (node.value === null) { return 'null'; }
  }
  if (isNegativeNumeric(node)) { return 'number'; }
  if (node.type === 'ArrayExpression') { return 'array'; }
  if (node.type === 'ObjectExpression') { return 'object'; }
  if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') { return 'function'; }
  return 'any';
}

function getLiteralValue(node) {
  if (!node) { return undefined; }
  if (node.type === 'Literal') { return node.value; }
  if (isNegativeNumeric(node)) { return -node.argument.value; }
  if (node.type === 'ArrayExpression' && node.elements.length === 0) { return []; }
  return undefined;
}
