import { Dependency, reaction } from '@semantic-ui/reactivity';

const routeChanged = new Dependency();
window.addEventListener('hashchange', () => routeChanged.changed());

// a plain browser read, made reactive by one depend() call
const getRoute = () => {
  routeChanged.depend();
  return location.hash || '#/';
};

reaction(() => {
  console.log(`route: ${getRoute()}`);
});

location.hash = '#/inbox';
