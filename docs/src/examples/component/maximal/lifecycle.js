export const createInstance = ({ state }) => ({
  initialize: () => setInterval(() => state.counter.increment(), 1000),
  isEven: (number) => (number % 2 == 0)
});


export const onCreated = () => console.log('Created');
export const onRendered = () => console.log('Rendered');
export const onDestroyed = () => console.log('Destroyed');
