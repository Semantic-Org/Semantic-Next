import { noChange, html, nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { Reaction } from '@semantic-ui/reactivity';
import { each, hashCode, values } from '@semantic-ui/utils';

class ReactiveEachDirective extends AsyncDirective {
  constructor(partInfo) {
    super(partInfo);
    this.reaction = null;
  }

  render(eachCondition, data) {
    // Ensure existing reaction is stopped
    if (this.reaction) {
      this.reaction.stop();
    }

    let templateIndex = {};
    let templates = [];
    let lastTemplates = [];

    let compileHTML = () => {
      let strings = templates.map(v => '');
      strings.push('');
      strings.raw = [];
      return html.apply(this, [strings, ...templates]);
    };

    this.reaction = Reaction.create((comp) => {
      const values = eachCondition.over();
      lastTemplates = templates;
      templates = [];
      if(values?.length) {
        each(values, (value, index) => {
          let eachData = {
            ...data,
            '@index': index,
          };
          if(!value._id) {
            value._id = hashCode(value);
          }
          if(eachCondition.as) {
            eachData[eachCondition.as] = value;
          }
          else {
            eachData = {
              ...eachData,
              ...value
            };
          }

          // reuse existing template if rendered
          const lastIndex = templateIndex[value._id];
          let html;
          if(lastIndex >= 0) {
            html = lastTemplates[lastIndex];
          }
          else {
            html = eachCondition.content(eachData);
          }
          // we store location so we can move them around y
          templateIndex[value._id] = index;
          templates.push(html);

        });
      }

      if(!comp.firstRun) {
        this.setValue(compileHTML());
      }
    });
    return compileHTML();
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

export const reactiveEach = directive(ReactiveEachDirective);
