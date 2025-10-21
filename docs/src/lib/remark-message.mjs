import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform blockquotes with [!type] syntax into ui-message web components
 * Syntax: > [!type] optional header
 *         > content here
 */
export function remarkMessage() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      // Check if first child is a paragraph
      if (!node.children || node.children.length === 0) { return; }

      const firstChild = node.children[0];
      if (firstChild.type !== 'paragraph') { return; }

      // Check if first text node starts with [!type]
      const firstTextNode = firstChild.children?.[0];
      if (!firstTextNode || firstTextNode.type !== 'text') { return; }

      const match = firstTextNode.value.match(/^\[!(\w+)\](?:\s+(.+))?/);
      if (!match) { return; }

      const type = match[1].toLowerCase();
      const header = match[2] || null;

      console.log('[remark-message] Found alert:', type, header);

      // Remove the [!type] marker from the first text node
      firstTextNode.value = firstTextNode.value.replace(/^\[!\w+\](?:\s+.+)?/, '').trim();

      // If the text node is now empty, remove it
      if (!firstTextNode.value) {
        firstChild.children.shift();
      }

      // If the paragraph is now empty, remove it
      if (firstChild.children.length === 0) {
        node.children.shift();
      }

      // Transform blockquote to ui-message
      node.data = node.data || {};
      node.data.hName = 'ui-message';
      node.data.hProperties = {
        type: type,
      };

      // Add header if provided
      if (header) {
        node.data.hProperties.header = header;
      }
    });
  };
}
