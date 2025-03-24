import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  counter: 0,
  isActive: false
};

const defaultSettings = {
  username: 'Guest User',
  role: 'Visitor',
  isAdmin: false,
  avatar: '/images/avatar/matthew.png'
};

const createComponent = ({ self, settings, state }) => ({
  initialize() {
    // We don't need to set initial state values
    // They're already set in defaultState
    // This method is called when the component is created
  },
  
  activate() {
    state.isActive.set(true);
  },
  
  deactivate() {
    state.isActive.set(false);
  },
  
  incrementLoginCount() {
    state.counter.increment();
    return state.counter.get();
  },
  
  getUsername() {
    return settings.username;
  },
  
  isAdminUser() {
    return settings.isAdmin;
  },
  
  getRole() {
    return settings.role;
  },
  
});

const events = {
  'click .profile-card'({ self }) {
    if (!self.isAdminUser()) {
      self.activate();
      self.incrementLoginCount();
    }
  }
};

defineComponent({
  tagName: 'ui-profile',
  template,
  css,
  defaultState,
  defaultSettings,
  createComponent,
  events
});