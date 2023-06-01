import { SUIComponent } from './sui-component.js';
import { ReactiveVar } from './reactive.js';

class ReactiveCounter extends SUIComponent {
  constructor() {
    super();

    this.counter = new ReactiveVar(0);

    this.createScopedStyle(`
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


    this.incrementButton = this.$('#increment');
    this.decrementButton = this.$('#decrement');

    this.incrementButton.on('click', () => this.increment());
    this.decrementButton.on('click', () => this.decrement());
  }

  initialize() {

  }

  connectedCallback() {
    if (this.reactions) {
      this.reactions.forEach(reaction => reaction.start());
    }
  }

  disconnectedCallback() {
    if (this.reactions) {
      this.reactions.forEach(reaction => reaction.stop());
    }
  }

  get defaultSettings() {
    return {
      onCounterChange: (value) => console.log(`New value is ${value}`),
      initialValue: 0,
    };
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

customElements.define('reactive-counter', ReactiveCounter);
