import ts from 'typescript';

/*
  Lazy-loaded half of the tooling worker — everything that needs the TypeScript
  module. Loaded on first .ts file or first intelligence request, never for
  render-only JS sessions.
*/

const compilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.Preserve,
  allowJs: true,
  checkJs: false,
  skipLibCheck: true,
  isolatedModules: true,
};

export const transpile = (source, fileName) => {
  const result = ts.transpileModule(source, {
    compilerOptions,
    fileName,
    reportDiagnostics: true,
  });
  return {
    code: result.outputText,
    diagnostics: (result.diagnostics ?? []).map(formatDiagnostic),
  };
};

const formatDiagnostic = (diagnostic) => {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  const position = diagnostic.file && diagnostic.start !== undefined
    ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
    : undefined;
  return {
    message,
    code: diagnostic.code,
    severity: diagnostic.category === ts.DiagnosticCategory.Error ? 'error' : 'warning',
    line: position?.line,
    character: position?.character,
    start: diagnostic.start,
    length: diagnostic.length,
  };
};

/* JSDoc `@see {@link url label}` tags become navigable links in editor tooltips */
const extractLinks = (tags) => {
  const links = [];
  for (const tag of tags ?? []) {
    const text = typeof tag.text === 'string'
      ? tag.text
      : (tag.text ?? []).map(part => part.text).join('');
    for (const match of text.matchAll(/\{@link\s+(\S+?)(?:\s+([^}]+))?\}/g)) {
      links.push({ url: match[1], label: match[2]?.trim() ?? match[1] });
    }
  }
  return links;
};

