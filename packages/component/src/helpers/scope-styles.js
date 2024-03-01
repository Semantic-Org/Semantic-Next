import { each } from '@semantic-ui/utils';

export const scopeStyles = (css, scopeSelector = '') => {
  scopeSelector = scopeSelector.toLowerCase();

  const scopeRule = (rule, scopeSelector) => {
    if (rule.type === CSSRule.STYLE_RULE) {
      return `${scopeSelector} ${rule.selectorText} { ${rule.style.cssText} }`;
    }
    else if (rule.type === CSSRule.MEDIA_RULE || rule.type === CSSRule.SUPPORTS_RULE) {
      return `@${rule.type === CSSRule.MEDIA_RULE ? 'media' : 'supports'} ${rule.conditionText || ''} { ${scopeRules(rule.cssText, scopeSelector)} }`;
    }
    else if (rule.type === CSSRule.LAYER_STATEMENT_RULE || rule.type == 0 && rule.cssRules) {
      let scopedInnerRules = [];
      each(rule.cssRules, (innerRule) => {
        scopedInnerRules.push(scopeRule(innerRule, scopeSelector));
      });
      return `@layer ${rule.name} { ${scopedInnerRules.join(' ')} }`;
    }
    else {
      return rule.cssText;
    }
  };

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(css);

  let modifiedRules = [];
  each(styleSheet.cssRules, (rule) => {
    modifiedRules.push(scopeRule(rule, scopeSelector));
  });

  return modifiedRules.join('\n');
};
