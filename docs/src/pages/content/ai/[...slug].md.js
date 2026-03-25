export async function getStaticPaths() {
  const allDocs = import.meta.glob(
    '../../../../../ai/skills/**/*.md',
    { query: '?raw', eager: true }
  );

  return Object.entries(allDocs).map(([path, module]) => {
    const match = path.match(/ai\/skills\/(.+)\.md$/);
    const slug = match ? match[1] : path;

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
