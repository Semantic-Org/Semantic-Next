# @semantic-ui/specs

This package provides spec files which are used to define the specifications of UI components built into Semantic UI.

Spec files are used for several things
* Used to define the enumerable properties of the component
* Help explain which the purpose of a property: for example some properties represent state, are mutually exclusive (types) or mutually inclusive (variations)
* Can define 'settings', which are parameters which modify behavior of a component but are not intrinsic to their form.
* Are used to generate sample code and documentation for components (the Semantic UI definition pages are programatically generated from these files!)
* Provide a `usageLevel` or level of adoption for a portion of a component.
* Enumerate `options` for an attribute, for example for colors the available colors in the library, like `red` and `purple`. These can be arbitrary but should provide enough options to be useful—see [color term heirarchy](https://en.wikipedia.org/wiki/Color_term#Color-term_hierarchy))
** This can be used to generate versions of the component which do not include the additional css and theming variables required to accomodate unusual settings, and allow for the component to be extended without increasing the core component size.
* Define *plurality* or how a button can exist in a group, including which variations can be shared across a group. For example `large buttons` and `large button`

## Structure

There is a annotated sample spec file which can be used to introduce yourself to the format. The sections of a specification will vary by the component type, but can include any of the following content.

### Basic Details
** Basic information on the name of the named export, ui type, tag name etc.

### Content
** Content is not synonymous for slots, but instead refers to types of content that can be slotted in the light DOM.
** These are often *subcomponent* which are web components used inside this UI component, for instance a button group might have an 'or' conditional, an `icon`, etc.
** They may also refer to other standalone components that have a `looseCoupling` or have additional styling when slotted inside this component.

### Types

Types are mutually exclusive versions of an element that are modifications of the element's standard appearance.

Types cannot be used simultaneously on the same element. For example, "cats" and "dogs" are types of animals, but a single animal cannot be both.

### State

States are modifications in an element that help indicate a change in the component that may modify its behavior. This may include states like `loading`, `disabled`, or `active`.

### Variations

Variations are modifications of individual qualities of an element like size, or color. They are not mutually exclusive, and can be used together to modify an element.



