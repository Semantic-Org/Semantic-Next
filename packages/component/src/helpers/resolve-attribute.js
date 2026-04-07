import { firstMatch, get, inArray, isString, unique } from '@semantic-ui/utils';

const SPACE_REGEX = /\s+/mg;

// allow 'arrow-down' or 'down-arrow'
export const reverseDashes = (string) => {
  if (isString(string)) {
    return string.split('-').reverse().join('-');
  }
  return string;
};

// allow 'down arrow' or 'down-arrow'
export const tokenizeSpaces = (string) => {
  if (isString(string)) {
    return string.replaceAll(SPACE_REGEX, '-');
  }
  return string;
};

/*
  Pure resolution: given an option value and optional attribute context,
  find the matching canonical attribute and value from the component spec.

  Used by adjustPropertyFromAttribute (client) and resolveAttributeAliases (SSR/getData).
*/
export const resolveAllowedValue = ({ attribute, optionValue, componentSpec }) => {
  if (!componentSpec?.optionAttributes) {
    return {};
  }

  optionValue = tokenizeSpaces(optionValue);

  let optionsToCheck = [optionValue];

  if (attribute && optionValue) {
    optionsToCheck.push(`${attribute}-${optionValue}`);
    optionsToCheck.push(`${optionValue}-${attribute}`);
  }

  optionsToCheck.push(reverseDashes(optionValue));
  optionsToCheck = unique(optionsToCheck);

  const matchingValue = firstMatch(
    optionsToCheck,
    (currentValue) => get(componentSpec.optionAttributes, currentValue),
  );

  if (!matchingValue) {
    return {};
  }

  const matchingAttribute = get(componentSpec.optionAttributes, matchingValue);

  // extract canonical value from compound alias (e.g. "chevron-down-icon" → "chevron-down")
  if (matchingValue.includes('-')) {
    const prefix = `${matchingAttribute}-`;
    const suffix = `-${matchingAttribute}`;
    if (matchingValue.startsWith(prefix)) {
      return { matchingAttribute, matchingValue: matchingValue.slice(prefix.length) };
    }
    if (matchingValue.endsWith(suffix)) {
      return { matchingAttribute, matchingValue: matchingValue.slice(0, -suffix.length) };
    }
  }

  return { matchingAttribute, matchingValue };
};
