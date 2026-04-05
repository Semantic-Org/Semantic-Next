import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import ts from 'typescript';

/*
  Analyzes a Semantic UI component .js file to extract the ComponentModel.
  Uses TypeScript's parser for AST analysis — no type checking, just structure.
*/

export function analyzeComponent(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);

  const model = {
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

  // Resolve imports to find template, css, spec paths
  const imports = extractImports(sourceFile, filePath);
  model.templatePath = imports.template;
  model.specPath = imports.spec;

  // Build a lookup of top-level variable declarations for resolving shorthand refs
  const varDecls = buildVarDeclMap(sourceFile);

  // Find defineComponent call and extract its options
  const defineCall = findDefineComponentCall(sourceFile);
  if (!defineCall) {
    return model;
  }

  const options = defineCall.arguments[0];
  if (!options || !ts.isObjectLiteralExpression(options)) {
    return model;
  }

  for (const prop of options.properties) {
    const name = getPropertyName(prop);
    if (!name) { continue; }

    // Resolve the actual value — either inline or from a shorthand variable reference
    const resolved = resolvePropertyValue(prop, varDecls);

    switch (name) {
      case 'tagName':
        model.tagName = getStringValue(prop) || (resolved && ts.isStringLiteral(resolved) ? resolved.text : null);
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

/*
  Finds the defineComponent({...}) call expression in the source file.
  Handles both `defineComponent({...})` and `export const X = defineComponent({...})`.
*/
function findDefineComponentCall(sourceFile) {
  let result = null;

  function visit(node) {
    if (result) { return; }
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      if (ts.isIdentifier(callee) && callee.text === 'defineComponent') {
        result = node;
        return;
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return result;
}

/*
  Builds a map of variable name → initializer node for top-level const/let/var declarations.
  Used to resolve shorthand property references like `defineComponent({ createComponent })`.
*/
function buildVarDeclMap(sourceFile) {
  const map = new Map();
  for (const stmt of sourceFile.statements) {
    if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.initializer) {
          map.set(decl.name.text, decl.initializer);
        }
      }
    }
  }
  return map;
}

/*
  Resolves the value of a property in defineComponent's options.
  Handles both inline `createComponent: ({...}) => ({...})` and
  shorthand `createComponent` (references a top-level variable).
*/
function resolvePropertyValue(prop, varDecls) {
  if (ts.isPropertyAssignment(prop)) {
    return prop.initializer;
  }
  if (ts.isMethodDeclaration(prop)) {
    return prop;
  }
  if (ts.isShorthandPropertyAssignment(prop)) {
    const name = prop.name.text;
    return varDecls.get(name) || null;
  }
  return null;
}

/*
  Extracts method names and parameter info from createComponent's return value.
  Accepts the resolved function node (arrow function, function expression, or method).
*/
function extractCreateComponentMethods(funcBody, source) {
  const methods = [];
  if (!funcBody) { return methods; }

  // Unwrap arrow function or function expression
  let returnExpr = null;
  if (ts.isArrowFunction(funcBody) || ts.isFunctionExpression(funcBody)) {
    if (ts.isParenthesizedExpression(funcBody.body)) {
      returnExpr = funcBody.body.expression;
    }
    else if (ts.isObjectLiteralExpression(funcBody.body)) {
      returnExpr = funcBody.body;
    }
    else if (ts.isBlock(funcBody.body)) {
      returnExpr = findReturnExpression(funcBody.body);
    }
  }
  else if (ts.isMethodDeclaration(funcBody) && funcBody.body) {
    returnExpr = findReturnExpression(funcBody.body);
  }

  if (!returnExpr || !ts.isObjectLiteralExpression(returnExpr)) {
    return methods;
  }

  for (const member of returnExpr.properties) {
    const methodName = getPropertyName(member);
    if (!methodName) { continue; }

    if (ts.isMethodDeclaration(member) || ts.isShorthandPropertyAssignment(member)) {
      const params = ts.isMethodDeclaration(member)
        ? member.parameters.map(p => ({
          name: p.name.getText(),
          type: p.type ? p.type.getText() : undefined,
        }))
        : [];
      methods.push({
        name: methodName,
        params,
        line: ts.getLineAndCharacterOfPosition(
          ts.createSourceFile('', source, ts.ScriptTarget.Latest),
          member.getStart(),
        ).line + 1,
      });
    }
    else if (ts.isPropertyAssignment(member)) {
      // Could be an arrow function property: setValue: (value) => {...}
      const init = member.initializer;
      if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
        const params = init.parameters.map(p => ({
          name: p.name.getText(),
          type: p.type ? p.type.getText() : undefined,
        }));
        methods.push({
          name: methodName,
          params,
          line: ts.getLineAndCharacterOfPosition(
            ts.createSourceFile('', source, ts.ScriptTarget.Latest),
            member.getStart(),
          ).line + 1,
        });
      }
      else {
        // Non-function property (e.g., a constant)
        methods.push({ name: methodName, params: [], line: 0 });
      }
    }
  }

  return methods;
}

/*
  Finds the first return statement's expression in a block.
*/
function findReturnExpression(block) {
  for (const stmt of block.statements) {
    if (ts.isReturnStatement(stmt) && stmt.expression) {
      // Unwrap parenthesized: return ({...})
      if (ts.isParenthesizedExpression(stmt.expression)) {
        return stmt.expression.expression;
      }
      return stmt.expression;
    }
  }
  return null;
}

/*
  Extracts keys and inferred types from a resolved object literal node.
  Used for defaultSettings and defaultState.
*/
function extractObjectFields(node) {
  const fields = [];
  if (!node || !ts.isObjectLiteralExpression(node)) { return fields; }

  for (const member of node.properties) {
    if (!ts.isPropertyAssignment(member)) { continue; }
    const name = getPropertyName(member);
    if (!name) { continue; }

    fields.push({
      name,
      inferredType: inferTypeFromValue(member.initializer),
      defaultValue: getLiteralValue(member.initializer),
    });
  }

  return fields;
}

/*
  Extracts event DSL string keys from a resolved object literal node.
*/
function extractEventKeys(node) {
  const keys = [];
  if (!node || !ts.isObjectLiteralExpression(node)) { return keys; }

  for (const member of node.properties) {
    const name = getPropertyName(member);
    if (name) { keys.push(name); }
  }

  return keys;
}

/*
  Extracts subTemplate registration names from a resolved object literal node.
*/
function extractSubTemplateNames(node) {
  const names = {};
  if (!node || !ts.isObjectLiteralExpression(node)) { return names; }

  for (const member of node.properties) {
    const name = getPropertyName(member);
    if (name) { names[name] = true; }
  }

  return names;
}

/*
  Resolves imports to find template, spec, and CSS file paths.
  Handles both `import x from './file?raw'` and `getText('./file')`.
*/
function extractImports(sourceFile, filePath) {
  const dir = dirname(filePath);
  const result = { template: null, spec: null, css: null };

  for (const stmt of sourceFile.statements) {
    // import template from './button.html?raw'
    if (ts.isImportDeclaration(stmt) && stmt.moduleSpecifier) {
      const specifier = stmt.moduleSpecifier.text || '';
      const importName = stmt.importClause?.name?.text || '';

      if (specifier.endsWith('?raw')) {
        const cleanPath = specifier.replace('?raw', '');
        if (importName === 'template' || cleanPath.endsWith('.html')) {
          result.template = resolve(dir, cleanPath);
        }
        else if (importName === 'css' || cleanPath.endsWith('.css')) {
          result.css = resolve(dir, cleanPath);
        }
      }
      if (importName === 'componentSpec' || specifier.includes('.component')) {
        result.spec = resolve(dir, specifier);
      }
    }

    // const template = await getText('./component.html')
    if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (!decl.initializer) { continue; }
        const name = decl.name.getText();
        const init = decl.initializer;

        // await getText('...')
        let callExpr = init;
        if (ts.isAwaitExpression(init)) {
          callExpr = init.expression;
        }
        if (ts.isCallExpression(callExpr)) {
          const callee = callExpr.expression;
          if (ts.isIdentifier(callee) && callee.text === 'getText' && callExpr.arguments.length > 0) {
            const arg = callExpr.arguments[0];
            if (ts.isStringLiteral(arg)) {
              if (name === 'template' || arg.text.endsWith('.html')) {
                result.template = arg.text; // relative to serve root, not resolvable here
              }
              else if (name === 'css' || arg.text.endsWith('.css')) {
                result.css = arg.text;
              }
            }
          }
        }
      }
    }
  }

  return result;
}

