import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js';

import { getCompletions, getHover, getDiagnostics } from './language-service.js';
import { analyzeComponent } from './component-analyzer.js';
import { SpecRegistry } from './spec-registry.js';
import { resolveComponentFile } from './file-resolver.js';

/*
  VS Code LSP transport layer.
  Wires the pure language-service functions to the LSP connection.
*/

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

let specRegistry = new SpecRegistry();
let projectRoot = '';
const componentModels = new Map();

connection.onInitialize((params) => {
  projectRoot = params.rootPath || '';
  if (params.rootUri) {
    try { projectRoot = new URL(params.rootUri).pathname; }
    catch { /* keep rootPath fallback */ }
  }

  specRegistry = new SpecRegistry();
  specRegistry.scan(projectRoot);

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

documents.onDidChangeContent(async (change) => {
  if (!change.document.uri.endsWith('.html')) { return; }
  const text = change.document.getText();
  const diagnostics = await getDiagnostics(text);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});

connection.onCompletion((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) { return []; }
  const model = getComponentModel(document.uri);
  return getCompletions(document.getText(), document.offsetAt(params.position), { model, specRegistry });
});

connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) { return null; }
  const model = getComponentModel(document.uri);
  return getHover(document.getText(), document.offsetAt(params.position), { model, specRegistry });
});

function getComponentModel(uri) {
  if (componentModels.has(uri)) {
    return componentModels.get(uri);
  }
  const jsFile = resolveComponentFile(uri);
  if (!jsFile) { return null; }
  try {
    const model = analyzeComponent(jsFile);
    componentModels.set(uri, model);
    return model;
  }
  catch {
    return null;
  }
}

documents.listen(connection);
connection.listen();
