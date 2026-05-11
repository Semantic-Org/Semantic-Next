import { Reaction } from '@semantic-ui/reactivity';
import { each, isArray, isClient, isFunction, isObject } from '@semantic-ui/utils';
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
    let initialFormatted = nothing;
    let context = {
      message: `if/else statement: {#if ${conditional.expression}}`,
      conditional: conditional,
    };

    // Create a new reaction that watches for reactive changes on client.
    // formatForPart is invoked INSIDE the reaction (even on firstRun) so
    // its serialization reads — which call .value() on inner directive
    // markers — register signal deps on this reaction. Without that,
    // inner expressions in a branch never propagate signal changes
    // through this directive's setValue.
    // matchIndex gating is intentionally absent — content can change
    // within the same branch when inner expressions update.
    if (isClient) {
      this.reaction = Reaction.create((comp) => {
        if (!this.isConnected) {
          comp.stop();
          return;
        }

        const result = this.getBranch(this.conditional);
        this.matchIndex = result.matchIndex;
        content = result.content;
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
      const result = this.getBranch(this.conditional);
      content = result.content;
      initialFormatted = this.formatForPart(content);
    }

    return initialFormatted;
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

    // TemplateResult: interleave static strings with evaluated values so
    // branch content like `active-{count}` produces `active-5`, not
    // `active-` (the old strings.join('') bug). Values may be lit
    // directive markers (from inner expressions) — resolveValue extracts
    // the actual value via the directive's first arg's .value() callback.
    if (content?.strings) {
      const { strings, values } = content;
      let result = '';
      for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
          result += this.resolveValue(values[i]);
        }
      }
      return result;
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

  // Inner expressions inside a branch land in the TemplateResult's `values`
  // array as lit directive markers (reactiveData results), not evaluated
  // primitives — lit normally resolves these when placing into a part. For
  // attribute-position serialization we resolve manually by calling the
  // directive's first arg's .value() callback (attached by LitRenderer's
  // evaluateExpression). Same pattern as ReactiveRerenderDirective.
  resolveValue(v) {
    if (isFunction(v?.values?.[0]?.value)) {
      return String(v.values[0].value() ?? '');
    }
    if (v?.strings) {
      return this.serializeContent(v);
    }
    if (isArray(v) || isObject(v)) {
      try {
        return JSON.stringify(v);
      }
      catch (e) {
        return String(v);
      }
    }
    return String(v ?? '');
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

export const reactiveConditional = directive(ReactiveConditionalDirective);
