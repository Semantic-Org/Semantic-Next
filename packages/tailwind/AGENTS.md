# Agent Context for @semantic-ui/tailwind

This document provides context for AI agents working on this project, including key decisions, patterns, pitfalls, and architectural choices.

## Project Overview

This project provides Tailwind CSS integration for Semantic UI components, enabling JIT compilation of Tailwind classes for Shadow DOM components. The project has been split into two separate packages to handle different runtime environments.

## Package Architecture

### Single Package with Conditional Exports

**Decision**: One package with conditional exports for isomorphic components
- `@semantic-ui/tailwind` - Universal package that works in both environments
- Browser resolution: `./src/browser.js` 
- Node.js resolution: `./src/server.js`

**Rationale**: 
- **Critical insight**: Web components need to be isomorphic (same code on server/client)
- **Universal imports**: Same import statement must work regardless of environment
- **Conditional exports**: Let bundlers/runtimes handle environment detection automatically
- **No code changes**: Component code doesn't need to know its execution environment
- **Future-proof**: Works with SSR, hydration, and other universal rendering patterns

### Package Structure
```
plugin/
├── src/
│   ├── index.js              # Main entry with fallback
│   ├── browser.js            # Browser-specific entry
│   ├── server.js             # Server-specific entry
│   ├── generator-browser.js  # Browser implementation
│   ├── generator-server.js   # Server implementation
│   ├── scanner.js            # Shared content scanner
│   └── tailwind-plugin.js    # Main plugin function
├── package.json              # Conditional exports configuration
├── types/
└── LICENSE
```

## Key Technical Decisions

### 1. Official Scanner Integration
**Decision**: Use official Tailwind scanners only
- Server: `@tailwindcss/oxide` (native Node.js addon)
- Browser: `@tailwindcss/oxide-wasm32-wasi` (WASM)

**Avoided**: Custom regex-based candidate extraction
**Rationale**: Only official scanners guarantee complete and accurate Tailwind class detection

### 2. Pure ESM
**Decision**: All packages use `"type": "module"`
**Avoided**: CommonJS support or dual-format packages
**Rationale**: Simplifies build process and aligns with modern JavaScript practices

### 3. No Dynamic Imports
**Decision**: Avoid dynamic imports in favor of static, explicit imports
**Avoided**: 
```javascript
// ❌ Don't do this
const { Scanner } = await import(isNode ? '@tailwindcss/oxide' : '@tailwindcss/oxide-wasm32-wasi');
```
**Rationale**: Dynamic imports are unreliable, hurt bundling, and make code harder to analyze

### 4. Environment-Specific APIs
**Decision**: Use different Tailwind APIs per environment
- Server: `@tailwindcss/node` (full Node.js integration)
- Browser: `tailwindcss` core (browser-compatible)

**Rationale**: `@tailwindcss/node` contains Node.js-specific dependencies (lightningcss, jiti) that break in browsers

## Dependencies Structure

### Core Dependencies (Always Available)
```json
{
  "dependencies": {
    "tailwindcss": "^4.1.9"
  }
}
```

### Optional Dependencies (Environment-Specific)
```json
{
  "optionalDependencies": {
    "@tailwindcss/node": "^4.1.9",        // Server environments
    "@tailwindcss/oxide": "^4.1.9",       // Native Node.js scanner
    "@tailwindcss/oxide-wasm32-wasi": "^4.1.9"  // Browser WASM scanner
  }
}
```

**Strategy**: Core package works everywhere, optional deps provide enhanced functionality where supported.

## Common Pitfalls & Solutions

### 1. Platform Dependency Conflicts
**Problem**: `@tailwindcss/oxide-wasm32-wasi` has platform restrictions (`{"cpu": "wasm32"}`)
**Previous Solution**: Optional dependencies (caused install failures)
**Current Solution**: Separate packages with appropriate dependencies

### 2. Bundler Issues with Node.js Dependencies
**Problem**: Vite/esbuild tries to bundle Node.js native modules like `lightningcss`
```
ERROR: Could not resolve "../pkg" in lightningcss/node/index.js
```
**Previous Solution**: Complex Vite configuration with excludes
**Current Solution**: Browser package doesn't include Node.js dependencies

