/*******************************
         Extended Params
*******************************/

/* Lifecycle callback params registered globally across all templates */

export const extendedParams = [];
export const extendParams = (params) => {
  extendedParams.push(params);
};
export const clearExtendedParams = () => {
  extendedParams.length = 0;
};
