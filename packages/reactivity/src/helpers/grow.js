// a small edge array grows by copy so it holds exactly its entries. a push onto a
// one-element array grows its store to seventeen slots. past four, push amortizes
// so a wide fan-out stays linear
export const grow = (array, value) => {
  if (array.length < 4) {
    return array.concat(value);
  }
  array.push(value);
  return array;
};