### 3. jiti Import Errors in Browser
**Problem**: `jiti` (from `@tailwindcss/node`) being imported in browser
```
ERROR: The requested module 'jiti.cjs' does not provide an export named 'default'
```
**Root Cause**: Conditional exports not working properly, or direct imports bypassing them
**Solution**: Separate packages eliminate cross-contamination

### 4. Scanner API Differences
**Both scanners use same API**:
```javascript
const scanner = new Scanner({ sources: [] });
const candidates = [...scanner.scanText(content)];
```

## API Patterns

### Generator Function Signature
```javascript
export async function generateTailwindCSS({ 
  content,     // HTML/JS content to scan
  css = '',    // Existing component CSS
  tailwindCSS, // Custom Tailwind directives (optional)
  config = {}  // Tailwind config (optional)
})
```

### Plugin Usage Pattern (Isomorphic)
```javascript
// Same import works in both server and browser environments
import { TailwindPlugin } from '@semantic-ui/tailwind';

const transform = TailwindPlugin(config);
const transformedDefinition = await transform(componentDefinition);
```

## Testing Environments

### Server Testing
- Node.js environments
- Build tools (Astro, Vite, etc.)
- SSR contexts

### Browser Testing
- Runtime compilation
- Client-side bundlers
- Development playgrounds

## Migration Path

### From Previous Version
1. **No breaking changes**: Same import works everywhere
2. **Enhanced functionality**: Automatic environment detection via conditional exports
3. **Better dependency management**: Optional deps prevent installation failures

### From Third-Party Package
Previous: `@mhsdesign/jit-browser-tailwindcss`
Current: Official Tailwind v4 integration with universal compatibility

### Isomorphic Components
```javascript
// ✅ Works in both server and browser
import { TailwindPlugin } from '@semantic-ui/tailwind';

// Component definition works identically in both environments
export const MyComponent = defineComponent({
  // ... component definition
});
```

## Build Process Notes

### Conditional Exports Configuration
**Key**: Proper export conditions order in package.json
```json
{
  "exports": {
    ".": {
      "types": "./types/index.d.ts",
      "browser": "./src/browser.js",     // Browser-specific entry
      "node": "./src/server.js",         // Node.js-specific entry  
      "import": "./src/index.js",        // Fallback for import
      "default": "./src/index.js"        // Ultimate fallback
    }
  }
}
```

### Optional Dependencies Handling
- Install failures are non-fatal
- Runtime detection provides helpful error messages
- Graceful fallbacks where possible

### Wireit Integration
Package maintains existing Semantic UI build pipeline compatibility with custom `wireit` commands.

## Environment Detection (Avoided)

**Avoid**: Runtime environment detection
```javascript
// ❌ Don't do this
const isNode = typeof process !== 'undefined';
```
**Reason**: Makes behavior unpredictable and complicates bundling

## Future Considerations

1. **WASM Improvements**: Monitor Tailwind's browser strategy for potential WASM distribution changes
2. **API Alignment**: Keep both packages' APIs identical for potential future reunification
3. **Performance**: Monitor scanner performance differences between native and WASM versions

## Debugging Tips

1. **Import Issues**: Check which package is being imported and verify it matches the environment
2. **Scanner Errors**: Ensure content string contains actual HTML/JS, not just class names
3. **CSS Generation**: Verify `compiler.build()` receives candidate array, not raw content
4. **Platform Errors**: Double-check package.json dependencies match the intended environment

## Key Learnings

### Isomorphic Components Requirement
**Critical Decision Point**: Initially considered separate packages for browser/server, but realized web components must be **isomorphic** - same code running in both environments without modification.

**Solution**: Single package with conditional exports that automatically resolve to the correct implementation based on the runtime environment.

## Contact Context

This project is part of Semantic UI's component framework integration with Tailwind CSS v4. The focus is on Shadow DOM component styling with JIT compilation capabilities for universal/isomorphic web components.