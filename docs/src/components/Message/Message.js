import { defineComponent } from '@semantic-ui/component';
import css from './Message.css?raw';
import template from './Message.html?raw';

const defaultSettings = {
  type: '',
  header: '',
  icon: '',
};

const createComponent = ({ settings }) => ({
  getHeader() {
    if (settings.header) {
      return settings.header;
    }
    // Auto-infer header based on type
    const typeMap = {
      'warning': 'Warning',
      'info': 'Info',
      'note': 'Note',
      'tip': 'Tip',
      'important': 'Important',
      'caution': 'Caution',
    };
    return typeMap[settings.type?.toLowerCase()] || 'Info';
  },

  getIcon() {
    if (settings.icon) {
      return settings.icon;
    }
    // Auto-infer icon based on type (using feather icons)
    const iconMap = {
      'warning': 'alert-triangle',
      'info': 'info',
      'note': 'file-text',
      'tip': 'zap',
      'important': 'alert-circle',
      'caution': 'alert-octagon',
    };
    return iconMap[settings.type?.toLowerCase()] || 'info';
  },

  getType() {
    return settings.type?.toLowerCase() || 'info';
  },
});

const Message = defineComponent({
  tagName: 'ui-message',
  template,
  css,
  createComponent,
  defaultSettings,
});

export default Message;
export { Message };
