import { $ } from '@semantic-ui/query';
import './component.js';

// Get the component
const editor = $('content-editor');

// Set content for named header slot
editor.setSlot('header', '<h3>Dynamic Header</h3>');

// Set content for default slot
editor.setSlot('<p>This content was set using <code>setSlot()</code></p>');
