import { TemplateCompiler } from '@semantic-ui/compiler';
import { readFile } from 'fs/promises';
import { dirname, resolve } from 'path';

// esbuild plugin: imports of `*.html?ast` are compiled to AST JSON at build time
export const astPlugin = {
  name: 'semantic-ui-ast',
  setup(build) {
    build.onResolve({ filter: /\.html\?ast$/ }, args => ({
      path: resolve(args.resolveDir, args.path.replace('?ast', '')),
      namespace: 'sui-ast',
    }));

    build.onLoad({ filter: /.*/, namespace: 'sui-ast' }, async (args) => {
      const template = await readFile(args.path, 'utf8');
      const compiler = new TemplateCompiler(template);
      const ast = compiler.compile();

      return {
        contents: `export default ${JSON.stringify(ast)};`,
        loader: 'js',
        watchFiles: [args.path],
      };
    });
  },
};
