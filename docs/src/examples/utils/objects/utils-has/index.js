import { get, has } from '@semantic-ui/utils';

const preferences = {
  theme: 'dark',
  notifications: undefined,
  profile: {
    displayName: 'Ada Lovelace',
    tags: [{ id: 'vip', label: 'VIP' }],
  },
};

// get returns undefined for both a stored undefined and a missing key
console.log(get(preferences, 'notifications'));
console.log(get(preferences, 'timezone'));

// has tells them apart
console.log(has(preferences, 'notifications'));
console.log(has(preferences, 'timezone'));

// dotted keys, [index], and [#id] keyed segments all resolve
console.log(has(preferences, 'profile.tags[0]'));
console.log(has(preferences, 'profile.tags[#vip]'));
console.log(has(preferences, 'profile.tags[#admin]'));
