import { UIComponent } from './sui-component.js';
import { ReactiveVar } from './reactive.js';

UIComponent.addCSS('button', () =>  `
  .counter {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`);

UIComponent.addSettings('button', () => ({
  one: true,
  two: three,
});

UIComponent.addLifeCycle('button', {
  onCreated() {

  },
  onRendered() {

  },
  onDestroyed() {

  },
});

UIComponent.addBehaviors('button', (tpl) => ({
  hasLabel() {
    return true;
  },
}));

