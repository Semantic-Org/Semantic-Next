import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  status: 'success',
  userName: 'Alice',
  theme: 'blue',
};

const createComponent = ({ state }) => ({
  iconSVG:
    '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="gold"/></svg>',

  getNotification() {
    return `<strong>Alert:</strong> Welcome back, ${state.userName.get()}!`;
  },

  getStatusBadge() {
    const status = state.status.get();
    const color = status === 'success' ? 'green' : 'red';
    return `<span style="color: ${color}; font-weight: bold;">${status.toUpperCase()}</span>`;
  },

  getStyles() {
    const theme = state.theme.get();
    return `
      .themed-button { 
        background-color: var(--${theme}-20);
        border: 1px solid var(--${theme}-40);
        color: var(--${theme}-80);
        padding: 8px 16px;
        border-radius: 4px;
      }
      .themed-button:hover {
        background-color: var(--${theme}-30);
      }
    `;
  },
});

export default defineComponent({
  tagName: 'raw-html-demo',
  template,
  css,
  defaultState,
  createComponent,
});
