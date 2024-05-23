import { SpecReader } from '@semantic-ui/specs';
import InputSpec from './input.json';

const reader = new SpecReader();

const InputComponentSpec = reader.getWebComponentSpec(InputSpec);

export default InputSpec;

export {
  InputSpec,
  InputComponentSpec,
};
