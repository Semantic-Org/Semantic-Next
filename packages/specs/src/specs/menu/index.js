import { SpecReader } from '../../spec-reader.js';
import MenuItemSpec from './menu-item.json';
import MenuSpec from './menu.json';

const reader = new SpecReader();

const MenuComponentSpec = reader.getWebComponentSpec(MenuSpec);
const MenuItemComponentSpec = reader.getWebComponentSpec(MenuItemSpec);

export default MenuSpec;

export { MenuComponentSpec, MenuItemComponentSpec, MenuItemSpec, MenuSpec };
