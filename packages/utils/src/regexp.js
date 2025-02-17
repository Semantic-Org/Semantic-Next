/*-------------------
       RegExp
--------------------*/

/*
  Escape Special Chars for RegExp
*/
export const escapeRegExp = (string) => {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
};

export const escapeHTML = (string) => {
  const htmlEscapes = {
    '&': '&amp',
    '<': '&lt',
    '>': '&gt',
    '"': '&quot',
    "\'": '&#39'
  };
  const htmlRegExp = /[&<>"']/g;
  const hasHTML = RegExp(htmlRegExp.source);
  return (string && hasHTML.test(string))
    ? string.replace(htmlRegExp, (chr) => htmlEscapes[chr])
    : string
  ;
};
