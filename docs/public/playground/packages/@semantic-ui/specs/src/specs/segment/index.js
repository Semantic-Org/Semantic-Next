import { SpecReader } from '@semantic-ui/specs';
import SegmentSpec from './segment.json';

const reader = new SpecReader();

const SegmentComponentSpec = reader.getWebComponentSpec(SegmentSpec);

export default SegmentSpec;

export {
  SegmentSpec,
  SegmentComponentSpec,
};
