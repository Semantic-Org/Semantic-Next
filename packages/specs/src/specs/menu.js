import { SpecReader } from '../spec-reader.js';
import MenuSpec from './menu.json';
const reader = new SpecReader();
const MenuComponentSpec = reader.getWebComponentSpec(MenuSpec);

export default MenuSpec;

export {
  MenuSpec,
  MenuComponentSpec
};
