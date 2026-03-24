import { Reaction } from '@semantic-ui/reactivity';
import { each, isArray, isClient, isObject } from '@semantic-ui/utils';
import { noChange, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';

export class ReactiveConditionalDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.partInfo = partInfo;
    this.reaction = null;
  }

  render(conditional) {
    this.conditional = conditional;

    // Reuse existing reaction — signals and dataVersion handle updates
    if (this.reaction) {
      return noChange;
    }

    let content = nothing;
    let context = {
      message: `if/else statement: {#if ${conditional.expression}}`,
      conditional: conditional,
    };

    // Create a new reaction that watches for reactive changes on client
    if (isClient) {
      this.reaction = Reaction.create((comp) => {
        if (!this.isConnected) {
          comp.stop();
          return;
        }

        const result = this.getBranch(this.conditional);
        const matchIndex = result.matchIndex;
        content = result.content;
        if (!comp.firstRun && this.matchIndex !== matchIndex) {
          this.matchIndex = matchIndex;
          this.setValue(content);
        }
        return content;
      }, { context });
    }
    else {
      const result = this.getBranch(this.conditional);
      content = result.content;
    }

    return this.formatForPart(content);
  }

  getBranch(conditional) {
    let matchIndex = -1;
    let content;
    if (conditional.condition()) {
      content = conditional.content();
      matchIndex = 1000; // special index for if condition
    }
    else if (conditional.branches?.length) {
      // evaluate each elseif/else branch
      each(conditional.branches, (branch, index) => {
        if (matchIndex === -1) {
          if (branch.type == 'elseif' && branch.condition()) {
            matchIndex = index;
            content = branch.content();
          }
          else if (branch.type == 'else') {
            matchIndex = index;
            content = branch.content();
          }
        }
      });
    }
    else {
      content = nothing;
      delete this.matchIndex;
    }
    if (!content) {
      content = nothing;
    }
    return { matchIndex, content };
  }

  formatForPart(content) {
    switch (this.partInfo.type) {
      case PartType.ATTRIBUTE:
      case PartType.BOOLEAN_ATTRIBUTE:
        return this.serializeContent(content);

      case PartType.CHILD:
      case PartType.PROPERTY:
      case PartType.EVENT:
      case PartType.ELEMENT:
      default:
        // For element content, return as-is (TemplateResult objects are fine here)
        return content;
    }
  }

  serializeContent(content) {
    // Handle lit's nothing value
    if (content === nothing) {
      return '';
    }

    if (content?.strings) {
      // For simple conditionals in attributes, just join the static strings
      // This works for basic cases like {#if condition}text{/if}
      return content.strings.join('');
    }

    // Handle arrays and objects like reactive-data does
    if (isArray(content) || isObject(content)) {
      try {
        return JSON.stringify(content);
      }
      catch (e) {
        return String(content);
      }
    }

    return String(content);
  }

  disconnected() {
    if (this.reaction) {
      this.reaction.stop();
      this.reaction = null;
    }
  }

  reconnected() {
    // nothing
  }
}

export const reactiveConditional = directive(ReactiveConditionalDirective);
