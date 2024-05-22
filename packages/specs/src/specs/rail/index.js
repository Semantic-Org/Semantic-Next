import { SpecReader } from '@semantic-ui/specs';
import RailSpec from './rail.json';

const reader = new SpecReader();

const RailComponentSpec = reader.getWebComponentSpec(RailSpec);

export default RailSpec;

export {
  RailSpec,
  RailComponentSpec,
};
