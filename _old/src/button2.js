import { SUIComponent } from './sui-component.js';
//import { ReactiveVar } from './reactive.js';

class Button extends SUIComponent {

  settings = {
    one: 'two',
  };

  constructor() {
    super();

    this.addCSS(`
      .counter {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    `);

    this.setTemplate(`
      <div class="counter">
        <button id="decrement">-</button>
        {{#if isZero}}
          <span>Your current value is </span>
        {{else}}
          <span>Your current value is {{getCounter}}</span>
        {{/if}}
        <button id="increment">+</button>
      </div>
    `);

    this.counter = new ReactiveVar(0);
    this.incrementButton = this.$('#increment');
    this.decrementButton = this.$('#decrement');

    this.incrementButton.on('click', () => this.increment());
    this.decrementButton.on('click', () => this.decrement());
  }

  increment() {
    this.counter.set(this.counter.get() + 1);
  }

  decrement() {
    this.counter.set(this.counter.get() - 1);
  }

  isZero() {
    return this.counter.get() == 0;
  }

  getCounter() {
    return this.counter.get();
  }
}

customElements.define('button', ReactiveCounter);
