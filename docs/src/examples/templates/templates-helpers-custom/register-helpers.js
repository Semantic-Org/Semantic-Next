import { registerHelper, registerHelpers } from '@semantic-ui/component';

// Register a single custom helper
registerHelper('formatMoney', (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
});

// Register multiple custom helpers
registerHelpers({
  initials: (name) => name.split(' ').map(n => n[0]).join('').toUpperCase(),
  randomId: () => Math.random().toString(36).substr(2, 9),
  timeAgo: (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) { return 'just now'; }
    if (seconds < 3600) { return `${Math.floor(seconds / 60)}m ago`; }
    if (seconds < 86400) { return `${Math.floor(seconds / 3600)}h ago`; }
    return `${Math.floor(seconds / 86400)}d ago`;
  },
});
