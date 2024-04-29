import { each } from '@semantic-ui/utils';

export const extractCSS = (tagName) => {

  tagName = tagName.toLowerCase();

  const newStyleSheet = new CSSStyleSheet();

  each(document.styleSheets, (sheet) => {
    try {
      each(sheet.cssRules, (rule) => {
        each(rule.cssRules || [], (rule) => {
          if (rule.selectorText && rule.selectorText.includes(tagName)) {
            newStyleSheet.insertRule(rule.cssText, newStyleSheet.cssRules.length);
          }
        });
        if (rule.selectorText && rule.selectorText.includes(tagName)) {
          newStyleSheet.insertRule(rule.cssText, newStyleSheet.cssRules.length);
        }
      });
    } catch (err) {
      console.error("Error accessing stylesheet:", err);
    }
  });

  return newStyleSheet;
};
