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
  - `generate-importmap.js.template`: Script for generating importmap JSON files
  - `importmap-loader.js.template`: Client-side script for loading importmaps dynamically
  - `package-index.html.template`: HTML template for individual package version index
  - `package-index.js.template`: JavaScript template for package index re-exports
  - `package-redirect.html.template`: HTML template for package root redirect
  - `core-package.json.template`: Template for core package.json
  - `package.json.template`: Template for sub-package package.json

## Usage

These assets are used primarily by the GitHub Actions workflow in `.github/workflows/cdn-deploy.yml` 
for deploying the Semantic UI CDN to GitHub Pages.