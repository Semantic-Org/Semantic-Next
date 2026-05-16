/*
  Shared bundle for examples: Semantic UI core (framework + CSS) plus the
  docs theme-switcher so each page can flip between light and dark themes.

  Resolves to the same files as the `@semantic-ui/core` package's `import`
  and `./css` export conditions — the relative path avoids needing a
  self-referencing workspace symlink.
*/
import '../src/css/all.css';
import '../src/primitives/icon/sets/lucide/lucide.css';
import '../src/index.js';
import '../src/components/theme-switcher/index.js';
