import { defineComponent, getText } from '@semantic-ui/component';
import { isFunction } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  selector: '',
  items: [], // Array of menu items
  width: 180, // Default menu width
};

const defaultState = {
  visible: false,
  position: { x: 0, y: 0 },
  activeIndex: -1,
};

const createComponent = ({ self, state, settings, $, dispatchEvent }) => ({
  initialize() {
  },
  
  showMenu(event) {
    // Position menu at cursor
    const x = event.clientX;
    const y = event.clientY;
    
    state.position.set({ x, y });
    state.visible.set(true);
    state.activeIndex.set(-1);
    
    // Prevent default context menu
    event.preventDefault();
    
    // Adjust position if menu would go off-screen
    requestAnimationFrame(() => self.adjustMenuPosition());
    dispatchEvent('show');
  },
  
  hideMenu() {
    if (!state.visible.get()) return;
    state.visible.set(false);
    dispatchEvent('hide');
  },
  
  adjustMenuPosition() {
    const menu = $('.menu').el();
    if (!menu) return;

    const position = state.position.peek();
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    // Adjust horizontal position if needed
    if (x + rect.width > viewportWidth) {
      x = viewportWidth - rect.width - 5;
    }

    // Adjust vertical position if needed
    if (y + rect.height > viewportHeight) {
      y = viewportHeight - rect.height - 5;
    }

    // Update position if adjusted
    if (x !== position.x || y !== position.y) {
      state.position.set({ x, y });
    }
  },
  
  selectItem(item, index) {
    // Execute item action if available
    if (isFunction(item.action)) {
      item.action();
    }
    
    // Dispatch event with item data
    dispatchEvent('select', { item, index });
    
    // Hide menu
    self.hideMenu();
  },
  
  navigateNext() {
    const items = settings.items;
    const newIndex = (state.activeIndex.get() + 1) % settings.items.length;
    state.activeIndex.set(newIndex);
  },
  
  navigatePrevious() {
    const items = settings.items;
    const newIndex = (state.activeIndex.get() - 1 + items.length) % items.length;
    state.activeIndex.set(newIndex);
  },
  
  selectCurrent() {
    const items = settings.items;
    const index = state.activeIndex.get();
    if (index >= 0 && index < items.length && !items[index].divider) {
      self.selectItem(items[index], index);
    }
  },

  getMenuStates() {
    return {
      visible: state.visible.get()
    };
  },
  
  getMenuStyle() {
    const position = state.position.get();
    const visible = state.visible.get();
    
    return `
      left: ${position.x}px;
      top: ${position.y}px;
      width: ${settings.width}px;
    `;
  },

  getItemStates(index) {
    return {
      active: self.isItemActive(index)
    }
  },
  
  isItemActive(index) {
    return state.activeIndex.get() === index;
  },
  
  isDivider(item) {
    return item.divider === true;
  },
  
  hasIcon(item) {
    return item.icon && item.icon.length > 0;
  },
  
  hasShortcut(item) {
    return item.shortcut && item.shortcut.length > 0;
  }
});

const keys = {
  'esc': ({ self, state }) => {
    if (!state.visible.get()) {
      return false;
    }
    self.hideMenu();
    return true; // Prevent default
  },
  'down': ({ self, state }) => {
    if (!state.visible.get()) {
      return false;
    }
    self.navigateNext();
    return true;
  },
  'up': ({ self, state }) => {
    if (!state.visible.get()) {
      return false;
    }
    self.navigatePrevious();
    return true;
  },
  'enter': ({ self, state }) => {
    if (!state.visible.get()) {
      return false;
    }
    self.selectCurrent();
    return true;
  }
};

const events = {

  'deep contextmenu .trigger'({self, event}) {
    self.showMenu(event);
    event.preventDefault();
    event.stopPropagation();
  },

  'global contextmenu body'({ self }) {
    self.hideMenu();
  },

  'global show context-menu'({ self, el, target }) {
    if(el == target) {
      return;
    }
    self.hideMenu();
  },

  'global click body'({ self }) {
    self.hideMenu();
  },
  
  'mousedown .item'({ event }) {
    event.stopPropagation();
  },
  
  'click .item'({ self, settings, event, data }) {
    const index = parseInt(data.index, 10);
    const item = settings.items[index];
    
    self.selectItem(item, index);
    event.stopPropagation();
  },
  
  'mouseenter .item'({ state, data }) {
    if (data.divider === 'true') {
      return;
    }
    state.activeIndex.set(parseInt(data.index, 10));
  }
};

defineComponent({
  tagName: 'context-menu',
  template,
  css,
  defaultSettings,
  defaultState,
  events,
  createComponent,
  keys
});
