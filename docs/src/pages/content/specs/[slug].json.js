export async function getStaticPaths() {
  const allSpecs = import.meta.glob('../../../../../src/primitives/**/specs/*.spec.json', {
    eager: true,
  });

  return Object.entries(allSpecs).map(([path, module]) => {
    // Extract component name from path
    // e.g., ../../../../../src/primitives/button/specs/button.spec.json -> button
    const match = path.match(/\/([^/]+)\.spec\.json$/);
    const slug = match ? match[1] : path;

    return {
      params: { slug },
      props: { spec: module.default }
    };
  });
}

export function GET({ props }) {
  return new Response(JSON.stringify(props.spec, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}
