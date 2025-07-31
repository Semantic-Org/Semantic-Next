import { registerBehavior } from '@semantic-ui/query';

const defaultSettings = {
  watch: '.raw',
};

const createPlugin = ({ $, self }) => ({
  addMarkdown(element) {
    const $element = $(element);
    let html = self.convertToMarkdown( $element.text() );
    $element.html(html);
  },
  convertToMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Handles **bold**
      .replace(/__(.*?)__/g, '<strong>$1</strong>')   // Handles __bold__
      .replace(/\*(.*?)\*/g, '<em>$1</em>')     // Handles *italic*
      .replace(/_(.*?)_/g, '<em>$1</em>');
  },
});

const mutations = {
  // watch what the user asks to watch for changes
  '{watch}': ({ self, $added }) => {
    $added.each(self.addMarkdown);
  },
};

registerBehavior({
  name: 'automarkdown',
  defaultSettings,
  createPlugin,
  mutations,
});
