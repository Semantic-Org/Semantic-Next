import { reaction } from '@semantic-ui/reactivity';
import { isClient } from '@semantic-ui/utils';
import { noChange, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';
import { choose } from 'lit/directives/choose.js';

import { serializeContent } from './serialize-content.js';

/*
  Value-based branching for {#match}. The discriminant is evaluated once,
  then each {is} case matches on loose == against any of its values, with
  {else} as fallback — identical semantics to the native match block.

  Lit's choose() directive does the body dispatch: we resolve the matching
  branch index ourselves (== + multi-value, which choose's strict === can't
  express), key each {is} case by its branch index, and map {else} to
  choose's defaultCase. A -1 key (no case matched) falls through to it.
*/
export class ReactiveMatchDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.partInfo = partInfo;
    this.reaction = null;
  }

  render(matchBlock) {
    this.matchBlock = matchBlock;

    // Reuse existing reaction — signals and dataVersion handle updates
    if (this.reaction) {
      return noChange;
    }

    let initialFormatted = nothing;
    const context = {
      message: `match statement: {#match ${matchBlock.discriminant}}`,
      match: matchBlock,
    };

    // formatForPart runs inside the reaction so branch-content serialization
    // (which reads inner directive markers) registers signal deps here —
    // otherwise inner expressions never propagate through this directive.
    if (isClient) {
      this.reaction = reaction((comp) => {
        if (!this.isConnected) {
          comp.stop();
          return;
        }
        const content = this.getContent(this.matchBlock);
        const formatted = this.formatForPart(content);
        if (comp.firstRun) {
          initialFormatted = formatted;
        }
        else {
          this.setValue(formatted);
        }
        return content;
      }, { context });
    }
    else {
      initialFormatted = this.formatForPart(this.getContent(this.matchBlock));
    }

    return initialFormatted;
  }

  getContent(matchBlock) {
    const discriminant = matchBlock.discriminant();
    const branches = matchBlock.branches || [];

    const cases = [];
    let defaultCase = null;
    let matchedKey = -1;
    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];
      if (branch.type === 'is') {
        cases.push([i, branch.content]);
        if (matchedKey === -1 && branch.values.some((value) => value() == discriminant)) {
          matchedKey = i;
        }
      }
      else if (branch.type === 'else') {
        defaultCase = branch.content;
      }
    }

    const content = choose(matchedKey, cases, defaultCase);
    return content == null ? nothing : content;
  }

  formatForPart(content) {
    switch (this.partInfo.type) {
      case PartType.ATTRIBUTE:
      case PartType.BOOLEAN_ATTRIBUTE:
        return serializeContent(content);
      default:
        return content;
    }
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

export const reactiveMatch = directive(ReactiveMatchDirective);
