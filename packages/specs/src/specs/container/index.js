import { SpecReader } from '../../spec-reader.js';
import ContainerSpec from './container.json';

const reader = new SpecReader();

const ContainerComponentSpec = reader.getWebComponentSpec(ContainerSpec);

export default ContainerSpec;

export {
  ContainerSpec,
  ContainerComponentSpec,
};
