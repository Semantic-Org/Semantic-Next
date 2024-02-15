export const scopeStyles = (css, scopeSelector = '') => {
  scopeSelector = scopeSelector.toLowerCase();
  const style = document.createElement('style');
  const scopeRule = (rule, scopeSelector) => {
    const modifiedSelector = `${scopeSelector} ${rule.selectorText}`;
    return `${modifiedSelector} { ${rule.style.cssText} }`;
  };
  document.head.appendChild(style);
  style.appendChild(document.createTextNode(css));
  const sheet = style.sheet;
  let modifiedRules = [];
  for (let i = 0; i < sheet.cssRules.length; i++) {
    let rule = sheet.cssRules[i];
    switch (rule.type) {
      case CSSRule.STYLE_RULE:
        // Handle regular style rules
        modifiedRules.push(scopeRule(rule, scopeSelector));
        break;
      case CSSRule.MEDIA_RULE:
      case CSSRule.SUPPORTS_RULE:
        // Handle @media and @supports which contain nested rules
        let scopedInnerRules = [];
        Array.from(rule.cssRules).forEach((innerRule) => {
          scopedInnerRules.push(scopeRule(innerRule, scopeSelector));
        });
        modifiedRules.push(`@${rule.name} ${rule.conditionText} { ${scopedInnerRules.join(' ')} }`);
        break;
      default:
        // push all other rules through verbatim
        modifiedRules.push(rule.cssText);
        break;
    }
  }
  document.head.removeChild(style);
  const scopedCSS = modifiedRules.join('\n');
  return scopedCSS;
};
