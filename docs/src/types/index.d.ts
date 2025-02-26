declare module '*.js';
declare module '@components/*';
declare module '@helpers/*';
declare module '@semantic-ui/core';
declare module '@semantic-ui/utils';

declare module '@components/*.js' {
  const component: any;
  export default component;
}
