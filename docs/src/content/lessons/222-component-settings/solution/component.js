import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultState = {
  counter: 0,
  isActive: false,
  lastUpdated: null
};

const defaultSettings = {
  username: 'Guest User',
  role: 'Visitor',
  isAdmin: false,
  avatar: '/images/avatar/matthew.png'
};

const createComponent = ({ self, settings, state }) => ({
  initialize() {
    // Settings are reactive by default
    // State values are already defined in defaultState
    // We just need to set the initial timestamp
    state.lastUpdated.set(new Date());
  },
  
  activate() {
    state.isActive.set(true);
    return true;
  },
  
  deactivate() {
    state.isActive.set(false);
    return true;
  },
  
  incrementLoginCount() {
    state.counter.increment();
    this.updateLastModified();
    return state.counter.get();
  },
  
  updateLastModified() {
    state.lastUpdated.set(new Date());
  },
  
  updateProfile(newInfo) {
    // Settings are reactive by default - direct assignment triggers template updates
    // No need for .set() methods like with state
    if (newInfo.username) settings.username = newInfo.username;
    if (newInfo.role) settings.role = newInfo.role;
    if (newInfo.avatar) settings.avatar = newInfo.avatar;
    if (newInfo.isAdmin !== undefined) settings.isAdmin = newInfo.isAdmin;
    
    this.updateLastModified();
    return true;
  },
  
  formatDate(date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
});

const events = {
  'click .profile-card'({ self, settings }) {
    if (!settings.isAdmin) {
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