export default {
  uiType: 'element',
  name: 'Image',
  description: 'An image is a graphic representation of something',
  tagName: 'ui-image',
  exportName: 'Image',
  bundle: 'standard',
  content: [
    {
      name: 'Source',
      attribute: 'src',
      description: 'include an image source',
      exampleCode: `<ui-image src="images/avatar/zoe.png">`,
    },
    {
      name: 'Source (Light Mode)',
      attribute: 'lightSrc',
      description: 'include an image source when page is light mode only',
      exampleCode: `<ui-image lightSrc="images/avatar/zoe.png">`,
    },
    {
      name: 'Source (Dark Mode)',
      attribute: 'darkSrc',
      description: 'include an image source when page is dark mode only',
      exampleCode: `<ui-image darkSrc="images/avatar/zoe.png">`,
    },
  ],
  types: [],
  variations: [],
  events: [],
  settings: [],
};
