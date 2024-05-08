import { SpecReader } from '@semantic-ui/specs';

import ButtonSpec from './button.json';

const reader = new SpecReader();
const ButtonComponentSpec = reader.getWebComponentSpec(ButtonSpec);

export default ButtonSpec;
export {
  ButtonSpec,
  ButtonComponentSpec
};
