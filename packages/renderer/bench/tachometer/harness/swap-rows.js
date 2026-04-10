import * as bench from '/bench.js';
import { afterRender, mount } from './bench-utils.js';

const el = mount();
await afterRender();
el.component.create(1000);
await afterRender();

bench.start();
el.component.swapRows();
await afterRender();
bench.stop();
