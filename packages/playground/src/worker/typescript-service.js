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

/*
  Language service over a session's virtual files. One service per session,
  created on demand and disposed with the session.
*/
export const createLanguageService = (getFiles) => {
  let version = 0;
  const fileVersions = new Map();

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
    getDefaultLibFileName: (options) => `/lib/${ts.getDefaultLibFileName(options)}`,
    fileExists: (fileName) => {
      return defaultLibs.has(fileName) || getFiles().some(file => `/${file.name}` === fileName);
    },
    readFile: (fileName) => {
      return defaultLibs.get(fileName) ?? getFiles().find(file => `/${file.name}` === fileName)?.content;
    },
  };

  const service = ts.createLanguageService(host, ts.createDocumentRegistry());

  return {
    bumpVersion(fileName) {
      version += 1;
      if (fileName) {
        fileVersions.set(`/${fileName}`, version);
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
    getHover(fileName, offset) {
      const info = service.getQuickInfoAtPosition(`/${fileName}`, offset);
      if (!info) {
        return null;
      }
      return {
        text: ts.displayPartsToString(info.displayParts),
        documentation: ts.displayPartsToString(info.documentation),
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

/* Bundled lib.d.ts set — populated at asset build time via esbuild define/loader */
const defaultLibs = new Map();

export const registerLib = (fileName, content) => {
  defaultLibs.set(fileName, content);
};

export default { transpile, createLanguageService, registerLib };
