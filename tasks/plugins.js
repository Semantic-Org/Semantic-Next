import chalk from 'chalk';

export const logPlugin = (text ='') => {

  return {
    name: 'log-build',
    setup(build) {
      let count = 0;
      build.onEnd(result => {
        let time = new Date();
        if(count++ === 0) {
          console.log(
            chalk.red('Initial Build'),
            chalk.blue(`(${text})`),
            chalk.grey(time.toLocaleTimeString()),
          );
        }
        else {
          console.log(
            chalk.cyan('Rebuild'),
            chalk.blue(`(${text})`),
            chalk.grey(time.toLocaleTimeString()),
          );
        }
      });
    },
  };
};
