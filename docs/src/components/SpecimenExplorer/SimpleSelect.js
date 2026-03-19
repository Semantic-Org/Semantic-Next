import { defineComponent } from '@semantic-ui/component';
import { Attach } from '@semantic-ui/core';

const template = `
<div class="select" @click={toggle}>
  <span class="value">{getDisplayText}</span>
  <ui-icon icon="chevron-down" class="chevron {classIf isOpen 'open'}"></ui-icon>
</div>
{#if isOpen}
  <div class="menu">
    <div class="item {classIf (not selected) 'active'}" data-value="">None</div>
    {#each options}
      <div class="item {classIf (is value ../selected) 'active'}" data-value="{value}">{name}</div>
    {/each}
  </div>
{/if}
`;

const css = `
.select {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--4px);
  padding: var(--2px) var(--8px);
  border: var(--subtle-border);
  border-radius: var(--border-radius);
  background: var(--standard-5);
  cursor: pointer;
  font-size: var(--text-2xs);
  color: var(--text-color);
  transition: var(--transition);
  min-height: var(--24px);

  &:hover {
    border-color: var(--border-color);
  }
}
.value {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.chevron {
  font-size: var(--text-3xs);
  color: var(--muted-text-color);
  transition: var(--transition);

  &.open {
    transform: rotate(180deg);
  }
}
.menu {
  z-index: var(--float-layer);
  background: var(--standard-solid-5);
  border: var(--border);
  border-radius: var(--border-radius);
  box-shadow: var(--floating-shadow);
  max-height: 200px;
  overflow-y: auto;
  min-width: 120px;
}
.item {
  padding: var(--4px) var(--8px);
  font-size: var(--text-2xs);
  cursor: pointer;
  transition: background var(--duration) var(--easing);

  &:hover {
    background: var(--standard-5);
  }
  &.active {
    color: var(--primary-text-color);
    font-weight: var(--bold);
  }
}
`;

const createComponent = ({ self, state, settings, $, afterFlush, findParent }) => ({
  getDisplayText() {
    const selected = settings.selected;
    if (!selected) { return 'None'; }
    const option = settings.options.find(opt => opt.value === selected);
    return option ? (option.name || option.text) : 'None';
  },

  toggle() {
    if (state.isOpen.get()) {
      self.close();
    }
    else {
      self.open();
    }
  },

  open() {
    self.triggerEl = $('.select').el();
    state.isOpen.set(true);
    afterFlush(() => {
      $('.menu').attach({
        to: self.triggerEl,
        position: 'bottom left',
        arrow: false,
        distance: 2,
      });
    });
  },

  close() {
    state.isOpen.set(false);
  },

  selectItem(value) {
    self.close();
    const explorer = findParent('specimenExplorer');
    if (explorer) {
      explorer.setSelection(settings.attribute, value);
    }
  },
});

const defaultState = {
  isOpen: false,
};

const events = {
  'click .item'({ self, data, event }) {
    event.stopPropagation();
    self.selectItem(data.value);
  },
  'global click window'({ self, el, event, state }) {
    if (state.isOpen.get() && !el.contains(event.target)) {
      self.close();
    }
  },
};

export const SimpleSelect = defineComponent({
  template,
  css,
  createComponent,
  defaultState,
  events,
});
