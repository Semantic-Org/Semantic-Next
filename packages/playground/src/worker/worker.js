import { createRpc } from '../rpc.js';
import { buildFiles } from './build.js';

/*
  Tooling worker entry — one instance per page, all sessions multiplexed
  through it. Owns builds and (lazily) TypeScript intelligence.
*/

const sessions = new Map();

const getSession = (sessionId) => {
  let session = sessions.get(sessionId);
  if (!session) {
    session = { files: [], languageService: null };
    sessions.set(sessionId, session);
  }
  return session;
};

let servicePromise;
const getServiceModule = async () => {
  if (!servicePromise) {
    servicePromise = import('./typescript-service.js');
  }
  return servicePromise;
};

const getLanguageService = async (session) => {
  if (!session.languageService) {
    const { createLanguageService, loadLibs } = await getServiceModule();
    await loadLibs();
    session.languageService = createLanguageService(() => session.files);
  }
  return session.languageService;
};

const rpc = createRpc({
  post: (message) => self.postMessage(message),
  listen: (receive) => {
    self.addEventListener('message', (event) => receive(event.data));
  },
});

rpc.handle('build', async ({ sessionId, files, importMap, cdnBaseUrl }) => {
  const session = getSession(sessionId);
  session.files = files;
  session.languageService?.bumpVersion();
  return buildFiles({ files, importMap, cdnBaseUrl });
});

rpc.handle('updateFile', ({ sessionId, name, content }) => {
  const session = getSession(sessionId);
  const file = session.files.find(candidate => candidate.name === name);
  if (file) {
    file.content = content;
  }
  session.languageService?.bumpVersion(name);
});

rpc.handle('getCompletions', async ({ sessionId, file, offset }) => {
  const service = await getLanguageService(getSession(sessionId));
  return service.getCompletions(file, offset);
});

rpc.handle('getCompletionDetail', async ({ sessionId, file, offset, name }) => {
  const service = await getLanguageService(getSession(sessionId));
  return service.getCompletionDetail(file, offset, name);
});

rpc.handle('getSignatureHelp', async ({ sessionId, file, offset }) => {
  const service = await getLanguageService(getSession(sessionId));
  return service.getSignatureHelp(file, offset);
});

rpc.handle('getHover', async ({ sessionId, file, offset }) => {
  const service = await getLanguageService(getSession(sessionId));
  return service.getHover(file, offset);
});

rpc.handle('getDiagnostics', async ({ sessionId, file }) => {
  const service = await getLanguageService(getSession(sessionId));
  return service.getDiagnostics(file);
});

rpc.handle('destroySession', ({ sessionId }) => {
  const session = sessions.get(sessionId);
  session?.languageService?.dispose();
  sessions.delete(sessionId);
});

rpc.handle('ping', () => 'pong');
