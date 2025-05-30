import { build } from './lib/build.js';

export const buildCDN = async ({
  watch = false,
  minify = true,
  ...config
} = {}) => {

  const tasks = [];

  tasks.push(
    build({
      ...config,
      watch,
      cdn: true,
      minify: false
    })
  );

  if(minify){
    tasks.push(
      build({
        ...config,
        watch,
        cdn: true,
        minify: true
      })
    );
  }

  return Promise.all(tasks);
};
// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildCDN();
  })();
}
