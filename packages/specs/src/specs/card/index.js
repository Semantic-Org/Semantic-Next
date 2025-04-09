import { SpecReader } from '../../spec-reader.js';

import CardSpec from './card.json' with { type: 'json' };

const CardComponentSpec = new SpecReader(CardSpec).getWebComponentSpec();
const CardPluralComponentSpec = new SpecReader(CardSpec, { plural: true }).getWebComponentSpec();

export default CardSpec;
export { CardComponentSpec, CardPluralComponentSpec, CardSpec };
