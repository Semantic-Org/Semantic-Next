# Center – E&O Review Log

Editorial decisions made during error & omission reviews. Each entry captures when a change occurred, which section of the research it touched, the type of update, and why the adjustment was necessary.

| Date       | Section / Scope                         | Change Type      | Summary                                                                 | Rationale / Evidence                                                                                           |
|------------|-----------------------------------------|------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| 2025-11-10 | Type Patterns table → Polymorphic element row | Data correction | Updated polymorphic support prevalence to 2/2 (100%) and clarified that Chakra UI exposes `as` while Mantine uses `component`. | Chakra Center inherits the Box `as` prop for semantic overrides (`ai/research/center/chakra-ui/usage-patterns.md:470-478`); Mantine documents `component` in its prop table (`ai/research/center/mantine/usage-patterns.md:52-80`). Both frameworks therefore offer native polymorphism, so the pattern is universal (`ai/research/center/pattern-research.md:48-55`). **Confidence:** 90% (direct prop references). |
