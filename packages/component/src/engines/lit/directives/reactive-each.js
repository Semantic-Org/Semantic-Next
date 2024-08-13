import { nothing, noChange } from 'lit';
import { directive } from 'lit/directive.js';
import { insertPart, getCommittedValue, removePart, setCommittedValue, setChildPartValue } from 'lit/directive-helpers.js';
import { AsyncDirective } from 'lit/async-directive.js';

import { Reaction } from '@semantic-ui/reactivity';
import { hashCode, clone, isEqual, each, isPlainObject, isString } from '@semantic-ui/utils';

const generateMap = (list, start, end) => {
  const map = new Map();
  for (let i = start; i <= end; i++) {
    map.set(list[i], i);
  }
  return map;
};

export class ReactiveEachDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.part = null;
    this.eachCondition = null;
    this.host = partInfo?.options?.host;
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
    return this.getValuesAndKeys().values.map(
      (value, index) => value(index).content
    );
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
    if(!items?.map) {
      return;
    }
    items = items.map((item, index) => {
      if (isPlainObject(item) && !this.getItemID(item, index)) {
        item._hash = hashCode(item);
      }
      return item;
    });
    return items;
  }

  getValuesAndKeys(items = this.getItems()) {
    const keys = [];
    const values = [];
    items = items || [];
    each(items, (item, index) => {
      keys[index] = this.getItemID(item, index);
      // we only want to lazily get new template if the contents have changed
      values[index] = (passedIndex = index) => {
        return this.getTemplate(item, passedIndex);
      };
    });
    return {
      values,
      keys,
    };
  }

  getItemID(item, index) {
    if (isPlainObject(item)) {
      return item._id || item.id || item.value || item.key || item.hash || item._hash || index;
    }
    if (isString) {
      return item;
    }
    return index;
  }

  getEachData(item, index, alias) {
    return alias
      ? { [alias]: item, '@index': index }
      : { ...item, this: item, '@index': index };
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
  updatePart(oldPart, newValue, index) {
    const template = newValue(index);
    if (template.cached) {
      return oldPart; // Reuse the old part without re-rendering
    } else {
      return setChildPartValue(oldPart, template.content);
    }
  }

  detectShift(oldKeys, newKeys) {
    if (oldKeys.length === 0 || newKeys.length === 0) return 0;

    // Check for a positive shift (insertion at the beginning)
    if (oldKeys.every((key, index) => key === newKeys[index + 1])) {
      return 1;
    }

    // Check for a negative shift (deletion at the beginning)
    if (newKeys.every((key, index) => key === oldKeys[index + 1])) {
      return -1;
    }

    return 0; // No shift detected
  }

  updateItems(items = this.getItems()) {
    const containerPart = this.part;
    if (!containerPart) return;

    const oldParts = getCommittedValue(containerPart);
    const { values: newValues, keys: newKeys } = this.getValuesAndKeys(items);

    if (!Array.isArray(oldParts)) {
      this._itemKeys = newKeys;
      return newValues;
    }

    const oldKeys = this._itemKeys || [];
    let newParts = [];

    // Detect shift
    const shift = this.detectShift(oldKeys, newKeys);

    if (shift === 1) {
      // Handle insertion at the beginning
      const newPart = insertPart(containerPart, oldParts[0]);
      newParts[0] = this.updatePart(newPart, newValues[0], 0);
      for (let i = 1; i < newKeys.length; i++) {
        if (i - 1 < oldParts.length) {
          newParts[i] = oldParts[i - 1];
        } else {
          // Handle case where new items are added at the end after a shift
          const newEndPart = insertPart(containerPart, newParts[i - 1]);
          newParts[i] = this.updatePart(newEndPart, newValues[i], i);
        }
      }
      this._itemKeys = newKeys;
      setCommittedValue(containerPart, newParts);
      return newParts;
    } else if (shift === -1) {
      // Handle deletion at the beginning
      removePart(oldParts[0]);
      newParts = oldParts.slice(1);
      this._itemKeys = newKeys;
      setCommittedValue(containerPart, newParts);
      return newParts;
    }

    // Regular diffing algorithm (unchanged)
    let oldHead = 0;
    let oldTail = oldParts.length - 1;
    let newHead = 0;
    let newTail = newValues.length - 1;

    while (oldHead <= oldTail && newHead <= newTail) {
      if (oldParts[oldHead] === null) {
        oldHead++;
      } else if (oldParts[oldTail] === null) {
        oldTail--;
      } else if (oldKeys[oldHead] === newKeys[newHead]) {
        newParts[newHead] = this.updatePart(oldParts[oldHead], newValues[newHead], newHead);
        oldHead++;
        newHead++;
      } else if (oldKeys[oldTail] === newKeys[newTail]) {
        newParts[newTail] = this.updatePart(oldParts[oldTail], newValues[newTail], newTail);
        oldTail--;
        newTail--;
      } else if (oldKeys[oldHead] === newKeys[newTail]) {
        newParts[newTail] = this.updatePart(oldParts[oldHead], newValues[newTail], newTail);
        insertPart(containerPart, newParts[newTail + 1], oldParts[oldHead]);
        oldHead++;
        newTail--;
      } else if (oldKeys[oldTail] === newKeys[newHead]) {
        newParts[newHead] = this.updatePart(oldParts[oldTail], newValues[newHead], newHead);
        insertPart(containerPart, oldParts[oldHead], oldParts[oldTail]);
        oldTail--;
        newHead++;
      } else {
        const oldIndex = oldKeys.indexOf(newKeys[newHead]);
        if (oldIndex === -1) {
          // New item
          const newPart = insertPart(containerPart, oldParts[oldHead]);
          newParts[newHead] = this.updatePart(newPart, newValues[newHead], newHead);
        } else {
          // Moved item
          newParts[newHead] = this.updatePart(oldParts[oldIndex], newValues[newHead], newHead);
          insertPart(containerPart, oldParts[oldHead], oldParts[oldIndex]);
          oldParts[oldIndex] = null;
        }
        newHead++;
      }
    }

    // Add remaining new items
    while (newHead <= newTail) {
      const newPart = insertPart(containerPart, newParts[newTail + 1]);
      newParts[newHead] = this.updatePart(newPart, newValues[newHead], newHead);
      newHead++;
    }

    // Remove remaining old items
    while (oldHead <= oldTail) {
      const oldPart = oldParts[oldHead];
      if (oldPart !== null) {
        removePart(oldPart);
      }
      oldHead++;
    }

    this._itemKeys = newKeys;
    setCommittedValue(containerPart, newParts);
    return newParts;
  }
}

export const reactiveEach = directive(ReactiveEachDirective);
