/*******************************
         Extended Data
*******************************/

/* Template data context entries registered globally across all templates */

export const extendedData = [];
export const extendData = (data) => {
  extendedData.push(data);
};
export const clearExtendedData = () => {
  extendedData.length = 0;
};
