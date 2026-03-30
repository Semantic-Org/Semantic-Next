import { ICON_CATEGORIES } from './categories.js';
import { iconMappings } from './mappings.js';

export { ICON_CATEGORIES, iconMappings };

// Canonical icon names derived from mapping keys
export const ICON_NAMES = Object.keys(iconMappings);

// All valid icon values (canonical + aliases) for use in spec options
export const ICON_OPTIONS = [
  ...ICON_NAMES,
  ...Object.values(iconMappings).flatMap(m => m.aliases || []),
];
