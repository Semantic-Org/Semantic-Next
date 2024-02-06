import { nothing, noChange } from 'lit';
import { directive } from 'lit/directive.js';
import {
  insertPart,
  getCommittedValue,
  removePart,
  setCommittedValue,
  setChildPartValue,
} from 'lit/directive-helpers.js';
import { repeat } from 'lit/directives/repeat.js';
import { AsyncDirective } from 'lit/async-directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { hashCode, each, isObject, isString } from '@semantic-ui/utils';

class ReactiveEachDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.part = null;
    this.host = partInfo.options.host;
    this.initialized = false;
    this.childParts = [];
  }

  render(eachCondition, data) {
    if (!this.initialized) {
      this.initialRender(eachCondition, data);
    }
    if (!this.reaction) {
      this.reaction = Reaction.create((comp) => {
        if(!this.isConnected) {
          comp.stop();
          return nothing;
        }
        const items = this.getItems(eachCondition); // setup reactivity
        if (comp.firstRun) {
          return;
        }
        this.updateItems(items, data, eachCondition);
      });
    }
    const content = this.childParts.map(part => part.content);
    return content;
  }

  update(part, settings) {
    this.part = part;
    return this.render.apply(this, settings);
  }

  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
    // dispose of child parts
    //this.childParts.forEach(removePart);
    //this.childParts = [];
  }

  getItems(eachCondition) {
    let items = eachCondition.over() || [];
    items = items.map(item => {
      if (isObject(item)) {
        item._id = item._id || hashCode(item);
      }
      return item;
    });
    return items;
  }

  initialRender(eachCondition, data, items = this.getItems(eachCondition)) {
    const childParts = this.getChildParts(items, data, eachCondition);
    childParts.forEach((childPart, index) => {
      const newPart = insertPart(this.part);
      setChildPartValue(newPart, childPart.content);
      insertPart(this.part, newPart);
    });
    this.childParts = childParts;
    console.log('setting', childParts);
    this.initialized = true;
  }

  getChildParts(items, data, eachCondition, { parseTemplate = true } = {}) {
    const childParts = [];
    // get html and id for each item
    items.forEach((item, index) => {
      childParts.push({
        id: this.getItemID(item),
        content: (parseTemplate)
          ? this.getTemplateContent(item, index, data, eachCondition)
          : () => this.getTemplateContent(item, index, data, eachCondition)
      });
    });
    return childParts;
  }

  updateItems(items, data, eachCondition) {
    const previousParts = getCommittedValue(this.part);
    const oldParts = this.childParts;
    each(oldParts, (oldPart, index) => {
      oldPart.part = previousParts[index];
    });
    // we dont want to create new templates unless we are inserting a new part
    const newParts = this.getChildParts(items, data, eachCondition, {
      parseTemplate: false
    });
    this.changeParts(oldParts, newParts);
  }
  changeParts(oldParts, newParts) {
    const containerPart = this.part;
    const oldIndexMap = new Map(oldParts.map((item, index) => [item.id, index]));
    const newIndexMap = new Map(newParts.map((item, index) => [item.id, index]));

    let committedParts = [];
    let childParts = [];

    newParts.forEach((newPart, newIndex) => {
      const previousIndex = oldIndexMap.get(newPart.id);
      if (newIndex == previousIndex) {
        // no change
        const existingPart = oldParts[newIndex];
        childParts.push(existingPart);
        console.log('kept', existingPart.id, newIndex);
        committedParts.push(existingPart.part);
      }
      else if(previousIndex !== undefined) {
        // content moved position
        const oldPart = oldParts[newIndex];
        const movedPart = oldParts[previousIndex];
        const newChildPart = setChildPartValue(oldPart.part, movedPart.content);
        console.log('moved', movedPart.id, movedPart.part, newIndex);
        committedParts.push(newChildPart);
        childParts.push({
          ...movedPart,
          part: newChildPart
        });
      }
      else {
        // new content
        const newChildPart = insertPart(containerPart);
        const partContent = newPart.content();
        setChildPartValue(newChildPart, partContent);
        committedParts.push(newChildPart);
        childParts.push({
          id: newPart.id,
          part: newChildPart,
          content: partContent,
        });
      }
    });

    // remove items
    oldParts.forEach(oldValue => {
      if (!newIndexMap.has(oldValue.id)) {
        console.log('removed', oldValue.id);
        //removePart(oldValue.part);
      }
    });
    this.childParts = childParts;
    console.log('setting comitted values', committedParts);
    setCommittedValue(containerPart, committedParts);
  }

  createRepeat(eachCondition, data, items = this.getItems(eachCondition)) {
    if (!items?.length) {
      return nothing;
    }
    return repeat(items, this.getItemID, (item, index) => {
      return this.getTemplateContent(item, index, data, eachCondition);
    });
  }

  getTemplateContent(item, index, data, eachCondition) {
    let eachData = this.prepareEachData(item, index, data, eachCondition.as);
    return eachCondition.content(eachData);
  }

  getItemID(item) {
    if(isObject(item)) {
      return item._id || item.id || item.key || item.hash || hashCode(item);
    }
    if(isString) {
      return item;
    }
  }

  prepareEachData(item, index, data, alias) {
    return alias
      ? { ...data, [alias]: item, '@index': index }
      : { ...data, ...item, '@index': index }
    ;
  }
}

export const reactiveEach = directive(ReactiveEachDirective);
