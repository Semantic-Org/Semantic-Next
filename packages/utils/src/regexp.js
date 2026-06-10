/*-------------------
       RegExp
--------------------*/

/*
  Escape Special Chars for RegExp
*/
// native total escape, safe inside char classes too (chrome 136, node 24)
export const escapeRegExp = (string) => RegExp.escape(string);
