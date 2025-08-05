import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  userId: 1,
  userName: 'Alice',
  userType: 'regular', // This doesn't affect status
};

const createComponent = ({ state }) => ({
  getTimestamp() {
    return new Date().toLocaleTimeString();
  },
  
  getUserStatus() {
    // Status only depends on userId (even = admin, odd = user)
    const id = state.userId.get();
    return id % 2 === 0 ? 'admin' : 'user';
  },
  
  changeUser() {
    // Cycle through user IDs 1-4
    const current = state.userId.get();
    const next = current >= 4 ? 1 : current + 1;
    state.userId.set(next);
    
    // Update userName to match
    const names = { 1: 'Alice', 2: 'Bob', 3: 'Charlie', 4: 'Diana' };
    state.userName.set(names[next]);
  },
  
  changeUserType() {
    // This changes userType but doesn't affect getUserStatus
    const types = ['regular', 'premium', 'vip'];
    const current = state.userType.get();
    const currentIndex = types.indexOf(current);
    const nextIndex = (currentIndex + 1) % types.length;
    state.userType.set(types[nextIndex]);
  },
});

export default defineComponent({
  tagName: 'rerender-guard-demo',
  template,
  css,
  defaultState,
  createComponent,
});