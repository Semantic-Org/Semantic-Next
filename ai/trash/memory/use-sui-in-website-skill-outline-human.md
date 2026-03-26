
Goal of Skills
------

Allow an agent to interact with the web component framework as a USER and create layouts

This is NOT a skill to AUTHOR web components. It is a skill to USE the shipped first party UI framework `<ui-button>` `<ui-menu>` etc to build websites. The agent SHOULD NOT understand the internals of components outside of how to USE them as an END-USER. This is CRITICAL.

This agent should understand
- How to read spec as an agent to understand how to pass attributes and properties to official UI components to style them correctly as html
- How to handle arrays, functions, events, and objects when working as a user with sui official UI components
- How to apply standard front end skills when creating layouts with semantic ui official components
- Non obvious exlanations of how to integrate web components into various codebases seamlessly like React, Vue, Svelte, Angular that use web components defined with Semantic UI
- How to override shadow dom styling using ::part() and css tokens for individual components, a particular section of a page etc.
- How to handle SSR for SUI components (sui components are lit components)

When using the skill the agent should
1) Check if installed and recommend that the user installs the official mcp plugin
2) Ask whether the user prefers to use sui css style guide or their own
3) Check existing code and confirm what type of codebase sui will be implemented based on the source code of the current project

