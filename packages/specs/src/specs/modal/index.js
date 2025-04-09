import { SpecReader } from '../../spec-reader.js';
import ModalSpec from './modal.json' with { type: 'json' };

const reader = new SpecReader();

const ModalComponentSpec = reader.getWebComponentSpec(ModalSpec);

export default ModalSpec;

export { ModalComponentSpec, ModalSpec };
