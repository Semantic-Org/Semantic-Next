import { createComponent } from '../lib/create-component.js';
import { ReactiveVar, Reaction } from '../lib/reactive.js';
import { ButtonDefinition, ButtonTemplate, ButtonCSS } from './';

const UIButton = {

  createInstance: function(tpl, $) {
    return {
      fun: new ReactiveVar(false),
      property: true,
      anotherProp: '1',
      getLove() {
        return 'love';
      }
    };
  },

  onCreated: function(tpl) {
    let settings = new ReactiveVar({
      fun: true,
      trucks: true,
    });
    Reaction.create(function() {
      if(settings.value.fun) {
        console.log('We have fun!');
      }
      else {
        console.log('No fun!');
      }
    });
    Reaction.create(function() {
      if(settings.value.trucks) {
        console.log('We have trucks!');
      }
      else {
        console.log('No trucks!');
      }
    });

    setTimeout(() => {
      let newSettings = settings.get();
      newSettings.fun = false;
      settings.set(newSettings);
    }, 500);
  },

  onRendered: function() {
    // called when rendered to DOM
  },

  onDestroyed: function() {
    // called when removed from DOM
  },

  events: {
    'click .button'(event, tpl) {
      tpl.$('.button')
        .css({
          color: 'red',
          backgroundColor: 'black',
        })
        .find('.text')
          .text('text')
      ;
    }
  }

};

createComponent('ui-button', {
  type: 'element',
  definition: ButtonDefinition,
  template: ButtonTemplate,
  css: ButtonCSS,
  ...UIButton,
});

/*
// Mock console.log for testing
const originalConsoleLog = console.log;
let logOutput = [];
console.log = (message) => logOutput.push(message);

// Set up ReactiveVars
let varA = new ReactiveVar(0);
let varB = new ReactiveVar(0);

// Set up Reactions
Reaction.create(() => {
  console.log(`Reaction for A: ${varA.value}`);
});
Reaction.create(() => {
  console.log(`Reaction for B: ${varB.value}`);
});

// Modify ReactiveVars
varA.value = 1;
varB.value = 2;

// Flush the system
Reaction.flush();

// Check if the queue behaved as expected
console.log('Checking queue behavior...');
const expectedOutput = [
  'Reaction for A: 1',
  'Reaction for B: 2',
  'Checking queue behavior...'
];
let testPassed = JSON.stringify(logOutput) === JSON.stringify(expectedOutput);

// Restore original console.log
console.log = originalConsoleLog;

// Output test result
console.log('Queue Behavior Test:', testPassed ? 'PASSED' : 'FAILED');
*/

export { UIButton };
