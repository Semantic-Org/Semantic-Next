## Task: Evaluate CDN bundle presets for a UI component library

Read this document fully before answering. Think from first principles.

### Context

Semantic UI is a web component framework shipping ~80 UI components at 1.0. Components are served individually via CDN — each is a separate JS module (~5-50KB). An agent or developer loads components via URL:

```html
<!-- Individual components listed explicitly -->
<script type="module" src="https://cdn.semantic-ui.com/core@1.0/button,input,modal,card"></script>

<!-- Or a named preset that expands to a predefined list -->
<script type="module" src="https://cdn.semantic-ui.com/core@1.0/standard"></script>
```

The combo endpoint generates a tiny JS shim (~1KB) that re-exports each requested component. The browser then fetches each component file individually, with shared dependencies deduplicated by URL identity. So the cost of a preset is NOT a monolithic bundle — it's one shim + N parallel component fetches. Unused components in a preset still get fetched but are individually cached.

### The Component List (planned for 1.0)

These are the ~80 components that will ship:

Accordion, Alert, Aspect Ratio, Autocomplete, Avatar, Box, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Code, Color Picker, Command Palette, Container, Context Menu, Date Picker, Divider, Drawer, Dropdown, Empty State, File Upload, Flex, Form, Form Field, Grid, Heading, Icon, Image, Input, Kbd, Label, Link, List, Menu, Menubar, Message, Modal, Navbar, Navigation Menu, Number Input, Pagination, Password Input, Popover, Portal, Progress, QR Code, Radio Button, Rating, Result, Scroll Area, Select, Sidebar, Skeleton, Slider, Space, Spinner, Stack, Statistic, Steps, Switch, Table, Tabs, Text, Textarea, Timeline, Toast, Tooltip, Transfer List, Tree, Typography, Upload

### The Question

We want to define named presets — curated lists of components that a preset name expands to. Each component declares which preset(s) it belongs to in its spec file.

### Questions — Evaluate Independently

**Question 1:** As an AI agent building web UIs for users, how would you reason about choosing between a named preset URL vs. listing specific components? What information would you need? When would you prefer one over the other?

**Question 2:** Looking at the ~80 components, what preset groupings would be genuinely useful for CDN bundling? For each proposed preset, explain: what's the use case, what components belong, and why this grouping earns its name (vs. just listing the components manually). Don't feel obligated to create many presets — fewer well-chosen presets may be better than many.

**Question 3:** Is there a risk that presets become stale or misleading? For example, if "standard" includes 40 components but an agent only needs 5, is the preset doing more harm than good? How do you think about the tradeoff between convenience (one word) and precision (explicit list)?

**Question 4:** Some components are clearly general-purpose (button, input, icon) while others are specialized (QR code, transfer list, command palette). But there's a large middle ground. How would you draw the line for a "general purpose" preset? What principle determines inclusion?
