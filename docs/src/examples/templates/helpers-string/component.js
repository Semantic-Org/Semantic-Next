import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  firstName: 'john',
  lastName: 'doe',
  title: 'hello world',
  userData: { name: 'Alice', age: 25 },
  itemCount: 3,
  currentIndex: 2,
  stepName: 'Review',
  searchQuery: 'semantic ui components',
  htmlString: '<script>alert("xss")</script>',
  displayName: null,
  longDescription:
    'This is a very long description that should be truncated to show only the first part of the text and then add ellipsis to indicate there is more content.',
};

defineComponent({
  tagName: 'helpers-string',
  template,
  css,
  defaultState,
});
