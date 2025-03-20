# Contributing to Semantic UI

Thank you for your interest in contributing to **Semantic UI**! Contributions of all types and skill levels are welcome. This guide will help you get oriented with the development process, including how to set up your environment, run tests, format your code, and submit pull requests.

## Project Structure

Semantic UI uses npm workspaces and is organized as a monorepo containing multiple discrete packages:

- **`packages/`** – Core components and utilities, each published separately.
- **`internal-packages/`** – Scripts for building packages and forked packages used by the project.
- **`docs/`** – Documentation website built with Astro.
- **`examples/`** – Basic examples demonstrating usage. Note: for more robust examples see the docs examples in `docs/src/examples`

## Development Environment Setup

**Prerequisites:** Ensure you have **Node.js 18+** and **npm v7+** installed.

**Fork and Clone the Repository:**

```bash
git clone https://github.com/<your-username>/semantic-next.git
cd semantic-next
```

**Install Dependencies:**

```bash
npm install
```

This installs dependencies across the entire monorepo and links workspace packages.

## Running Documentation Locally

You can run the docs using
```
npm run dev
```

The easiest way to debug changes is to review them against the examples section of docs. These use local packages in dev and will respond to updates in `packages/`

Please see the [docs readme](https://www.github.com/semantic-org/semantic-next/docs/README.md) for more instructions on running the docs locally including installing SSL certs for easier dev.


## Building and Watching Packages

Use these commands in the project root:

- **Build packages once:**

```bash
npm run build
```

- **Continuous watch mode:**

```bash
npm run watch
```

Typically, you’ll run `npm run watch` while actively developing.

## Running Tests

Semantic UI uses **Vitest** for testing:

- **Run all tests:**

```bash
npm test
```

- **Interactive test UI:**

```bash
npm run test:ui
```

When contributing, please add or update tests to cover your changes. Ensure all tests pass locally before submitting your PR.

## Code Formatting and Commit Hooks

The canonical formatting tool used by Semantic UI is **dprint**.

- **Format code manually:**

```bash
npm run format
```

Code formatting is automatically enforced on commit through Git hooks configured with `simple-git-hooks`. Commit your changes normally; the hook will automatically format staged files.

## Commit Message Convention

Semantic UI uses **Conventional Commits**. Format your commit messages as follows:

```
<type>(<scope>): <short description>
```

Examples:

```
feat(button): add new loading state
fix(modal): correct overlay issue
chore: update dependencies
```

- Use imperative mood ("add feature" instead of "added feature").
- Keep descriptions concise.
- Reference fixed issues (e.g., `fix(modal): resolve animation bug (#123)`).

## Pull Request Guidelines

1. **Ensure Tests Pass:** Run `npm test`.
2. **Include Tests and Docs:** Update documentation if your changes affect the public API.
3. **Open a Pull Request:** Provide a clear title and concise description of your changes.
4. **Code Review:** Respond promptly to maintainers’ feedback.

Significant changes should ideally be discussed in an issue or discussion thread beforehand.
