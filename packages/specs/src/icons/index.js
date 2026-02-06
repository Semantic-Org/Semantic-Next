import { iconMappings } from './mappings.js';

export { iconMappings };

// Canonical icon names derived from mapping keys
export const ICON_NAMES = Object.keys(iconMappings);

// Category display order (sorted by typical usage in web apps)
export const ICON_CATEGORIES = [
  'navigation',
  'action',
  'status',
  'user',
  'form',
  'data',
  'file',
  'media',
  'media-controls',
  'text',
  'editing',
  'communication',
  'social',
  'commerce',
  'time',
  'security',
  'settings',
  'organization',
  'business',
  'finance',
  'location',
  'system',
  'device',
  'connectivity',
  'development',
  'brand',
  'gamification',
  'ai',
  'education',
  'weather',
  'misc',
];
