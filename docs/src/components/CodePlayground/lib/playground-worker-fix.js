/*
  Dev-only fix for playground previews where only one sandbox per page
  ever loaded.

  Each playground-project spawns a module worker whose entry imports the
  9MB typescript module. The vite dev server inflates that file to ~45MB
  per request (inline sourcemaps), and when several workers race the
  uncached module graph at page load, every worker after the first dies
  with a silent error (playground-elements attaches no error handler),
  so its compile never emits and its preview never commits.

  In dev the worker is redirected to the static copy under
  /sandbox/, which bypasses the transform pipeline (see
  scripts/prep-playground-worker.js). Production serves bundler-emitted
  assets and doesn't hit any of this.
*/

if (import.meta.env.DEV && typeof window !== 'undefined') {
  const NativeWorker = window.Worker;
  window.Worker = class extends NativeWorker {
    constructor(url, options) {
      if (String(url).includes('playground-elements/playground-typescript-worker')) {
        url = new URL('/sandbox/playground-typescript-worker.js', location.origin);
      }
      super(url, options);
      this.addEventListener('error', (event) => {
        console.error('[playground-worker-fix] worker failed to boot', String(url), event.message ?? '');
      });
    }
  };
}
