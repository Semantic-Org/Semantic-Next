import { createErrors, isDevelopment, isObject } from '@semantic-ui/utils';

const { throwError } = createErrors({ namespace: 'renderer' });

const engines = new Map();
export const registerEngine = (name, engine) => engines.set(name, engine);
export const getEngine = (name) => engines.get(name);

// an engine may leave a door out. a template that calls it still gets a named refusal
const unsupported = (verb) => () => {
  throwError('unsupportedEngine', `Template.${verb}`, {
    explanation: isDevelopment ? `the rendering engine does not support \`${verb}()\`` : 0,
  });
};

// the engine a template renders through, by name from the registry or as an object
export const resolveEngine = (engine) => {
  const resolved = isObject(engine) ? engine : getEngine(engine);
  if (!resolved) {
    throwError('engineNotRegistered', String(engine), {
      explanation: isDevelopment
        ? `rendering engine '${engine}' is not registered. Import from '@semantic-ui/component' (registers native) or register the engine manually`
        : 0,
    });
  }
  resolved.mount ??= unsupported('mount');
  resolved.unmount ??= unsupported('unmount');
  return resolved;
};
