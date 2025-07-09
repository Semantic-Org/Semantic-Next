/*-------------------
       RegExp
--------------------*/

/*
  Escape Special Chars for RegExp
*/
export const escapeRegExp = (string) => {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
};
