const engines = new Map();
export const registerEngine = (name, engine) => engines.set(name, engine);
export const getEngine = (name) => engines.get(name);
