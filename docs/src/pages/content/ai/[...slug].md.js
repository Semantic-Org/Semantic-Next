export async function getStaticPaths() {
  const uiDocs = import.meta.glob('../../../../../ai/ui/**/*.md', {
    query: '?raw',
    eager: true,
  });
  const frameworkDocs = import.meta.glob('../../../../../ai/framework/**/*.md', {
    query: '?raw',
    eager: true,
  });
  const contributingDocs = import.meta.glob('../../../../../ai/contributing/**/*.md', {
    query: '?raw',
    eager: true,
  });
  const researchDocs = import.meta.glob('../../../../../ai/research/**/*.md', {
    query: '?raw',
    eager: true,
  });

  const allDocs = { ...uiDocs, ...frameworkDocs, ...contributingDocs, ...researchDocs };

  return Object.entries(allDocs).map(([path, module]) => {
    // Path: ../../../../../ai/ui/markup.md -> ui/markup
    const match = path.match(/ai\/(ui|framework|contributing|research)\/(.+)\.md$/);
    const slug = match ? `${match[1]}/${match[2]}` : path;

    return {
      params: { slug },
      props: { content: module.default }
    };
  });
}

export function GET({ props }) {
  return new Response(props.content, {
    headers: { 'Content-Type': 'text/markdown' }
  });
}
