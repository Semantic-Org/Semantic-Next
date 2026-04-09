const components = new Map();
export const registerComponent = (tagName, componentClass) => components.set(tagName, componentClass);
export const getComponent = (tagName) => components.get(tagName);
export const hasComponent = (tagName) => components.has(tagName);
