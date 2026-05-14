import { noChange } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';
import { repeat } from 'lit/directives/repeat.js';

import { Reaction } from '@semantic-ui/reactivity';
import { arrayFromObject, clone, isClient, isEmpty, isEqual, isPlainObject } from '@semantic-ui/utils';

import { getCollectionType, getEachData, getItemID } from '../../../shared/each.js';

export class ReactiveEachDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
    this.items = [];
    this.eachCondition = null;
    this._itemSnapshots = new Map();
  }

  render(eachCondition, settings = {}) {
    this.eachCondition = eachCondition;

    // Reuse existing reaction — signals and dataVersion handle updates
    if (this.reaction) {
      return noChange;
    }

    // pass through context for debugging
    let context;
    if (eachCondition.node) {
      let { as, over } = eachCondition.node;
      context = {
        message: `reactive each: {#each ${as} in ${over}}`,
        each: eachCondition.node,
      };
    }

    let html = this.renderItems();

    if (isClient) {
      this.reaction = Reaction.create((computation) => {
        if (!this.isConnected) {
          computation.stop();
          return;
        }
        this.items = this.getItems(this.eachCondition);
        if (!computation.firstRun) {
          html = this.renderItems();
          this.setValue(html);
        }
      }, { context });
    }

    return html;
  }

  renderItems() {
    let items = this.getItems(this.eachCondition);

    // if iterable is empty (no keys or length 0) trigger else conditions
    if (this.eachCondition.elseContent && isEmpty(items)) {
      this._itemSnapshots.clear();
      // this is necessary to avoid lit errors
      // when returned lit html structure changes
      return repeat(
        [1],
        () => 'else-case',
        () => this.eachCondition.elseContent(),
      );
    }
    // this turns { a: 'b'} to [{key: 'a', value: 'b'}]
    // for use with repeat
    const collectionType = getCollectionType(items);
    if (collectionType == 'object') {
      items = arrayFromObject(items);
    }

    // Collect current keys and prune snapshots for removed items
    const currentKeys = new Set();
    items.forEach((item, indexOrKey) => {
      currentKeys.add(getItemID(item, indexOrKey, collectionType));
    });
    this._itemSnapshots.forEach((_, key) => {
      if (!currentKeys.has(key)) {
        this._itemSnapshots.delete(key);
      }
    });

    return repeat(
      items,
      (item, indexOrKey) => getItemID(item, indexOrKey, collectionType),
      (item, indexOrKey) => this.getTemplate(item, indexOrKey, collectionType),
    );
  }

  getItems() {
    return this.eachCondition.over() || [];
  }

  getTemplate(item, indexOrKey, collectionType) {
    const key = getItemID(item, indexOrKey, collectionType);

    // skip unchanged items to avoid redundant re-renders; index is part of
    // the snapshot so reorders re-evaluate template expressions that bind it
    const snapshot = this._itemSnapshots.get(key);
    if (snapshot !== undefined && snapshot.index === indexOrKey && isEqual(snapshot.item, item)) {
      return noChange;
    }
    this._itemSnapshots.set(key, {
      item: isPlainObject(item) ? clone(item) : item,
      index: indexOrKey,
    });

    const templateData = getEachData(item, indexOrKey, collectionType, this.eachCondition);
    return this.eachCondition.content(templateData, key);
  }

  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }

  reconnected() {
    // Lit calls render() on reconnect which recreates the reaction
  }
}

export const reactiveEach = directive(ReactiveEachDirective);
