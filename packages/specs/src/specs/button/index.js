import { SpecReader } from '@semantic-ui/specs';

import ButtonSpec from './button.json';

const ButtonComponentSpec = new SpecReader(ButtonSpec).getWebComponentSpec();
const ButtonPluralComponentSpec = new SpecReader(ButtonSpec, { plural: true }).getWebComponentSpec();

export default ButtonSpec;
export {
  ButtonSpec,
  ButtonComponentSpec,
  ButtonPluralComponentSpec
};
