import { match, reaction, signal } from '@semantic-ui/reactivity';

const selected = signal('home');
const isSelected = match(selected);

['home', 'profile', 'settings'].forEach(tab => {
  reaction(() => {
    console.log(`${tab}: ${isSelected(tab) ? 'active' : 'idle'}`);
  });
});

// home flips off, profile flips on, settings stays quiet
selected.set('profile');
