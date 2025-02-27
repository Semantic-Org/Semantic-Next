import { defineComponent, getText } from '@semantic-ui/component';
import { isFunction, isEmpty, isString } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  options: [],      // Array of {value, text, icon} objects
  selected: '',     // Currently selected value
  placeholder: 'Select an option', // Placeholder text when nothing selected
  name: '',         // Form name attribute
  allowEmpty: false, // Allow selecting "none"
  emptyText: '',    // Text for empty option
  fluid: false,     // Takes full width of parent
  small: false,     // Small size
  large: false,     // Large size  
  error: false,     // Error state
  disabled: false,  // Disabled state
  onChange: null    // Callback when selection changes
};

const defaultState = {
  isOpen: false,
  selectedText: ''
};

const createComponent = ({ settings, state, self, dispatchEvent }) => ({
  initialize() {
    self.updateSelectedText();
  },
  
  updateSelectedText() {
    const selected = settings.selected;
    if (isEmpty(selected) && !settings.allowEmpty) {
      state.selectedText.set(settings.placeholder);
      return;
    }
    
    const option = settings.options.find(opt => opt.value === selected);
    if (option) {
      state.selectedText.set(option.text);
    } else if (settings.allowEmpty) {
      state.selectedText.set(self.getEmptyText());
    } else {
      state.selectedText.set(settings.placeholder);
    }
  },
  
  toggleDropdown() {
    if (settings.disabled) return;
    
    const newState = !state.isOpen.get();
    state.isOpen.set(newState);
  },
  
  getDropdownClasses() {
    return {
      fluid: settings.fluid,
      small: settings.small,
      large: settings.large,
      error: settings.error,
      disabled: settings.disabled,
      active: state.isOpen.get()
    };
  },
  
  selectOption(value) {
    if (settings.disabled) return;
    
    // Update the selected value
    settings.selected = value;
    self.updateSelectedText();
    state.isOpen.set(false);
    
    // Dispatch event with selected value
    dispatchEvent('change', { value });
    
    // Call onChange callback if provided
    if (isFunction(settings.onChange)) {
      settings.onChange(value);
    }
  },
  
  getSelectedText() {
    const text = state.selectedText.get();
    return !isEmpty(text) ? text : settings.placeholder;
  },

  getItemClasses(value) {
    return {
      active: value == settings.selected
    };
  },

  // Get the currently selected value
  getSelectedValue() {
    return settings.selected;
  },

  // Get the empty text with a fallback
  getEmptyText() {
    return isString(settings.emptyText) && !isEmpty(settings.emptyText)
      ? settings.emptyText
      : 'None';
  }
});

const events = {
  'click .dropdown'({ self, event }) {
    // Prevent clicks within the menu from closing the dropdown
    if (!event.target.closest('.menu')) {
      self.toggleDropdown();
    }
  },
  
  'click .item'({ self, data }) {
    self.selectOption(data.value);
  },
  
  'global click body'({ state, el, event }) {
    // Close dropdown when clicking outside
    if (state.isOpen.get() && !el.contains(event.target)) {
      state.isOpen.set(false);
    }
  }
};

defineComponent({
  tagName: 'ui-dropdown',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events
});
