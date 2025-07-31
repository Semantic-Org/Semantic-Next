import { deepExtend } from '@semantic-ui/utils';

// Basic deep merging
const target = { 
  user: { name: 'Alice', age: 30 },
  settings: { theme: 'light' }
};

const source = { 
  user: { role: 'admin' },
  settings: { notifications: true }
};

console.log('Before:', target);
deepExtend(target, source);
console.log('After:', target);

// With array and date cloning (preserveNonCloneable option)
const config = {};
const defaults = {
  data: [1, 2, { nested: true }],
  timestamp: new Date('2023-01-01')
};

// Without preserveNonCloneable (default) - dates become empty objects
deepExtend(config, defaults);
console.log('Default behavior:', config);
console.log('Date becomes empty object:', config.timestamp);

// With preserveNonCloneable option - dates are preserved  
const configPreserved = {};
deepExtend(configPreserved, defaults, { preserveNonCloneable: true });
console.log('With preserveNonCloneable:', configPreserved);
console.log('Date preserved:', configPreserved.timestamp instanceof Date);