import { defineComponent } from '@semantic-ui/component';
import { settings } from 'astro/runtime/client/dev-toolbar/settings.js';

defineComponent({
  defaultSettings: { one: 'two' },
  defaultState: { time: new Date },
  createComponent() {
    return {
      helloWorld: () => 'Hello World',
    };
  },
  onCreated(state, settings, self}) {
    self.helloWorld; // should autocomplete helloworld but is not
    const foo = state.time.now(); // should autocomplete time but does not
    // error Cannot find name 'state'.ts(2304)
    const baz = settings.one; // should autocomplete one but does not 
    // error Property 'one' does not exist on type '{ readonly config: Settings; updateSetting: <Key extends keyof Settings>(key: Key, value: Settings[Key]) => void; logger: { log: (message: string, level?: "log" | "warn" | "error" | undefined) => void; warn: (message: string) => void; error: (message: string) => void; verboseLog: (message: string) => void; }; }'.ts(2339)
  }
});
