/*-------------------
       RegExp
--------------------*/

/*
  Escape Special Chars for RegExp
*/

const escapingRegExp = /([.*+?^=!:${}()|\[\]\/\\])/g;

export const escapeRegExp = (string) => {
  return RegExp.escape
    ? RegExp.escape(string)
    : string.replace(escapingRegExp, '\\$1');
};
