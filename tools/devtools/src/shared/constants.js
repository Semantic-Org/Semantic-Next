// Message types for communication between extension contexts
export const MessageTypes = {
  // Panel → Bridge (commands)
  GET_COMPONENT_TREE: 'GET_COMPONENT_TREE',
  GET_INSPECTED_ELEMENT: 'GET_INSPECTED_ELEMENT',
  HIGHLIGHT_ELEMENT: 'HIGHLIGHT_ELEMENT',
  CLEAR_HIGHLIGHT: 'CLEAR_HIGHLIGHT',
  UPDATE_FILTER_SETTINGS: 'UPDATE_FILTER_SETTINGS',
  LOG_TO_CONSOLE: 'LOG_TO_CONSOLE',

  // Bridge → Panel (events)
  COMPONENT_TREE: 'COMPONENT_TREE',
  INSPECTED_ELEMENT: 'INSPECTED_ELEMENT',
  TREE_UPDATED: 'TREE_UPDATED',

  // Internal
  PANEL_INIT: 'PANEL_INIT',
  PANEL_CLOSED: 'PANEL_CLOSED',
  BRIDGE_READY: 'BRIDGE_READY',
};

// Message sources for identifying origin
export const MessageSources = {
  BRIDGE: 'sui-devtools-bridge',
  CONTENT: 'sui-devtools-content',
  PANEL: 'sui-devtools-panel',
};

// Default filter settings
export const DefaultFilterSettings = {
  hideCommentNodes: true,
  hideWrapperElements: true,
  hideScripts: true,
  hideEmptyText: true,
};

// Known wrapper elements to filter (tag names)
export const WrapperElements = new Set([
  'astro-island',
  'astro-slot',
  'astro-static-slot',
]);
