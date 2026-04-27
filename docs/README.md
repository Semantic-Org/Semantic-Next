Semantic UI’s documentation uses Astro and can run locally:


```bash
# from project root not docs root
npm run dev
```

> Only run `npm run dev` from project root. If you run `npm run dev` from docs it will not find linked packages from monorepo.

This command:
- Builds and watches core packages.
- Runs the Astro dev server at [http://localhost:4321](http://localhost:4321) with live reload.

To build a static copy of the docs you can run
```bash
npm build-docs
```

This is used during the Vercel deploy, and has slightly different behavior than the local server.

## HTTPS dev server

The playground/REPL runs at `https://dev.semantic-ui.com`. From `docs/`:

```bash
npm run cert
```

Then trust the generated CA and add the hosts-file entry — see [`cert/README.md`](./cert/README.md) for OS-specific steps.
