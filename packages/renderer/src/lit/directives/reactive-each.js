import { nothing } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';

import { isPlainObject, isArray, isString, arrayFromObject } from '@semantic-ui/utils';

export class ReactiveEachDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.items = [];
    this.eachCondition = null;
  }

  render(eachCondition, settings = {}) {
    this.eachCondition = eachCondition;

    // Stop existing reaction
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }

    // Create a new reaction
    this.reaction = Reaction.create((computation) => {
      if (!this.isConnected) {
        computation.stop();
        return;
      }
      this.items = this.getItems(this.eachCondition);
      if (!computation.firstRun) {
        const rendered = this.renderItems();
        this.setValue(rendered);
      }
    });

    return this.renderItems();
  }

  renderItems() {
    let items = this.getItems(this.eachCondition);
    if(!items?.length > 0 && this.eachCondition.else) {
      // this is necessary to avoid lit errors
      return repeat(
        [1],
        () => 'else-case',
        () => this.eachCondition.else()
      );
    }
    // this turns { a: 'b'} to [{key: 'a', value: 'b'}]
    // for use with repeat
    const collectionType = this.getCollectionType(items);
    if(collectionType == 'object') {
      items = arrayFromObject(items);
      console.log(items);
    }
    return repeat(
      items,
      (item, indexOrKey) => this.getItemID(item, indexOrKey, collectionType),
      (item, indexOrKey) => this.getTemplate(item, indexOrKey, collectionType)
    );
  }

  getCollectionType(items) {
    if(isArray(items)) {
      return 'array';
    }
    return 'object';
  }

  getItems() {
    return this.eachCondition.over() || [];
  }

  getTemplate(item, indexOrKey, collectionType) {
    const templateData = this.getEachData(item, indexOrKey, collectionType, this.eachCondition);
    return this.eachCondition.content(templateData);
  }

  getItemID(item, indexOrKey, collectionType) {
    if (isPlainObject(item)) {
      // if this is an object we want to prefer the object key as an id
      const key = (collectionType == 'object')
        ? indexOrKey
        : undefined
      ;
      return key || item._id || item.id || item.key || item.hash || item._hash || item.value || indexOrKey;
    }
    if (isString(item)) {
      return item;
    }
    return indexOrKey;
  }

  getEachData(item, indexOrKey, collectionType, eachCondition) {
    let { as, indexAs } = eachCondition;

    // add default index/key values
    if(!indexAs) {
      indexAs = (collectionType == 'array')
        ? 'index'
        : 'key'
      ;
    }
    // handle conversion of object to array
    if(collectionType == 'object') {
      indexOrKey = item.key;
      item = item.value;
    }

    // if 'as' is specified we pass the whole value as an item
    // otherwise we spread the value to data context
    return as
      ? { [as]: item, [indexAs]: indexOrKey }
      : { ...item, this: item, [indexAs]: indexOrKey };
  }


  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }

  reconnected() {
    // The reaction will be recreated in the next render
  }
}

export const reactiveEach = directive(ReactiveEachDirective);
