# Test Case Sandbox

A standalone development environment for creating minimal reproducible test cases.

## Purpose

This folder provides a self-contained sandbox for:

- **Bug reproduction**: Create minimal examples to isolate issues
- **GitHub issues**: Fork this folder to share reproducible bug reports
- **Manual testing**: Test component behavior in a real browser environment
- **Debugging**: Inspect component behavior with browser devtools

## Structure

```
test-case/
├── index.html       ← Entry point, loads the test component
├── index.css        ← Page-level styles
└── src/
    ├── index.js     ← Build entry point
    ├── test-case.js ← Test component definition
    ├── test-case.html  ← Component template
    └── test-case.css   ← Component styles
```

## Usage

```bash
npm run test:case
```

This starts a dev server with hot reload. Edit files in `src/` and see changes instantly.

## Creating a Test Case

1. Edit `src/test-case.js` to define your component
2. Edit `src/test-case.html` for the template
3. Edit `src/test-case.css` for styles
4. Edit `index.html` to set up the test scenario
5. Run `npm run test:case` to view in browser

## For GitHub Issues

When reporting bugs, you can reference this folder structure to help maintainers reproduce the issue. Include:

1. Component definition (test-case.js)
2. Template (test-case.html)
3. Steps to reproduce
4. Expected vs actual behavior

---

**Note:** The `npm run test:case` command requires wireit configuration. If it's not working, the config may need to be added to package.json.
