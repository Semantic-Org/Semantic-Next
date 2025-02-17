import { isNumber } from './types';

/*-------------------
       Numbers
--------------------*/

export const roundNumber = (number, digits = 5) => {
  if(number == 0) {
    return 0;
  }
  if(!isNumber(number) || !Number.isFinite(number) || digits <= 0) {
    return number;
  }
  const factor = Math.pow(10, digits - Math.ceil(Math.log10(Math.abs(number))));
  return Math.round(number * factor) / factor;
};
