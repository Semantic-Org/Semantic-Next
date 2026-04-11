# TypeScript plugins: where type resolution ends and UI decoration begins

**TypeScript Language Service Plugins cannot change the type checker — they can only decorate the LanguageService interface to modify completions, hover info, diagnostics, and definitions after types are resolved.** Every major framework that needs real type influence (Angular, Vue, Svelte, CSS modules) works around this boundary through the same fundamental trick: intercepting the `LanguageServiceHost` to serve **virtual TypeScript files** that the type checker processes as if they were real. The only build-time mechanism that genuinely alters type resolution is ts-patch's Program Transformer, which recreates the entire `ts.Program` with modified source files. Understanding this boundary is essential because it determines whether a given approach works only in the IDE, only at build time, or both.

---

## The plugin API gives you a proxy over outputs, not the checker

A TypeScript Language Service Plugin implements `ts.server.PluginModule`, which exposes exactly three hooks:

```typescript
interface PluginModule {
  create(createInfo: PluginCreateInfo): LanguageService;
  getExternalFiles?(proj: Project, updateLevel: ProgramUpdateLevel): string[];
  onConfigurationChanged?(config: any): void;
}
```

The `create` method receives a `PluginCreateInfo` containing the existing `LanguageService` and `LanguageServiceHost`, and returns a new `LanguageService`. The canonical pattern is a proxy that delegates to the original service while overriding specific methods:

```typescript
function create(info: ts.server.PluginCreateInfo) {
  const proxy: ts.LanguageService = Object.create(null);
  for (let k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
    const x = info.languageService[k]!;
    proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
  }

  proxy.getCompletionsAtPosition = (fileName, position, options) => {
    const prior = info.languageService.getCompletionsAtPosition(fileName, position, options);
    // Filter, add, or modify completion entries — but types are already resolved
    return prior;
  };

  return proxy;
}
```

Every method on `ts.LanguageService` is decoratable — **~50+ methods** spanning diagnostics (`getSemanticDiagnostics`, `getSyntacticDiagnostics`), completions (`getCompletionsAtPosition`, `getCompletionEntryDetails`), navigation (`getDefinitionAtPosition`, `getTypeDefinitionAtPosition`, `findReferences`), hover (`getQuickInfoAtPosition`), refactoring, formatting, and more. You can also call `getProgram()` to access the `Program` and `TypeChecker` for read-only introspection.

**The critical boundary**: the TypeScript wiki states explicitly: *"Plugins can't add new language features such as new syntax or different typechecking behavior, and plugins aren't loaded during normal commandline typechecking or emitting (so are not loaded by `tsc`)."* If `let x = 5` has type `number`, a plugin cannot make the type checker believe `x` is `string`. It can fake the hover display, but `getSemanticDiagnostics` will still report errors against `number`, and `tsc` will ignore the plugin entirely.

The `getExternalFiles` hook is the one piece with downstream type influence — it tells tsserver to include additional files in the project. Angular and Vue plugins use this to register virtual shim files. But on its own, it only adds files that already exist on disk or in the server's `ScriptInfo` cache.

---

## The LanguageServiceHost interception pattern that actually changes types

The real power lies not in decorating `LanguageService` but in intercepting **`LanguageServiceHost`** — specifically `getScriptSnapshot`, `getScriptKind`, and `resolveModuleNames`. The `typescript-plugin-css-modules` plugin demonstrates this definitively. Rather than wrapping the existing LanguageService, it **creates an entirely new one** backed by a proxied host:

```typescript
function create(info: ts.server.PluginCreateInfo) {
  const languageServiceHost = {} as Partial<ts.LanguageServiceHost>;

  const languageServiceHostProxy = new Proxy(info.languageServiceHost, {
    get(target, key: keyof ts.LanguageServiceHost) {
      return languageServiceHost[key] ? languageServiceHost[key] : target[key];
    },
  });

  // A BRAND NEW LanguageService with the proxied host
  const languageService = ts.createLanguageService(languageServiceHostProxy);
  // ...
  return languageService;
}
```

Three interception points make `import styles from './foo.module.css'` genuinely typed:

