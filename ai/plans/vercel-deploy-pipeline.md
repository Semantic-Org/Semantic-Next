# Vercel Deploy Pipeline

## Goal

Decouple production deploys from `main` so PRs can merge directly without updating live sites. Production deploys happen only on tagged releases. This applies to both the docs site (`next.semantic-ui.com`) and MCP server (`mcp.semantic-ui.com`).

Retiring the `next` branch as the integration branch — `main` becomes the trunk.

## Design / Implementation

### Docs Site

1. **Change Vercel production branch** from `main` to a non-existent branch (e.g., `production`). Pushes to `main` now generate preview deploys only.
2. **Add GitHub Action** triggered on `v*` tags that runs `vercel deploy --prod` for the docs site. Mirrors the existing `cdn-deploy.yml` pattern.
3. **Set `SEMANTIC_UI_DOCS_URL`** on the MCP Vercel project to point at the latest preview/staging URL, so MCP content stays fresh between prod releases.

### MCP Server

4. **Add MCP deploy to the same GitHub Action** — on `v*` tag push, deploy MCP server to Vercel prod after docs deploys (so content is fresh when MCP goes live).
5. **Keep `npm run deploy` via wireit** for manual/ad-hoc MCP deploys during development.

### Branch Cleanup

6. **Retire `next` branch** — `main` becomes trunk. Update any branch protection rules.
7. **`docs/shippable` stays** as a feature branch. How/when to cut its content back to `main` is a separate decision.

### GitHub Action Structure

Single workflow file (e.g., `.github/workflows/release-deploy.yml`):
- Trigger: `push: tags: ['v*']`
- Job 1: Deploy docs site (`vercel deploy --prod`)
- Job 2: Deploy MCP server (`vercel deploy --prod`), depends on Job 1
- Secrets needed: `VERCEL_TOKEN`, org ID, project IDs for both projects

## Open Questions

None — all decisions made in conversation.

## Dependencies

None. Fully unblocked.

## Status

Not started.
