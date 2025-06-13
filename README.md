# Semantic UI Next

[![UnitTests](https://badgen.net/https/wzcozo2uwacu4dfvawkdkmxi640guflx.lambda-url.us-east-1.on.aws?cache=300)](https://github.com/Semantic-Org/Semantic-Next/actions/workflows/ci.yml)
[![E2ETests](https://badgen.net/https/ien5pqfy4lsyqy5a2vegyvevpa0petpj.lambda-url.us-east-1.on.aws?cache=300)](https://github.com/Semantic-Org/Semantic-Next/actions/workflows/ci.yml)
[![Coverage](https://badgen.net/https/fnipttzwzg6ieemy4winuladuu0jhqef.lambda-url.us-east-1.on.aws?cache=300)](https://github.com/Semantic-Org/Semantic-Next/actions/workflows/ci.yml)

A modern, lightweight UI framework built with Web Components.

> **Note:** This is an early technology preview. APIs and structures may change.

## Installation

```bash
npm install @semantic-ui/core
```

## Usage

### Direct Component Imports

For the most efficient imports, you can import individual components directly:

```js
// Import specific components
import { UIButton } from '@semantic-ui/core/button';
import { UICard } from '@semantic-ui/core/card';

// Import global theme
import '@semantic-ui/core/theme';

// Or import component-specific themes (if needed)
import '@semantic-ui/core/theme/button';
import '@semantic-ui/core/theme/card';
```

### Full Framework Import

If you need multiple components, you can import from the main package:

```js
// Import multiple components
import { UIButton, UICard, UIMenu } from '@semantic-ui/core';

// Import global theme
import '@semantic-ui/core/theme';
```


## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development setup instructions and contribution guidelines.

## License

MIT
