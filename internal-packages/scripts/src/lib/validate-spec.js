import { each, isArray, isFunction, isPlainObject } from '@semantic-ui/utils';

/**
 * Validates that a spec is pure data (JSON-serializable)
 * Prevents functions, dates, and other non-serializable values in specs
 *
 * @param {Object} spec - The spec object to validate
 * @param {string} specPath - Path to the spec file (for error messages)
 * @throws {Error} If validation fails
 * @returns {true} If validation passes
 */
export function validateSpec(spec, specPath) {
  const errors = [];

  // Check required fields
  const required = ['uiType', 'name', 'description', 'tagName', 'exportName'];
  each(required, (field) => {
    if (!spec[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Ensure spec is JSON-serializable
  try {
    const json = JSON.stringify(spec);
    JSON.parse(json); // Round-trip to ensure it works
  }
  catch (e) {
    errors.push(`Spec is not JSON-serializable: ${e.message}`);
  }

  // Check for forbidden values (functions, etc.)
  const checkForFunctions = (obj, path = '') => {
    if (isFunction(obj)) {
      errors.push(`Function found at ${path || 'root'} - specs must be pure data`);
      return;
    }

    if (obj instanceof Date) {
      errors.push(`Date object found at ${path || 'root'} - use ISO strings instead`);
      return;
    }

    if (obj instanceof RegExp) {
      errors.push(`RegExp found at ${path || 'root'} - use string patterns instead`);
      return;
    }

    if (isArray(obj)) {
      each(obj, (item, i) => checkForFunctions(item, `${path}[${i}]`));
    }
    else if (isPlainObject(obj)) {
      each(obj, (value, key) => {
        checkForFunctions(value, path ? `${path}.${key}` : key);
      });
    }
  };

  checkForFunctions(spec);

  if (errors.length > 0) {
    const errorMessage = [
      `Spec validation failed for ${specPath}:`,
      ...errors.map(e => `  - ${e}`),
    ].join('\n');

    throw new Error(errorMessage);
  }

  return true;
}
