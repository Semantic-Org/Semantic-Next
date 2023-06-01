import { ReactiveVar, CreateReaction, AvoidReaction } from "./reactive.js";
import { _ } from "./utils.js";

class TemplateProcessor {
  constructor(templateString, context) {
    this.variableRegex = /{{\s*([a-zA-Z_$][0-9a-zA-Z_$]*)\s*}}/g;
    this.ifRegex = /{{#if\s+([^}]+)}}([\s\S]*?){{\/if}}/g;
    this.elseRegex = /{{else}}([\s\S]*?)/;
    this.templateString = templateString;
    this.dataContext = dataContext;
    this.reactiveVars = new Map();
    this.reactions = [];
  }

  process(templateString, dataContext = {}) {
    let output = templateString;

    // Wrap data context values in ReactiveVar and store in a Map
    for (const key in dataContext) {
      this.reactiveData.set(key, new ReactiveVar(dataContext[key]));
    }

    // Process if/else statements
    output = output.replace(this.ifRegex, (match, condition, content) => {
      const uid = _.hashCode(`condition:${condition}`);
      const span = document.createElement("span");
      span.setAttribute("data-uid", uid);

      const updateContent = () => {
        const conditionValue = this.getValueFromCondition(condition, this.reactiveData);

        let result;
        if (conditionValue.get()) {
          const elseMatch = content.match(this.elseRegex);
          if (elseMatch) {
            result = content.slice(0, elseMatch.index);
          } else {
            result = content;
          }
        } else {
          const elseMatch = content.match(this.elseRegex);
          if (elseMatch) {
            result = content.slice(elseMatch.index + elseMatch[0].length);
          } else {
            result = "";
          }
        }
        span.innerHTML = result;
      };

      const reactiveCondition = this.getValueFromCondition(condition, this.reactiveData);
      const reaction = CreateReaction(updateContent);
      updateContent();

      this.expressionNodes.set(uid, { expression: condition, nodes: [span], reaction });

      return span.outerHTML;
    });

    // Process variable placeholders
    output = output.replace(this.variableRegex, (match, variableName) => {
      const uid = _.hashCode(`variable:${variableName}`);
      const span = document.createElement("span");
      span.setAttribute("data-uid", uid);

      const updateVariable = () => {
        const variableValue = this.reactiveData.get(variableName);
        span.textContent = variableValue.get();
      };

      const reactiveVariable = this.reactiveData.get(variableName);
      const reaction = CreateReaction(updateVariable);
      updateVariable();

      this.expressionNodes.set(uid, { expression: variableName, nodes: [span], reaction });

      return span.outerHTML;
    });

    return output;
  }

  updateReactions() {
    for (const [uid, { expression, nodes, reaction }] of this.expressionNodes.entries()) {
      reaction();
    }
  }

  getValue(variableName, dataContext) {
    if (!this.reactiveVars.has(variableName)) {
      const initialValue = dataContext[variableName];
      this.reactiveVars.set(variableName, new ReactiveVar(initialValue));
    }

    return this.reactiveVars.get(variableName).get();
  }

  getValueFromCondition(condition, reactiveData) {
    const parts = condition.split(".");
    let value = reactiveData;

    for (const part of parts) {
      value = value.get(part);
      if (value === undefined) {
        break;
      }
    }
    return value;
  }
}

export { TemplateProcessor };
