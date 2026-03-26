import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  password: '',
};

const createComponent = ({ self, state }) => ({
  getStrength() {
    const password = state.password.get();
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  },

  getStrengthLabel() {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[self.getStrength()];
  },

  getStrengthClasses() {
    const levels = ['', 'weak', 'fair', 'good', 'strong'];
    const strength = self.getStrength();
    return {
      [levels[strength]]: strength > 0,
    };
  },

  hasLength() { return state.password.get().length >= 8; },
  hasUpper() { return /[A-Z]/.test(state.password.get()); },
  hasNumber() { return /[0-9]/.test(state.password.get()); },
  hasSpecial() { return /[^A-Za-z0-9]/.test(state.password.get()); },
});

const events = {
  'input ui-input'({ state, value = '' }) {
    state.password.set(value);
  },
};

defineComponent({
  tagName: 'password-strength',
  template,
  css,
  defaultState,
  createComponent,
  events,
});