**1. `getScriptKind`** — tells TypeScript that `.css` files are TypeScript:
```typescript
languageServiceHost.getScriptKind = (fileName) => {
  if (isCSS(fileName)) return ts.ScriptKind.TS;
  return info.languageServiceHost.getScriptKind(fileName);
};
```

**2. `getScriptSnapshot`** — returns synthesized type declarations instead of CSS:
```typescript
languageServiceHost.getScriptSnapshot = (fileName) => {
  if (isCSS(fileName) && fs.existsSync(fileName)) {
    // Reads CSS, extracts class names via PostCSS, returns virtual .d.ts content:
    // "declare const styles: { readonly myClass: string; }; export default styles;"
    return getDtsSnapshot(ts, processor, fileName, options, logger, compilerOptions, directory);
  }
  return info.languageServiceHost.getScriptSnapshot(fileName);
};
```

**3. `resolveModuleNameLiterals`** — makes CSS imports resolve with `.Dts` extension:
```typescript
languageServiceHost.resolveModuleNameLiterals = (moduleNames, containingFile, ...rest) => {
  return moduleNames.map(({ text: moduleName }, index) => {
    if (isRelativeCSS(moduleName)) {
      return {
        resolvedModule: {
          extension: ts.Extension.Dts,
          isExternalLibraryImport: false,
          resolvedFileName: path.resolve(path.dirname(containingFile), moduleName),
        }
      };
    }
    return resolvedModules[index];
  });
};
```

**This genuinely changes type resolution** — completions, hover, and diagnostics all flow from TypeScript's own checker operating on the synthesized declarations. No UI decoration is needed. The limitation: it only works inside `tsserver` (the IDE), not `tsc`. At build time you still need a global `declare module '*.module.css'` declaration.

---

## Angular generates TypeScript code from templates, then delegates back to TS

Angular's Language Service registers as a standard TS plugin via `ts.server.PluginModule`, overriding methods like `getSemanticDiagnostics`, `getCompletionsAtPosition`, and `getDefinitionAndBoundSpan`:

```typescript
// packages/language-service/src/ts_plugin.ts
export function create(info: ts.server.PluginCreateInfo): NgLanguageService {
  const tsLS = isNgLanguageService(languageService)
    ? languageService.getTypescriptLanguageService()
    : languageService;
  const ngLS = new LanguageService(project, tsLS, config);

  return {
    ...tsLS,                        // Spread all TS methods as base
    getSemanticDiagnostics,         // Override with Angular-aware versions
    getCompletionsAtPosition,
    getQuickInfoAtPosition,
    getDefinitionAndBoundSpan,
    getTcb,                         // Angular-specific: get Type Check Block
  };
}
```

The core mechanism is **Type Check Blocks (TCBs)** — synthesized TypeScript functions that mirror template structure. For a template like `<div *ngFor="let item of items">{{ item.name }}</div>`, Angular generates:

```typescript
function _tcb1(ctx: AppComponent) {
  if (true) {
    var _t1 = _ctor1({ ngForOf: ctx.items });  // NgForOf<ItemType>
    var _t2: any = null!;
    if (NgForOf.ngTemplateContextGuard(_t1, _t2)) {
      // _t2 is now NgForOfContext<ItemType> — TS narrows via type guard
      var _t3 = _t2.$implicit;  // type: ItemType
      '' + _t3.name;            // TS checks .name exists on ItemType
    }
  }
}
```

DOM elements use `document.createElement` to get exact types — `document.createElement("input")` gives `HTMLInputElement`, enabling property checking. Directive inputs use synthetic "type constructors" that let TS infer generic parameters:

```typescript
const _ctor1: <T>(
  init: Partial<Pick<NgForOf<T>, 'ngForOf' | 'ngForTrackBy' | 'ngForTemplate'>>
) => NgForOf<T> = null!;
```

TCBs live in **virtual shim files** registered via `getExternalFiles()`, marked as `ScriptKind.External`. The function `getOrCreateTypeCheckScriptInfo()` creates in-memory `ScriptInfo` objects that never touch disk. For completions and hover, Angular maps the template cursor position to the corresponding TCB position, delegates to the TypeScript LanguageService at that position, then maps results back to template coordinates. **Angular does not duplicate TypeScript's type system — it generates TypeScript that, when checked by TS itself, produces correct template errors.**

