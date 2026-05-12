import { isArray, isFunction, isObject } from '@semantic-ui/utils';
import { nothing } from 'lit';

// Serialize lit content (TemplateResult, primitive, array, object) for
// attribute-position placement. Inner directive markers are resolved via
// their first arg's `.value()` callback, which LitRenderer attaches in
// evaluateExpression. Shared by reactive-conditional and reactive-rerender.

export function serializeContent(content) {
  if (content == null || content === nothing) { return ''; }
  if (content?.strings) {
    const { strings, values } = content;
    let result = '';
    for (let i = 0; i < strings.length; i++) {
      result += strings[i];
      if (i < values.length) {
        result += resolveValue(values[i]);
      }
    }
    return result;
  }
  if (isArray(content) || isObject(content)) {
    try {
      return JSON.stringify(content);
    }
    catch (e) {
      return String(content);
    }
  }
  return String(content);
}

export function resolveValue(v) {
  if (isFunction(v?.values?.[0]?.value)) {
    return String(v.values[0].value() ?? '');
  }
  if (v?.strings) {
    return serializeContent(v);
  }
  if (isArray(v) || isObject(v)) {
    try {
      return JSON.stringify(v);
    }
    catch (e) {
      return String(v);
    }
  }
  return String(v ?? '');
}