/*
  Helpers
*/

function getPropertyName(prop) {
  if (ts.isPropertyAssignment(prop) || ts.isMethodDeclaration(prop) || ts.isGetAccessorDeclaration(prop)) {
    const name = prop.name;
    if (ts.isIdentifier(name)) { return name.text; }
    if (ts.isStringLiteral(name)) { return name.text; }
    if (ts.isComputedPropertyName(name)) { return undefined; }
  }
  if (ts.isShorthandPropertyAssignment(prop)) {
    return prop.name.text;
  }
  return undefined;
}

function getStringValue(prop) {
  if (ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.initializer)) {
    return prop.initializer.text;
  }
  return null;
}

function isNegativeNumeric(node) {
  return ts.isPrefixUnaryExpression(node)
    && node.operator === ts.SyntaxKind.MinusToken
    && ts.isNumericLiteral(node.operand);
}

function inferTypeFromValue(node) {
  if (ts.isNumericLiteral(node) || isNegativeNumeric(node)) { return 'number'; }
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) { return 'string'; }
  if (node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword) { return 'boolean'; }
  if (node.kind === ts.SyntaxKind.NullKeyword) { return 'null'; }
  if (ts.isArrayLiteralExpression(node)) { return 'array'; }
  if (ts.isObjectLiteralExpression(node)) { return 'object'; }
  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) { return 'function'; }
  if (ts.isAsExpression(node)) { return node.type.getText(); }
  return 'any';
}

function getLiteralValue(node) {
  if (ts.isNumericLiteral(node)) { return Number(node.text); }
  if (isNegativeNumeric(node)) { return -Number(node.operand.text); }
  if (ts.isStringLiteral(node)) { return node.text; }
  if (node.kind === ts.SyntaxKind.TrueKeyword) { return true; }
  if (node.kind === ts.SyntaxKind.FalseKeyword) { return false; }
  if (node.kind === ts.SyntaxKind.NullKeyword) { return null; }
  if (ts.isArrayLiteralExpression(node) && node.elements.length === 0) { return []; }
  return undefined;
}