---

## Volar transforms .vue files into virtual TypeScript with source maps

Volar's architecture has three tiers: VS Code extension → `@vue/language-server` (LSP) + `@vue/typescript-plugin` (TS plugin) → `@vue/language-core` (SFC-to-TS transformation). Each `.vue` file is parsed into a `VueVirtualCode` object containing multiple embedded virtual files:

| Virtual file | Source | Purpose |
|---|---|---|
| `script_ts` | `<script>` + `<script setup>` + template codegen | Main component TypeScript |
| `template` | `<template>` block | Raw HTML for template-specific features |
| `style_N` | Each `<style>` block | CSS language features |

Template expressions undergo **code generation** in `@vue/language-core/lib/codegen/template/index.ts`. The expression `{{ count }}` becomes `__VLS_ctx.count`. Components are resolved via `__VLS_WithComponent` (handling PascalCase/kebab-case), and `v-for`/`v-if` directives become TypeScript control flow. Global type helpers like `__VLS_FunctionalComponent`, `__VLS_EmitsToProps`, and `__VLS_getVForSourceType` are generated in a companion `.d.ts` file.

The `@vue/typescript-plugin` registers as a standard TS plugin and uses `getExternalFiles()` to include `.vue` files. The language server runs as a **separate process** that creates its own `LanguageServiceHost` with full control over `getScriptSnapshot` (returning generated TypeScript for `.vue` files) and `resolveModuleNames` (resolving `.vue` imports to virtual content). The predecessor Vetur simply masked non-script blocks with whitespace to preserve positions — Volar replaced this with full template-to-TypeScript codegen, enabling real type checking inside templates.

Notably, Volar's `defineComponent` overloads include private fields `__typeProps`, `__typeEmits`, `__typeRefs`, and `__typeEl` — explicitly marked `@private for language-tools use only`. The virtual code generator sets these to pass type information that can't be expressed through runtime options alone.

---

## Vue's `defineComponent` solves circularity with `ThisType<T>`

The Options API has a genuinely circular type problem: `this` inside `methods` needs to include all methods, data, computed, and props — but the type of `methods` is part of what defines `this`. Vue solves this entirely at the type level using **`ThisType<T>`**, a TypeScript intrinsic that marks the contextual `this` type for object literals.

The `ComponentOptions` type intersects the options base with a `ThisType` that assembles the full component instance:

```typescript
export type ComponentOptions<
  Props = {}, RawBindings = any, D = any,
  C extends ComputedOptions = any, M extends MethodOptions = any,
  Mixin extends ComponentOptionsMixin = any,
  Extends extends ComponentOptionsMixin = any, /* ... */
> = ComponentOptionsBase<Props, RawBindings, D, C, M, Mixin, Extends, /* ... */> &
  ThisType<
    CreateComponentPublicInstanceWithMixins<
      {}, RawBindings, D, C, M, Mixin, Extends, /* ... */
    >
  >
```

TypeScript first infers each generic parameter independently — `D` from `data()` return type, `M` from the `methods` object shape, `C` from computed definitions — then constructs `CreateComponentPublicInstanceWithMixins<...>` from those parameters. The `ThisType` wrapper tells TS that `this` inside any method of the object literal should be this assembled instance type.

**Three deliberate cycle-breakers prevent infinite recursion:**

- **`data()` receives a limited `this`** — its signature explicitly excludes data, setup bindings, and computed from the `this` context: `this: CreateComponentPublicInstanceWithMixins<Props, {}, {}, {}, MethodOptions, ...>` (note the empty `{}` where data and computed would go)
- **`props` uses `ThisType<void>`** — `props?: (RuntimePropsOptions & ThisType<void>)` blocks `this` access inside prop validators and defaults
- **`render` uses signature-less `Function`** — the comment in source reads: *"we are intentionally using the signature-less Function type here since any type with signature will cause the whole inference to fail when the return expression contains reference to this"*

Computed properties are unwrapped from functions to values via a mapped type:

