/*
  File model shared across project, worker, and serving layers.
  Files travel as plain objects: { name, content, contentType }.
*/

export const contentTypes = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'application/javascript; charset=utf-8',
  mjs: 'application/javascript; charset=utf-8',
  ts: 'application/javascript; charset=utf-8',
  jsx: 'application/javascript; charset=utf-8',
  tsx: 'application/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  importmap: 'application/importmap+json',
  svg: 'image/svg+xml',
  xml: 'application/xml',
  md: 'text/markdown; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
  csv: 'text/csv; charset=utf-8',
  yaml: 'text/yaml; charset=utf-8',
  yml: 'text/yaml; charset=utf-8',
  wasm: 'application/wasm',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  ico: 'image/vnd.microsoft.icon',
  woff2: 'font/woff2',
  glsl: 'text/plain; charset=utf-8',
  vert: 'text/plain; charset=utf-8',
  frag: 'text/plain; charset=utf-8',
  wgsl: 'text/plain; charset=utf-8',
  obj: 'text/plain; charset=utf-8',
  mtl: 'text/plain; charset=utf-8',
  gltf: 'model/gltf+json',
};

export const getExtension = (name = '') => {
  const index = name.lastIndexOf('.');
  return index === -1 ? '' : name.slice(index + 1).toLowerCase();
};

export const getContentType = (name) => {
  return contentTypes[getExtension(name)] || 'text/plain; charset=utf-8';
};

export const isScriptFile = (name) => {
  return ['js', 'mjs', 'ts', 'jsx', 'tsx'].includes(getExtension(name));
};

export const isTypescriptFile = (name) => {
  return ['ts', 'tsx'].includes(getExtension(name));
};

export const isHTMLFile = (name) => {
  return getExtension(name) === 'html';
};

/*
  Normalizes the consumer file shape — an object keyed by filename with
  { content, contentType?, ... } values — into the flat array the engine uses.
  Accepts string values as bare content.
*/
export const normalizeFiles = (files = {}) => {
  const normalized = [];
  for (const [name, file] of Object.entries(files)) {
    const content = typeof file === 'string' ? file : file?.content ?? '';
    const contentType = (typeof file === 'object' && file?.contentType) || getContentType(name);
    normalized.push({ name, content, contentType });
  }
  return normalized;
};
