# Assets Directory

This directory contains assets used by various build and deployment scripts for Semantic UI Next.

## Structure

- **gh-pages/**: Content for the main GitHub Pages site
  - `index.html`: Main page of the CDN site (hosted at cdn.semantic-ui.com)
  - `README.md`: Documentation for the CDN users

- **images/**: Static images used in deployment
  - `logo.png`: Semantic UI logo for use in CDN pages

- **templates/cdn/**: Templates for CDN deployment
  - `core-index.html.template`: HTML template for core package version index
  - `core-index.js.template`: JavaScript template for core package index re-exports
  - `core-redirect.html.template`: HTML template for core package root redirect
  - `create-dev-importmap.js.template`: Script for generating development importmap
  - `create-dev-loader.js.template`: Script for creating dev mode importmap loader
  - `generate-importmap.js.template`: Script for generating importmap JSON files
  - `get-dependency-version.js.template`: Script to get version of a dependency
  - `get-lit-dependencies.js.template`: Script to get all Lit dependencies
  - `get-lit-version.js.template`: Script to get Lit version from node_modules
  - `get-package-files.js.template`: Script to get package files for CDN
  - `importmap-dev-loader.js.template`: Client-side script for loading dev importmaps
  - `importmap-loader.js.template`: Client-side script for loading production importmaps
  - `latest-redirect.html.template`: HTML template for latest version redirects
  - `lit-redirect.html.template`: HTML template for Lit package redirects
  - `package-index.html.template`: HTML template for individual package version index
  - `package-index.js.template`: JavaScript template for package index re-exports
  - `package-redirect.html.template`: HTML template for package root redirect
  - `resolve-entry.js.template`: Script to resolve package entry points
  - `resolve-package-entry.js.template`: Script to resolve sub-package entry points
  - `esbuild/`: ESBuild-related templates
    - `rewrite-imports.js.template`: Script to rewrite imports for CDN compatibility

## Usage

These assets are used by the GitHub Actions workflow in `.github/workflows/cdn-deploy.yml` 
for deploying the Semantic UI CDN to GitHub Pages. During the workflow execution, 
these templates are copied to a temporary directory and used to generate the CDN structure.