```typescript
type ExtractComputedReturns<T> = {
  [key in keyof T]: T[key] extends { get: (...args: any[]) => infer TReturn }
    ? TReturn
    : T[key] extends (...args: any[]) => infer TReturn ? TReturn : never
}
```

The runtime `defineComponent` function is essentially a no-op — it returns the options object unchanged. All the magic is in the type signatures.

---

## ts-patch's Program Transformer is the only build-time path to type influence

Standard TypeScript AST transformers (`before`/`after`/`afterDeclarations`) run **after type checking** during the emit phase. They cannot change what the type checker sees. The compilation pipeline is Parse → Bind → **Check** → Transform → Emit, and source transformers enter at the Transform stage.

ts-patch introduces a second category: **Program Transformers**, which intercept `ts.createProgram()` itself:

```typescript
type ProgramTransformer = (
  program: ts.Program,
  host: ts.CompilerHost | undefined,
  config: PluginConfig,
  extras: ProgramTransformerExtras
) => ts.Program;
```

A Program Transformer can modify source files and then **recreate the entire Program**, triggering a full re-parse and re-type-check:

```typescript
export default function transformProgram(
  program: Program, host: CompilerHost | undefined,
  config: PluginConfig, { ts: tsInstance }: ProgramTransformerExtras
): Program {
  const compilerOptions = program.getCompilerOptions();
  const compilerHost = getPatchedHost(host, tsInstance, compilerOptions);

  // Transform AST
  const transformedSource = tsInstance.transform(
    program.getSourceFiles().filter(sf => rootFileNames.includes(sf.fileName)),
    [transformAst.bind(tsInstance)],
    compilerOptions
  ).transformed;

  // Print and re-create SourceFiles (transformed nodes lack position info)
  const { printFile } = tsInstance.createPrinter();
  for (const sourceFile of transformedSource) {
    const updatedSourceFile = tsInstance.createSourceFile(
      sourceFile.fileName, printFile(sourceFile), sourceFile.languageVersion
    );
    compilerHost.fileCache.set(sourceFile.fileName, updatedSourceFile);
  }

  // Re-create Program — triggers FULL re-type-check
  return tsInstance.createProgram(rootFileNames, compilerOptions, compilerHost);
}
```

A critical caveat from the ts-patch maintainer: transformed `SourceFile` nodes lack position information and have stale type data, so you **must print to text and create fresh SourceFiles** — you cannot pass transformed AST nodes directly to a new Program. The `afterDeclarations` transformer offers a partial workaround: it can modify emitted `.d.ts` files, changing what types downstream consumers see, but cannot affect the current project's type checking.

| Mechanism | Changes type resolution? | Works in IDE? | Works with `tsc`? |
|---|---|---|---|
| LS plugin decorating `getCompletionsAtPosition` | No — UI only | Yes | No |
| LS host interception (`getScriptSnapshot` + `resolveModuleNames`) | **Yes** | Yes | No |
| `getExternalFiles()` + virtual shim files | **Yes** | Yes | No |
| Program Transformer via ts-patch | **Yes** | No | Yes |
| Source Transformer (`before`/`after`) | No — runs post-check | No | Emit only |
| `afterDeclarations` Transformer | Downstream only | No | Emit only |
| Pure type-level tricks (`ThisType<T>`, generics) | **Yes** | Yes | Yes |

---

## Conclusion: two real paths and one type-level escape hatch

The boundary between "augmenting UI output" and "changing type resolution" is architecturally precise. Standard TS plugins wrap `LanguageService` and can only modify what's displayed. **Actual type influence requires one of three approaches**: intercepting `LanguageServiceHost` to serve virtual TypeScript content (the pattern used by Angular, Volar, Svelte, and CSS modules plugins — IDE only), using ts-patch's Program Transformer to recreate the compiler's `Program` with modified source (build-time only), or designing pure type-level solutions using TypeScript's own type system features like `ThisType<T>` and generic inference (works everywhere, no tooling needed). The most robust production systems — Angular and Vue — combine multiple approaches: pure type tricks for what's expressible in TS's type system, virtual file generation for template languages that TS can't parse natively, and LS plugins to bridge the IDE experience. No single mechanism covers both IDE and build contexts; real-world solutions layer all three.
