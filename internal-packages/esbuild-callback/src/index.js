import { promises as fs } from 'fs';


/**
  * esbuild plugin that executes a callback function when a build completes.
  * Useful with watch: true and write: false to perform additional actions
  * when files change.
*/
export function callback({
  loadConfig = { filter: /.*/ },
  loadContents = true,
  onLoad = () => {},
  onComplete = () => {},
} = {}) {
  return {
    name: 'callback',
    setup(build) {
      let count = 0;
      build.onLoad(loadConfig, async (args) => {
        if(loadContents) {
          let contents = await fs.readFile(args.path, 'utf8');
          if(args.path.endsWith('.json')) {
            contents = JSON.parse(contents);
          }
          args.contents = contents;
        }
        return onLoad(args)
      });
      build.onEnd((result) => {
        onComplete(result, {
          isRebuild: (count === 0)
        });
        count++;
      });
    },
  };
}

export default callback;
