import chalk from 'chalk';

// Performs actual log
export const displayLog = ({
  header,
  text,
  includeTime = true,
  isRebuild = false,
  colors = {
    header: 'red',
    text: 'blue',
    rebuild: 'grey',
    time: 'grey'
  }
} = {}) => {
  const args = [];
  if(header) {
    args.push( chalk[colors.header](header) );
  }
  if(text) {
    args.push( chalk[colors.text](text) );
  }
  if (isRebuild) {
    args.push( chalk[colors.rebuild]('Rebuild') );
  }
  if(includeTime) {
    const time = new Date().toLocaleTimeString();
    args.push( chalk[colors.time](time) );
  }
  console.log.apply(console, args);
};

// ESBuild Plugin
export const log = (config) => {

  // this is just a message, lazy config
  if(typeof config == 'string') {
    config = { text: logMessage };
  }

  return {
    name: 'log',
    setup(build) {
      let count = 0;
      build.onEnd(result => {
        if (count === 0) {
          displayLog(config);
        }
        else {
          displayLog({
            ...config, 
            isRebuild: true
          });
        }
        count++;
      });
    },
  };
};

export default log;
