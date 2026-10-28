// Minimal spec that mirrors the icon component's structure:
// - "icon" is an open vocabulary, so its names claim bare forms where nothing else has one
// - "link" is both an icon name and a boolean variation, so the variation keeps the bare
//   form and the icon stays reachable through its compound alias
// shared by the attribute door (attribute-aliases) and the mount door (mount) so the two
// are held to one set of dialect expectations
export function createIconLikeSpec() {
  return {
    attributes: ['icon', 'link', 'size'],
    properties: [],
    optionAttributes: {
      // bare values
      'chevron-down': 'icon',
      'chevron-up': 'icon',
      'arrow-right': 'icon',
      'home': 'icon',
      // compound alias for the name the link variation already owns
      'link-icon': 'icon',
      // size values
      'small': 'size',
      'large': 'size',
    },
    propertyTypes: {
      icon: String,
      link: Boolean,
      size: String,
    },
    allowedValues: {
      icon: ['chevron-down', 'chevron-up', 'arrow-right', 'home', 'link'],
      size: ['small', 'large'],
    },
    attributeClasses: [],
  };
}
