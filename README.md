## Semantic-UI

Semantic UI Next is an attempt at creating a generalized format of UI component using web components. Web components are well implemented but have some obvious downsides which hinder adoptions. 

### HTML 

Semantic UI supports three dialects which each will produce the same components. They are designed to support different types of developers and different types of viewpoints on code. [Evan You of VueJS](https://www.youtube.com/watch?v=YMwCPfABwHg) does a great job of covering this topic.

Dialects are designed to appeal to different types of developers (language speakers) with different needs and expectations. This is to allow developers to choose to code in the way that comes most natural to them.

#### Dialect #1 - Natural Language

This is the sweet spot between terse and expressive, and designed to be the closest to natural language. 

One large advantage here is you can write out modifiers without having to think of their class grouping: "I want to make this button large", what did they call the quality of largeness again? Oh that's right "size" or was it "sizing"? Argh let me look it up.

```html
<ui-button large primary>
  Download
</ui-button>
```

In addition Semantic provides a generalized component `ui-` which allows you to preserve natural word order (unfortunately web components [mandate a "-" is present](https://blog.jim-nielsen.com/2023/validity-of-custom-element-tag-names/) leaving it slightly suboptimal.
```html
<ui- large primary button>
  Download
</ui->
```

#### Dialect #2 Classic

If you are working with regular DOM or using element descriptions to reference them in Javascript using class names can be the easiest approach. For those coming from Semantic UI Classic this will also be the most familiar. (Note you can still do this with attributes but its much more cumbersome and unfamiliar for some)

```html
<ui-button class="large primary">
  Download
</ui-button>

<style>
  ui-button.primary {
    background-color: #FA0000; 
  }
</style>
```

#### Dialect #3 - Computer Language (Verbose)

For developers who dont like leaving anything to interpretation, or prefer standards to personal preference -- or perhaps yet have other vanilla web components that are already in their codebase and prefer consistency. 

```html
<ui-button size="large" emphasis="secondary">
  Follow
</ui-button>
```

### CSS

Web components lock down styles using the Shadow DOM but this makes it difficult to make small modifications to a component for a particular placement. Semantic has a few tricks up its sleave to help with this.

* Semantic provides the `exposed` attribute to specify that a given instance should render to regular DOM. Slots are emulated and render identically.

```html
<ui-button large red exposed>Hello</ui-button>
```

* In addition Semantic includes the `tweaks` attribute which lets you apply tailwind style classes to modify an existing instance without writing css. These styles are not part of a component definition, and are available in any component and let you do most of the things you'd want to adjust.
```html
<ui-button large red tweaks="20px underlined"></ui-button>
```

### Javascript

For most run-of-the-mill use cases people want a simple way to initialize a component with behaviors, pass in some data like callbacks and configure some settings. This can be difficult with web components as they expect you to pass settings in a mixture of attributes and properties and to consume callbacks as events. You can still do those with Semantic UI, but we provide alternatives which may be easier in some use cases or for novices.

Semantic UI provides a 3kb modern [DOM query library](https://github.com/jlukic/semantic-next/tree/main/packages/query) built with modern ECMAScript which lets you interact with elements. It also provides familiar patterns for initializing components out of the box.

traditional way 
```javascript
let dropdown = document.querySelectorAll('ui-dropdown')[0];
dropdown.items = itemArray;
dropdown.allowAdditions = true;
dropdown.attachEventListener('change', (value) => console.log(value));
```

using query
```javascript
$('ui-dropdown').dropdown({
  items: itemArray,
  allowAdditions: true,
  onChange: (value) => console.log(value)
});
// composed automatically for you
// el.allowAdditions = true;
// event bound to change event
```


### Tech

Rendering is done using [`Lit-HTML`](https://krausest.github.io/js-framework-benchmark/index.html) under the hood, which is [pretty fast](https://krausest.github.io/js-framework-benchmark/index.html). Lit code is compiled from a simple custom templating language loosely inspired by Meteor JS. 
