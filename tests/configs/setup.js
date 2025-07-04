console.log('got here');
const log = console.log;
console.log = (...msg) => {
  if(!msg[0]?.includes('Lit is in dev mode')) {
    log(...msg);
  }
};
