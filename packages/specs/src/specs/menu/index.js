import { SpecReader } from '@semantic-ui/specs';
import MenuSpec from './menu.json';
import MenuItemSpec from './menu-item.json';

const reader = new SpecReader();

const MenuComponentSpec = reader.getWebComponentSpec(MenuSpec);
const MenuItemComponentSpec = reader.getWebComponentSpec(MenuItemSpec);

export default MenuSpec;

export {
  MenuSpec,
  MenuComponentSpec,
  MenuItemSpec,
  MenuItemComponentSpec,
};
