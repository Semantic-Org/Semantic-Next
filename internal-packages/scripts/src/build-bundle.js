import { build } from './lib/build.js';

export const buildBundle = async ({
  watch = false,
  minify = true,
  ...config
} = {}) => {

  const tasks = [];

  tasks.push(
    build({
      ...config,
      watch,
      bundle: true,
      minify: false
    })
  );

  if(minify){
    tasks.push(
      build({
        ...config,
        watch,
        bundle: true,
        minify: true
      })
    );
  }

  return Promise.all(tasks);
};


// Handle direct execution of this script
if (import.meta.url === `file://${process.argv[1]}`) {
  (async function() {
    await buildBundle();
  })();
}
