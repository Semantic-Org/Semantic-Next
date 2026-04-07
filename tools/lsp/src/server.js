import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js';

import { LanguageService } from './language-service.js';
import { analyzeComponent } from './component-analyzer.js';
import { createNodeResolver } from './node.js';

/*
  VS Code LSP transport — wires LanguageService to the LSP connection.
  ~40 lines of glue, no logic.
*/

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

const service = new LanguageService({
  resolver: createNodeResolver(),
  analyzer: (source, filePath) => analyzeComponent(source, filePath),
});

connection.onInitialize((params) => {
  let root = params.rootPath || '';
  if (params.rootUri) {
    try { root = new URL(params.rootUri).pathname; }
    catch { /* keep rootPath */ }
  }
  service.scanSpecs(root);

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        triggerCharacters: ['{', '#', '>', '<', '@', '"', "'", ' ', '.'],
      },
      hoverProvider: true,
    },
  };
});

documents.onDidOpen(({ document }) => {
  service.didOpen(document.uri, document.getText(), document.version);
});

documents.onDidChangeContent(async ({ document }) => {
  service.didChange(document.uri, document.getText(), document.version);
  if (document.uri.endsWith('.html')) {
    const diagnostics = await service.getDiagnostics(document.uri);
    connection.sendDiagnostics({ uri: document.uri, diagnostics });
  }
});

documents.onDidClose(({ document }) => {
  service.didClose(document.uri);
});

connection.onCompletion((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) { return []; }
  // Sync document text in case didOpen didn't fire
  service.didOpen(document.uri, document.getText(), document.version);
  return service.getCompletions(document.uri, params.position);
});

connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) { return null; }
  service.didOpen(document.uri, document.getText(), document.version);
  return service.getHover(document.uri, params.position);
});

documents.listen(connection);
connection.listen();
