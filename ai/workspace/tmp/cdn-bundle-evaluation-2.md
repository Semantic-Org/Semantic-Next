## Task: Categorize 80 UI components into CDN bundle presets

You are an AI agent that builds web UIs for users. You do NOT need to read any code or explore any codebase. Answer entirely from your own preferences and reasoning.

### How It Works

A UI component library has ~80 components served via CDN. You load them with a URL:

```html
<!-- List specific components -->
<script type="module" src="https://cdn.example.com/ui@1.0/button,input,modal"></script>

<!-- Or use a named preset -->
<script type="module" src="https://cdn.example.com/ui@1.0/standard"></script>
```

Each component is a separate file (typically 2-50KB). A preset just expands to a list of components — they're still fetched individually and cached independently. So the cost of an extra component in a preset is one extra parallel fetch on first load.

### The Components

Here are all ~80 components. Categorize every single one.

Accordion, Alert, Aspect Ratio, Autocomplete, Avatar, Box, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Code, Color Picker, Command Palette, Container, Context Menu, Date Picker, Divider, Drawer, Dropdown, Empty State, File Upload, Flex, Form, Form Field, Grid, Heading, Icon, Image, Input, Kbd, Label, Link, List, Menu, Menubar, Message, Modal, Navbar, Navigation Menu, Number Input, Pagination, Password Input, Popover, Portal, Progress, QR Code, Radio Button, Rating, Result, Scroll Area, Select, Sidebar, Skeleton, Slider, Space, Spinner, Stack, Statistic, Steps, Switch, Table, Tabs, Text, Textarea, Timeline, Toast, Tooltip, Transfer List, Tree, Typography, Upload

### What To Produce

1. **Decide what presets should exist.** Name them. For each, explain the use case in one sentence.

2. **Assign every component above to one or more presets, or to "none" (load explicitly).** Show the full list for each preset with component count.

3. **For each component you put in "none", briefly say why** (too specialized, too niche, etc.)

4. **Answer honestly:** As an AI agent, when would you use a preset vs listing components? How do you reason about the tradeoff between loading a few extra unused components vs the simplicity of one preset name?

Do NOT read any files in this repo. Answer from your own knowledge and preferences as an agent who builds web interfaces.

Write your complete analysis to /home/jack/semantic/next/ai/workspace/tmp/cdn-bundle-analysis-2.md
