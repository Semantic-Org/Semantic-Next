import { defineComponent } from '@semantic-ui/component';

export const Home = defineComponent({
  template: '<h3>Home</h3><p>Mounted as a range, no wrapper around it</p>',
});

export const About = defineComponent({
  template: '<h3>About</h3><p>The nav and footer never moved</p>',
});
