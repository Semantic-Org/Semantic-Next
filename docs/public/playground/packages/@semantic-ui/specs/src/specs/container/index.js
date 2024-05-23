import { SpecReader } from '@semantic-ui/specs';
import ContainerSpec from './container.json';

const reader = new SpecReader();

const ContainerComponentSpec = reader.getWebComponentSpec(ContainerSpec);

export default ContainerSpec;

export {
  ContainerSpec,
  ContainerComponentSpec,
};