/*
  Language service over a session's virtual files. One service per session,
  created on demand and disposed with the session.
*/
export const createLanguageService = (getFiles) => {
  let version = 0;
  const fileVersions = new Map();

  const libPath = '/lib/lib.d.ts';

  const host = {
    getScriptFileNames: () =>
      getFiles().filter(file => /\.(ts|tsx|js|jsx|mjs)$/.test(file.name)).map(file => `/${file.name}`),
    getScriptVersion: (fileName) => String(fileVersions.get(fileName) ?? version),
    getScriptSnapshot: (fileName) => {
      const file = getFiles().find(candidate => `/${candidate.name}` === fileName);
      if (file) {
        return ts.ScriptSnapshot.fromString(file.content);
      }
      const lib = defaultLibs.get(fileName);
      return lib ? ts.ScriptSnapshot.fromString(lib) : undefined;
    },
    getCurrentDirectory: () => '/',
    getCompilationSettings: () => compilerOptions,
    getDefaultLibFileName: () => libPath,
    fileExists: (fileName) => {
      return defaultLibs.has(fileName) || getFiles().some(file => `/${file.name}` === fileName);
    },
    readFile: (fileName) => {
      return defaultLibs.get(fileName) ?? getFiles().find(file => `/${file.name}` === fileName)?.content;
    },
  };

  const service = ts.createLanguageService(host, ts.createDocumentRegistry());

  /*
    Expands the active parameter's type one level when it is a named object type
    (an options bag) — signature help alone prints only the type's name. Inline
    literal types already print whole in the signature, and function, array, and
    class-like parameters have nothing useful to unwrap.
  */
  const getParameterShape = (path, offset, argumentIndex) => {
    try {
      const program = service.getProgram();
      const sourceFile = program.getSourceFile(path);
      if (!sourceFile) {
        return undefined;
      }
      /*
        An unclosed call's recovered node ends before the cursor, so containment
        alone misses it. findPrecedingToken handles that (it is how tsserver
        finds the call); the containment walk covers well-formed calls if the
        internal helper ever disappears.
      */
      let call;
      if (typeof ts.findPrecedingToken === 'function') {
        let node = ts.findPrecedingToken(offset, sourceFile);
        while (node && !ts.isCallExpression(node) && !ts.isNewExpression(node)) {
          node = node.parent;
        }
        call = node;
      }
      if (!call) {
        const visit = (node) => {
          if (node.pos > offset || node.end < offset) {
            return;
          }
          if (
            (ts.isCallExpression(node) || ts.isNewExpression(node)) && node.arguments && offset > node.expression.end
          ) {
            call = node;
          }
          ts.forEachChild(node, visit);
        };
        visit(sourceFile);
      }
      if (!call) {
        return undefined;
      }
      const checker = program.getTypeChecker();
      const signature = checker.getResolvedSignature(call);
      const parameter = signature?.parameters[Math.min(argumentIndex, signature.parameters.length - 1)];
      if (!parameter) {
        return undefined;
      }
      const type = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(parameter, call));
      const symbol = type.aliasSymbol ?? type.getSymbol();
      if (!symbol || symbol.name === '__type' || symbol.name === '__object') {
        return undefined;
      }
      if (checker.getSignaturesOfType(type, ts.SignatureKind.Call).length || checker.isArrayLikeType(type)) {
        return undefined;
      }
      const properties = type.getProperties();
      const isBag = properties.length > 0 && properties.length <= 8
        && properties.every(property => !(property.flags & ts.SymbolFlags.Method));
      if (!isBag) {
        return undefined;
      }
      return {
        name: checker.typeToString(type),
        properties: properties.map(property => ({
          name: property.getName(),
          optional: Boolean(property.flags & ts.SymbolFlags.Optional),
          type: checker.typeToString(checker.getTypeOfSymbolAtLocation(property, call)),
        })),
      };
    }
    catch {
      // shape expansion is garnish — never let it take signature help down
      return undefined;
    }
  };

  return {
    bumpVersion(fileName) {
      version += 1;
      if (fileName) {
        fileVersions.set(`/${fileName}`, version);
      }
      else {
        // whole-project reset must outrank stale per-file pins
        fileVersions.clear();
      }
    },
    getCompletions(fileName, offset) {
      const completions = service.getCompletionsAtPosition(`/${fileName}`, offset, {
        includeCompletionsForModuleExports: false,
        includeCompletionsWithInsertText: true,
      });
      if (!completions) {
        return null;
      }
      return {
        entries: completions.entries.slice(0, 200).map(entry => ({
          name: entry.name,
          kind: entry.kind,
          sortText: entry.sortText,
        })),
      };
    },
    getCompletionDetail(fileName, offset, name) {
      const details = service.getCompletionEntryDetails(
        `/${fileName}`,
        offset,
        name,
        undefined,
        undefined,
        undefined,
        undefined,
      );
      if (!details) {
        return null;
      }
      return {
        text: ts.displayPartsToString(details.displayParts),
        documentation: ts.displayPartsToString(details.documentation),
        links: extractLinks(details.tags),
      };
    },
    getSignatureHelp(fileName, offset) {
      const help = service.getSignatureHelpItems(`/${fileName}`, offset, undefined);
      if (!help) {
        return null;
      }
      return {
        selectedSignature: help.selectedItemIndex,
        activeParameter: help.argumentIndex,
        parameterShape: getParameterShape(`/${fileName}`, offset, help.argumentIndex),
        signatures: help.items.map(item => ({
          prefix: ts.displayPartsToString(item.prefixDisplayParts),
          separator: ts.displayPartsToString(item.separatorDisplayParts),
          suffix: ts.displayPartsToString(item.suffixDisplayParts),
          documentation: ts.displayPartsToString(item.documentation),
          links: extractLinks(item.tags),
          parameters: item.parameters.map(parameter => ({
            label: ts.displayPartsToString(parameter.displayParts),
            documentation: ts.displayPartsToString(parameter.documentation),
          })),
        })),
      };
    },
    getHover(fileName, offset) {
      const info = service.getQuickInfoAtPosition(`/${fileName}`, offset);
      if (!info) {
        return null;
      }
      return {
        text: ts.displayPartsToString(info.displayParts),
        documentation: ts.displayPartsToString(info.documentation),
        links: extractLinks(info.tags),
        start: info.textSpan.start,
        length: info.textSpan.length,
      };
    },
    getDiagnostics(fileName) {
      const path = `/${fileName}`;
      const syntactic = service.getSyntacticDiagnostics(path);
      const semantic = /\.tsx?$/.test(fileName) ? service.getSemanticDiagnostics(path) : [];
      return [...syntactic, ...semantic].map(formatDiagnostic);
    },
    dispose() {
      service.dispose();
    },
  };
};

/*
  Default libs — a concatenated lib.d.ts (es2022 + dom closure) plus package
  declarations under virtual /node_modules paths, both built by
  scripts/build-assets.js and fetched once, lazily, alongside this chunk.
  Module resolution needs nothing more: the host's fileExists/readFile answer
  from this map, so bundler-mode resolution finds the packages on its own.
*/
const defaultLibs = new Map();

export const registerLib = (fileName, content) => {
  defaultLibs.set(fileName, content);
};

let libsPromise;
export const loadLibs = () => {
  if (!libsPromise) {
    const fetchAsset = (name) =>
      fetch(new URL(name, import.meta.url))
        .then(response => (response.ok ? response.text() : ''));
    libsPromise = Promise.all([
      fetchAsset('./lib.d.ts').then(content => registerLib('/lib/lib.d.ts', content)),
      fetchAsset('./types.json').then((json) => {
        for (const [fileName, content] of Object.entries(JSON.parse(json || '{}'))) {
          registerLib(fileName, content);
        }
      }),
    ]).catch(() => {
      // without libs the service still completes local symbols; globals go untyped
    });
  }
  return libsPromise;
};

export default { transpile, createLanguageService, registerLib, loadLibs };
