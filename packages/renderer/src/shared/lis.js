/*
  Longest strictly-increasing subsequence — the move-minimization behind keyed
  list reorders. Vue (`getSequence`), inferno, and ivi all use it to move only
  the nodes genuinely out of order. Pure logic, no DOM.
*/

// Indices into `values` of a longest strictly-increasing subsequence
// (O(n log n) patience sort with predecessor links).
export function lisIndices(values) {
  const predecessor = new Array(values.length);
  const tails = [];
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (values[tails[mid]] < value) { lo = mid + 1; }
      else { hi = mid; }
    }
    predecessor[i] = lo > 0 ? tails[lo - 1] : -1;
    if (lo === tails.length) { tails.push(i); }
    else { tails[lo] = i; }
  }
  const result = new Array(tails.length);
  let k = tails.length;
  let node = k > 0 ? tails[k - 1] : -1;
  while (k > 0) {
    result[--k] = node;
    node = predecessor[node];
  }
  return result;
}
