import { SpecReader } from '@semantic-ui/specs';

import CardSpec from './card.json';

const reader = new SpecReader();
const CardComponentSpec = reader.getWebComponentSpec(CardSpec);

export default CardSpec;
export {
  CardSpec,
  CardComponentSpec
};
