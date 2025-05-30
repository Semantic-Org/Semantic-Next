# @semantic-next/esbuild-log

A simple logging plugin for esbuild that provides colorized console output.

## Installation

```bash
npm install @semantic-next/esbuild-log
```

## Usage

```javascript
import { build } from 'esbuild';
import { log } from '@semantic-next/esbuild-log';

build({
  entryPoints: ['src/index.js'],
  outdir: 'dist',
  bundle: true,
  plugins: [
    log({
      header: 'Build:',
      text: 'Completed successfully'
    })
  ]
});
```

You can also use a simple string for quick logging:

```javascript
import { build } from 'esbuild';
import log from '@semantic-next/esbuild-log';

build({
  // ...
  plugins: [
    log('Build successful')
  ]
});
```

## Configuration

The plugin accepts an options object with the following properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `header` | string | undefined | The header text to display |
| `text` | string | undefined | The main message text |
| `includeTime` | boolean | true | Whether to include the current time |
| `isRebuild` | boolean | false | Whether this is a rebuild notification |
| `colors` | object | See below | Colors for different parts of the log |

Default colors:
```javascript
{
  header: 'red',
  text: 'blue',
  rebuild: 'grey',
  time: 'grey'
}
```

## License

MIT