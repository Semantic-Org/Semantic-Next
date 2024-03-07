import { each } from '@semantic-ui/utils';

const cssVariableRegex = /(--[^:]+):\s*([^;]+);/g;

export const extractCSS = (tagName, newScope = ':host') => {
  tagName = tagName.toLowerCase();
  let variables = '';

  each(document.styleSheets, (sheet) => {
    try {
      each(sheet.cssRules, (rule) => {
        // Process normal rules and @layer rules
        const processRule = (currentRule) => {
          if (currentRule.selectorText && currentRule.selectorText.includes(tagName)) {
            let varMatches;
            while ((varMatches = cssVariableRegex.exec(currentRule.cssText)) !== null) {
              variables += `  ${varMatches[0]}\n`;
            }
            cssVariableRegex.lastIndex = 0; // Reset regex lastIndex after processing
          }
        };

        if (rule.cssRules) {
          // If the rule has inner rules (@layer), iterate through them
          each(rule.cssRules, processRule);
        } else {
          // Process the rule directly if it's not a container of inner rules
          processRule(rule);
        }
      });
    } catch (err) {
      console.error("Error accessing stylesheet:", err);
    }
  });

  let cssString = '';
  if(variables) {
    cssString = `${newScope} {\n${variables}}`;
  }
  return cssString;
};
