# Query Core Methods - Consolidated Proposal

> **Scope:** Essential methods for core Query functionality  
> **Status:** Consolidated from multiple proposals  
> **Size Impact:** Minimal (<2KB total gzipped)

---

## Overview

This document consolidates essential missing methods for the Query library that provide fundamental DOM manipulation capabilities with minimal complexity and file size impact. All methods maintain consistency with existing Query patterns and Shadow DOM awareness.


---

## Shadow DOM Enhancements

### `contains(selector)`
Check if elements contain targets. Automatically Shadow DOM aware based on `this.options.pierceShadow`.

- `selector` - String | Element | Query to check containment

**Implementation:** Use DOM `.contains()` or deep traversal based on `this.options.pierceShadow`  
**Returns:** Boolean true if any element contains the target
