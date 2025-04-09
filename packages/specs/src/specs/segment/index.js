import { SpecReader } from '../../spec-reader.js';
import SegmentSpec from './segment.json' with { type: 'json' };

const reader = new SpecReader();

const SegmentComponentSpec = reader.getWebComponentSpec(SegmentSpec);

export default SegmentSpec;

export { SegmentComponentSpec, SegmentSpec };
