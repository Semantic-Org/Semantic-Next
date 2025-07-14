import { $ } from '@semantic-ui/query';
import { Reaction, Signal } from '@semantic-ui/reactivity';

const defaultPrefs = {
  theme: 'light',
  lang: 'en',
};
// we will store this in localstorage as 'preferences'
const storageKey = 'preferences';

// Setup local storage on first run with defaults
if (!localStorage.getItem(storageKey)) {
  console.log('No values exist', defaultPrefs);
  localStorage.setItem(storageKey, JSON.stringify(defaultPrefs));
}

// Use signal to mirror local storage
const preferences = new Signal(
  JSON.parse(localStorage.getItem(storageKey) || defaultPrefs),
);

// Update displays whenever preferences change
Reaction.create(() => {
  const prefs = preferences.get();
  $('.theme').text(prefs.theme || 'light');
  $('.lang').text(prefs.lang || 'en');
  $('.storage').text(JSON.stringify(prefs));
});

// Sync preferences to localStorage whenever they change (skip first run)
Reaction.create((reaction) => {
  const prefs = preferences.get();
  if (reaction.firstRun) {
    return;
  }
  console.log('Saving to localStorage:', JSON.stringify(prefs));
  localStorage.setItem(storageKey, JSON.stringify(prefs));
});

// Theme buttons
$('ui-button[data-value]')
  .on('click', function() {
    const { key, value } = $(this).data();
    preferences.setProperty(key, value);
  });

$('ui-button.reload').on('click', () => {
  window.location.reload();
});
