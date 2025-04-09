import { SpecReader } from '../../spec-reader.js';
import RailSpec from './rail.json' with { type: 'json' };

const reader = new SpecReader();

const RailComponentSpec = reader.getWebComponentSpec(RailSpec);

export default RailSpec;

export { RailComponentSpec, RailSpec };
