import { noChange, nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { getCommittedValue, insertPart, removePart, setChildPartValue,
  setCommittedValue } from 'lit/directive-helpers.js';
import { AsyncDirective } from 'lit/async-directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { clone, each, hashCode, isEqual, isObject, isString } from '@semantic-ui/utils';

const generateMap = (list, start, end) => {
  const map = new Map();
  for (let i = start; i <= end; i++) {
    map.set(list[i], i);
  }
  return map;
};

class ReactiveEachDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.part = null;
    this.eachCondition = null;
    this.host = partInfo.options.host;
    this.initialized = false;
    this.childParts = [];
    this.templateCachedIndex = new Map();
    this.templateCachedData = new Map();
    this.templateCache = new Map();
  }

  render(eachCondition, data) {
    this.eachCondition = eachCondition;
    if (!this.reaction) {
      this.reaction = Reaction.create((comp) => {
        if (!this.isConnected) {
          comp.stop();
          return nothing;
        }
        const items = this.getItems(eachCondition); // setup reactivity
        this.updateItems(items);
      });
    }
    return this.getValuesAndKeys().values.map((value, index) => value(index).content);
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
  }

  getItems() {
    let items = this.eachCondition.over() || [];
    items = items.map(item => {
      if (isObject(item)) {
        item._id = item._id || hashCode(item);
      }
      return item;
    });
    return items;
  }

  getValuesAndKeys(items = this.getItems()) {
    const keys = [];
    const values = [];
    each(items, (item, index) => {
      keys[index] = this.getItemID(item, index);
      // we only want to lazily get new template if the contents have changed
      values[index] = (passedIndex) => {
        return this.getTemplate(item, passedIndex);
      };
    });
    return {
      values,
      keys,
    };
  }

  getItemID(item, index) {
    if (isObject(item)) {
      return item._id || item.id || item.key || item.hash || index;
    }
    if (isString) {
      return item;
    }
    return index;
  }

  getEachData(item, index, alias) {
    return alias
      ? { [alias]: item, '@index': index }
      : { ...item, '@index': index };
  }

  getTemplate(item, index) {
    // memoize this
    let eachData = this.getEachData(item, index, this.eachCondition.as);
    const itemID = this.getItemID(item, index);
    const sameIndex = this.templateCachedIndex.get(itemID) == index;
    const sameData = isEqual(this.templateCachedData.get(itemID), eachData);
    if (sameIndex && sameData) {
      // reuse the template nothing to rerender
      return {
        cached: true,
        content: this.templateCache.get(itemID),
      };
    }
    else {
      // something has changed for this template
      const content = this.eachCondition.content(eachData);
      this.templateCachedIndex.set(itemID, index);
      this.templateCachedData.set(itemID, clone(eachData));
      this.templateCache.set(itemID, content);
      return {
        cached: false,
        content: content,
      };
    }
  }

  /*
    Adapted from Lit's Repeat Directive
    The key difference is we dont want to rerender templates (call content())
    if the position doesnt move.
  */
  updateItems(items = this.getItems()) {
    const containerPart = this.part;
    const oldParts = getCommittedValue(containerPart);
    const { values: newValues, keys: newKeys } = this.getValuesAndKeys(items);
    if (!Array.isArray(oldParts)) {
      this._itemKeys = newKeys;
      return newValues;
    }

    const oldKeys = (this._itemKeys ??= []);
    const newParts = [];
    let newKeyToIndexMap;
    let oldKeyToIndexMap;
    let oldHead = 0;
    let oldTail = oldParts.length - 1;
    let newHead = 0;
    let newTail = newValues.length - 1;
    while (oldHead <= oldTail && newHead <= newTail) {
      if (oldParts[oldHead] === null) {
        oldHead++;
      }
      else if (oldParts[oldTail] === null) {
        oldTail--;
      }
      else if (oldKeys[oldHead] === newKeys[newHead]) {
        // MODIFIED FROM REPEAT
        // WE DONT WANT TO REPULL TEMPLATE HERE
        const template = newValues[newHead](newHead);
        if (template.cached) {
          newParts[newHead] = oldParts[oldHead];
        }
        else {
          newParts[newHead] = setChildPartValue(
            oldParts[oldHead],
            template.content,
          );
        }
        oldHead++;
        newHead++;
      }
      else if (oldKeys[oldTail] === newKeys[newTail]) {
        newParts[newTail] = setChildPartValue(
          oldParts[oldTail],
          newValues[newTail](newTail).content,
        );
        oldTail--;
        newTail--;
      }
      else if (oldKeys[oldHead] === newKeys[newTail]) {
        newParts[newTail] = setChildPartValue(
          oldParts[oldHead],
          newValues[newTail](newTail).content,
        );
        insertPart(containerPart, newParts[newTail + 1], oldParts[oldHead]);
        oldHead++;
        newTail--;
      }
      else if (oldKeys[oldTail] === newKeys[newHead]) {
        newParts[newHead] = setChildPartValue(
          oldParts[oldTail],
          newValues[newHead](newHead).content,
        );
        insertPart(containerPart, oldParts[oldHead], oldParts[oldTail]);
        oldTail--;
        newHead++;
      }
      else {
        if (newKeyToIndexMap === undefined) {
          newKeyToIndexMap = generateMap(newKeys, newHead, newTail);
          oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail);
        }
        if (!newKeyToIndexMap.has(oldKeys[oldHead])) {
          removePart(oldParts[oldHead]);
          oldHead++;
        }
        else if (!newKeyToIndexMap.has(oldKeys[oldTail])) {
          removePart(oldParts[oldTail]);
          oldTail--;
        }
        else {
          const oldIndex = oldKeyToIndexMap.get(newKeys[newHead]);
          const oldPart = oldIndex !== undefined ? oldParts[oldIndex] : null;
          if (oldPart === null) {
            const newPart = insertPart(containerPart, oldParts[oldHead]);
            setChildPartValue(newPart, newValues[newHead](newHead).content);
            newParts[newHead] = newPart;
          }
          else {
            newParts[newHead] = setChildPartValue(oldPart, newValues[newHead](newHead).content);
            insertPart(containerPart, oldParts[oldHead], oldPart);
            oldParts[oldIndex] = null;
          }
          newHead++;
        }
      }
    }
    while (newHead <= newTail) {
      const newPart = insertPart(containerPart, newParts[newTail + 1]);
      setChildPartValue(newPart, newValues[newHead]().content);
      newParts[newHead++] = newPart;
    }
    while (oldHead <= oldTail) {
      const oldPart = oldParts[oldHead++];
      if (oldPart !== null) {
        removePart(oldPart);
      }
    }
    this._itemKeys = newKeys;
    setCommittedValue(containerPart, newParts);
    return noChange;
  }
}

export const reactiveEach = directive(ReactiveEachDirective);
