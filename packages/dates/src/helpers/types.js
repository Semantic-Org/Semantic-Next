// what every kind's schema Type shares: the wire form and the write door. the bare entry imports none of it

// toJSON() is the wire form each kind encodes to, and the key a span compares on
export const text = (value) => value.toJSON();

// the write door hands back what the factory refuses, for a schema's validate to flag. read and decode throw the refusal
export const lenient = (read) => (input) => {
  try {
    return read(input);
  }
  catch {
    return input;
  }
};
