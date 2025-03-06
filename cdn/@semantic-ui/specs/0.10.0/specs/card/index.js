import { SpecReader } from '@semantic-ui/specs';

import CardSpec from './card.json';

const CardComponentSpec = new SpecReader(CardSpec).getWebComponentSpec();
const CardPluralComponentSpec = new SpecReader(CardSpec, { plural: true }).getWebComponentSpec();

export default CardSpec;
export {
  CardSpec,
  CardComponentSpec,
  CardPluralComponentSpec,
};
