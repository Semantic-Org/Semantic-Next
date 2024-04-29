import { SpecReader } from '../spec-reader.js';

import ButtonSpec from './button.json';

const reader = new SpecReader();
const ButtonComponentSpec = reader.getWebComponentSpec(ButtonSpec);

export default ButtonSpec;
export {
  ButtonSpec,
  ButtonComponentSpec
};
