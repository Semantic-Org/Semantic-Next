// src/primitives/segment/specs/segment.json
var uiType = 'element';
var name = 'Segment';
var description = 'A menu displays grouped navigation actions';
var tagName = 'ui-menu';
var exportName = 'UISegment';
var content = [];
var types = [
  {
    name: 'placeholder',
    attribute: 'placeholder',
    description: 'used as a placeholder for content in a layout.',
    usageLevel: 1,
  },
];
var variations = [];
var events = [];
var settings = [];
var segment_default = {
  uiType,
  name,
  description,
  tagName,
  exportName,
  content,
  types,
  variations,
  events,
  settings,
};
export {
  content,
  description,
  events,
  exportName,
  name,
  segment_default as default,
  settings,
  tagName,
  types,
  uiType,
  variations,
};
