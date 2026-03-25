export async function getStaticPaths() {
  const allDocs = import.meta.glob('../../docs/**/*.mdx', {
    query: '?raw',
    eager: true,
  });

  return Object.entries(allDocs).map(([path, content]) => ({
    params: {
      slug: path.replace('../../docs/', '').replace('.mdx', '')
    },
    props: { content: content.default }
  }));
}

export function GET({ props }) {
  const processed = processMarkdown(props.content);

  return new Response(processed, {
    headers: { 'Content-Type': 'text/markdown' }
  });
}

function processMarkdown(content) {
  return content
    // Remove import lines
    .replace(/^import .+$/gm, '')
    // Remove layout from frontmatter
    .replace(/^layout: .+\n/m, '')
    // Replace PlaygroundExample with link + source JSON
    .replace(
      /<PlaygroundExample\s+id="([^"]+)"[^>]*(?:\/>|>.*?<\/PlaygroundExample>)/gs,
      '> **[Interactive Example: $1](/examples/$1)** | [source](/content/examples/$1.json)'
    )
    // Replace Image components with note
    .replace(/<Image\s+[^>]*alt="([^"]+)"[^>]*\/?>/g, '*[Image: $1]*')
    // Remove other JSX components (self-closing and paired)
    .replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '')
    .replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '')
    // Collapse multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
