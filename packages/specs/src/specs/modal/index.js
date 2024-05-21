import { SpecReader } from '@semantic-ui/specs';
import ModalSpec from './modal.json';

const reader = new SpecReader();

const ModalComponentSpec = reader.getWebComponentSpec(ModalSpec);

export default ModalSpec;

export {
  ModalSpec,
  ModalComponentSpec,
};
