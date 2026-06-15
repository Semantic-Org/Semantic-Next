/*
  Eleventy plugin for Semantic UI.

  Server-renders Semantic UI components in built HTML to Declarative Shadow
  DOM, so static pages ship pre-rendered shadow content that self-hydrates
  when the component JS loads. The expansion is the framework's own
  expandCustomElements, this plugin is the Eleventy wiring around it.

  expandCustomElements is pure synchronous string work.
*/

import { expandCustomElements, renderToString } from '@semantic-ui/component';

export default function semanticUI(eleventyConfig, options = {}) {
  const { components = [], hydrate = true } = options;

  // populate the component registry before any page is transformed.
  // eleventy.before re-fires on --serve rebuilds, so registration survives
  // incremental builds where a top-level import would go stale.
  eleventyConfig.on('eleventy.before', async () => {
    await Promise.all(components.map((component) => import(component)));
  });

  eleventyConfig.addTransform('semantic-ui-dsd', function(content) {
    const { outputPath } = this.page;
    // transforms fire for every output (json feeds, xml, ...) and outputPath
    // can be false. only touch HTML.
    if (typeof outputPath !== 'string' || !outputPath.endsWith('.html')) {
      return content;
    }
    return expandCustomElements(content, { renderFn: renderToString, hydrate });
  });
}
