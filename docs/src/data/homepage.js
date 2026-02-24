export const plasmaConfig = {
  colorFrom: '#00405C',
  colorTo: '#2b6fb6',
  colorShift: 0,
  fps: true,

  specularTint: '#1a99e6',
  specularPower: 1.5,
  specularAmbient: 0.2,

  speed: 0.2,
  density: 2.5,
  brightness: 0.6,
  resolution: 1,
  mouse: {
    light: 2,
    warp: 0.5,
  },
};

// Hero demo — each step is a prompt + the resulting code/UI
export const demoSteps = [
  {
    prompt: 'Make a large delete button',
    cot: 'Creating button from spec',
    code: '<ui-button large>Delete</ui-button>',
    html: '<ui-button large>Delete</ui-button>',
  },
  {
    prompt: 'Add an icon',
    cot: 'Retrieving icon spec and adding icon',
    code: `<ui-button large>\n  <ui-icon delete></ui-icon>\n  Delete\n</ui-button>`,
    html: '<ui-button large><ui-icon delete></ui-icon>Delete</ui-button>',
  },
  {
    prompt: 'Add edit and save',
    cot: 'Lookup plural variation add additional icons',
    code:
      `<ui-buttons large>\n  <ui-button>\n    <ui-icon delete></ui-icon>\n    Delete\n  </ui-button>\n  <ui-button>\n    <ui-icon edit></ui-icon>\n    Edit\n  </ui-button>\n  <ui-button>\n    <ui-icon save></ui-icon>\n    Save\n  </ui-button>\n</ui-buttons>`,
    html:
      '<ui-buttons large><ui-button><ui-icon delete></ui-icon>Delete</ui-button><ui-button><ui-icon edit></ui-icon>Edit</ui-button><ui-button><ui-icon save></ui-icon>Save</ui-button></ui-buttons>',
  },
  {
    prompt: 'Emphasize save',
    cot: 'Adjusting button emphasis',
    code:
      `<ui-buttons large>\n  <ui-button subtle-negative>\n    <ui-icon delete></ui-icon>\n    Delete\n  </ui-button>\n  <ui-button>\n    <ui-icon edit></ui-icon>\n    Edit\n  </ui-button>\n  <ui-button primary>\n    <ui-icon save></ui-icon>\n    Save\n  </ui-button>\n</ui-buttons>`,
    html:
      '<ui-buttons large><ui-button subtle-negative><ui-icon delete></ui-icon>Delete</ui-button><ui-button><ui-icon edit></ui-icon>Edit</ui-button><ui-button primary><ui-icon save></ui-icon>Save</ui-button></ui-buttons>',
  },
];
