# Proposal: A Hybrid Plugin Architecture for `@semantic-ui/query`

## 1. Goal: A Robust Plugin Ecosystem

The primary goal is to establish a formal plugin architecture for the `@semantic-ui/query` package. This architecture must empower third-party developers to extend the library's functionality in a consistent, stable, and easy-to-use manner. It should codify the best practices learned from the Semantic UI module system into the core library, reducing boilerplate and encouraging community contribution.

## 2. Architectural Strategy: A Hybrid Approach

To maximize both flexibility and developer experience, a hybrid, dual-layer architectural strategy is proposed. This provides two distinct pathways for plugin registration, catering to different needs.

### Layer 1: The Unmanaged, Low-Level API (`$.fn`)

This layer provides a direct, unmanaged entry point to the `Query` prototype.

* **Strategy**: Expose the `Query.prototype` through a conventional alias (`$.fn` and `$$.fn`). This is a classic pattern, offering an immediate "escape hatch" for developers who need complete control or are familiar with the jQuery ecosystem.
* **Use Case**: Ideal for simple, stateless plugins or for porting existing jQuery plugins with minimal changes.
* **Responsibility**: The library's only responsibility is to provide the alias. The plugin author is fully responsible for all implementation details, including state management, settings parsing, and method invocation logic.
* **Benefit**: Maximum flexibility and a zero-friction entry point for experienced developers.

**Example of the `$.fn` Strategy in Use:**
```javascript
import { $ } from '@semantic-ui/query';

// The author implements all logic, including chaining.
$.fn.makeGreen = function() {
  this.each(instance => {
    instance.elements[0].style.color = 'green';
  });
  return this;
};
```

### Layer 2: The Managed, High-Level API (`registerPlugin`)

This layer provides an opinionated, "blessed" API for creating complex plugins. It is the recommended approach for building robust, stateful modules for the ecosystem.

* **Strategy**: Export a single `registerPlugin(name, definition)` function. This function acts as a factory that takes a simple plugin definition object and wraps it in all the necessary boilerplate logic (instance management, method dispatching, etc.). This abstracts the complex patterns from Semantic UI's module system into the core.
* **The Plugin Contract**: The plugin author's responsibility is reduced to providing a simple `definition` object that adheres to a clear contract:
    * `defaults`: An object defining the default settings for the plugin.
    * `methods`: An object containing the core logic as functions. This includes a special `init` method for initialization logic.
* **The Library's Responsibilities**: The `registerPlugin` function will automatically handle the following for the plugin author:
    * **Method Dispatching**: It creates and attaches a single function to the prototype (`Query.prototype[name]`) that intelligently distinguishes between calls for initialization (e.g., `$('...').myPlugin({})`) and calls to public methods (e.g., `$('...').myPlugin('myMethod', arg1)`).
    * **Instance Management**: It transparently manages the lifecycle of a plugin instance for each DOM element. It handles creating, storing, retrieving, and (if a `destroy` method is provided) cleaning up instances. State is stored per-element, not globally.
    * **Context Provisioning**: For every method in the `methods` object, it ensures `this` refers to a dedicated instance object. This context object will be automatically populated with:
        * `this.settings`: The final, merged settings (defaults + user-provided).
        * `this.element`: The raw DOM element the instance is attached to.
        * `this.queryInstance`: The `Query` object for that element.
        * `this.name`: The name of the plugin.
    * **Lifecycle Hooks**: It automatically invokes the `init` method from the plugin definition when a new instance is created.
* **Benefit**: Drastically simplifies plugin development, enforces consistency across the ecosystem, and makes plugins easier to maintain by separating core logic from boilerplate.

**Example of the `registerPlugin` Strategy in Use:**
```javascript
import { registerPlugin } from '@semantic-ui/query';

// The author only provides the unique logic.
registerPlugin('myCoolPlugin', {
  defaults: {
    color: 'blue',
    speed: 400
  },
  methods: {
    init: function() {
      // The library provides `this.settings` and `this.element`.
      this.element.style.color = this.settings.color;
    },
    show: function() {
      // Logic for showing the element...
    },
    hide: function() {
      // Logic for hiding the element...
    }
  }
});
```

## 4. Conclusion

By adopting this hybrid architecture, `@semantic-ui/query` can offer a plugin system that is both powerfully simple for the majority of use cases (`registerPlugin`) and endlessly flexible for advanced scenarios (`$.fn`). This provides a clear path for building a rich and consistent component ecosystem.
