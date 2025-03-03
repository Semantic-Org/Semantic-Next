declare module '*.js';
declare module '@components/*';
declare module '@helpers/*';
declare module '@components/*.js' {
  const component: any;
  export default component;
}
