import chalk from 'chalk';

export const log = (header, text) => {
  let time = new Date();
  console.log(chalk.red(header), chalk.blue(`(${text})`), chalk.grey(time.toLocaleTimeString()));
};

export const logPlugin = (text ='') => {
  return {
    name: 'log-build',
    setup(build) {
      let count = 0;
      build.onEnd(result => {
        let time = new Date();
        if(count++ === 0) {
          log('Initial Build', text);
        }
        else {
          log('Rebuild', text);
        }
      });
    },
  };
};
