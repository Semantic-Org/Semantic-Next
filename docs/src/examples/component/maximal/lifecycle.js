export const createInstance = ({settings}) => ({
  decrease() {
    settings.number--;
  },
  increase() {
    settings.number++;
  },
  set(value) {
    settings.number = value;
  }
});

export const onCreated = () => {
  console.log('Created');
};
export const onRendered = () => {
  console.log('Rendered');
};
export const onDestroyed = () => {
  console.log('Destroyed');
};
export const onThemeChanged = (darkMode) => {
  console.log('Theme changed', darkMode);
};
export const onAttributeChanged = (name, value) => {
  console.log('Attribute changed', name, value);
};
