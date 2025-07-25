import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  // Data for CSS helpers
  isActive: true,
  isSelected: false,
  currentPage: 'home',
  hasError: true,
  isLoading: false,
};

const createComponent = ({ self, state }) => ({
  isDisabled() {
    return false;
  },
  getStatusClasses() {
    return {
      error: state.hasError.get(),
      loading: state.isLoading.get(),
      disabled: self.isDisabled(),
    };
  },
});

defineComponent({
  tagName: 'helpers-css',
  template,
  css,
  defaultState,
  createComponent,
});
