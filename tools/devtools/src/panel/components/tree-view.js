// Tree view component for displaying the component hierarchy
export class TreeView {
  constructor(container, options = {}) {
    this.container = container;
    this.onSelect = options.onSelect || (() => {});
    this.onHover = options.onHover || (() => {});
    this.onHoverEnd = options.onHoverEnd || (() => {});

    this.tree = [];
    this.expandedNodes = new Set();
    this.selectedNodeId = null;
    this.showFiltered = false;

    this.container.addEventListener('click', this.handleClick.bind(this));
    this.container.addEventListener('mouseover', this.handleMouseOver.bind(this));
    this.container.addEventListener('mouseout', this.handleMouseOut.bind(this));
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Make container focusable for keyboard navigation
    this.container.tabIndex = 0;
  }

  render(tree) {
    this.tree = tree || [];
    // Auto-expand html and body on first render
    this.autoExpandToBody(this.tree);
    this.container.innerHTML = this.renderNodes(this.tree, 0);
  }

  // Expand nodes up to and including <body>
  autoExpandToBody(nodes) {
    for (const node of nodes) {
      if (node.tagName === 'html' || node.tagName === 'body') {
        this.expandedNodes.add(node.id);
        if (node.children && node.tagName === 'html') {
          this.autoExpandToBody(node.children);
        }
      }
    }
  }

  renderNodes(nodes, depth) {
    return nodes.map(node => this.renderNode(node, depth)).join('');
  }

  renderNode(node, depth) {
    // Skip filtered nodes unless showFiltered is true
    if (node.filtered && !this.showFiltered) {
      // Still render children that might not be filtered
      if (node.children && node.children.length > 0) {
        return this.renderNodes(node.children, depth);
      }
      return '';
    }

    const isExpanded = this.expandedNodes.has(node.id);
    const isSelected = this.selectedNodeId === node.id;
    const hasChildren = node.hasChildren || (node.children && node.children.length > 0);

    const nodeClasses = [
      'tree-node',
      node.isSUI ? 'sui-component' : (node.nodeType === 'element' ? 'dom-element' : ''),
      node.nodeType === 'text' ? 'text-node' : '',
      node.nodeType === 'comment' ? 'comment-node' : '',
      node.filtered ? 'filtered' : '',
      isSelected ? 'selected' : '',
    ].filter(Boolean).join(' ');

    const indent = '<span class="tree-indent"></span>'.repeat(depth);

    const expander = hasChildren
      ? `<span class="tree-expander expandable ${isExpanded ? 'expanded' : ''}" data-id="${node.id}">
           <svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 4l4 4-4 4z"/></svg>
         </span>`
      : '<span class="tree-expander"></span>';

    const label = this.formatLabel(node);

    let html = `
      <div class="${nodeClasses}" data-id="${node.id}" data-depth="${depth}">
        ${indent}
        ${expander}
        <span class="tree-label">${label}</span>
      </div>
    `;

    // Render shadow root indicator and children if expanded
    if (isExpanded && node.children && node.children.length > 0) {
      // Check if this node has shadow DOM children
      const shadowChildren = node.children.filter(c => c.inShadow);
      const lightChildren = node.children.filter(c => !c.inShadow);

      if (node.hasShadow && shadowChildren.length > 0) {
        html += `
          <div class="tree-node shadow-root" data-depth="${depth + 1}">
            ${indent}<span class="tree-indent"></span>
            <span class="tree-expander"></span>
            <span class="tree-label shadow-label">#shadow-root</span>
          </div>
        `;
        html += this.renderNodes(shadowChildren, depth + 2);
      }

      if (lightChildren.length > 0) {
        html += this.renderNodes(lightChildren, depth + 1);
      }
    }

    return html;
  }

  formatLabel(node) {
    if (node.nodeType === 'text') {
      const text = node.textPreview || '';
      return `"${this.escapeHtml(text.slice(0, 50))}${text.length > 50 ? '...' : ''}"`;
    }

    if (node.nodeType === 'comment') {
      return '&lt;!--...--&gt;';
    }

    // Element node - build tag with attributes like DevTools
    const tagName = node.tagName || 'unknown';
    let label = `<span class="tag-name">&lt;${tagName}</span>`;

    // Add attributes
    if (node.attributes) {
      for (const [name, value] of Object.entries(node.attributes)) {
        label += `<span class="attr-name"> ${this.escapeHtml(name)}</span>`;
        label += `<span class="attr-equals">=</span>`;
        label += `<span class="attr-value">"${this.escapeHtml(value)}"</span>`;
      }
    }

    label += `<span class="tag-name">&gt;</span>`;

    // Add SUI component name prefix
    if (node.isSUI && node.displayName) {
      label = `<span class="sui-name">${this.escapeHtml(node.displayName)}</span> ${label}`;
    }

    return label;
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  handleClick(event) {
    const expanderEl = event.target.closest('.tree-expander.expandable');
    if (expanderEl) {
      const id = expanderEl.dataset.id;
      this.toggleExpand(id);
      return;
    }

    const nodeEl = event.target.closest('.tree-node');
    if (nodeEl && !nodeEl.classList.contains('shadow-root')) {
      const id = nodeEl.dataset.id;
      this.selectNode(id);
    }
  }

  handleMouseOver(event) {
    const nodeEl = event.target.closest('.tree-node');
    if (nodeEl && !nodeEl.classList.contains('shadow-root')) {
      const id = nodeEl.dataset.id;
      const node = this.findNode(id);
      if (node) {
        this.onHover(node);
      }
    }
  }

  handleMouseOut(event) {
    const nodeEl = event.target.closest('.tree-node');
    if (nodeEl) {
      this.onHoverEnd();
    }
  }

  handleKeyDown(event) {
    if (!this.selectedNodeId) { return; }

    const node = this.findNode(this.selectedNodeId);
    if (!node) { return; }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectNextNode();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectPreviousNode();
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (node.hasChildren && !this.expandedNodes.has(node.id)) {
          this.toggleExpand(node.id);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (this.expandedNodes.has(node.id)) {
          this.toggleExpand(node.id);
        }
        break;
      case 'Enter':
        event.preventDefault();
        this.onSelect(node);
        break;
    }
  }

  toggleExpand(id) {
    if (this.expandedNodes.has(id)) {
      this.expandedNodes.delete(id);
    }
    else {
      this.expandedNodes.add(id);
    }
    this.render(this.tree);
  }

  selectNode(id) {
    this.selectedNodeId = id;
    const node = this.findNode(id);

    // Update UI
    this.container.querySelectorAll('.tree-node.selected').forEach(el => {
      el.classList.remove('selected');
    });
    const nodeEl = this.container.querySelector(`.tree-node[data-id="${id}"]`);
    if (nodeEl) {
      nodeEl.classList.add('selected');
      nodeEl.scrollIntoView({ block: 'nearest' });
    }

    if (node) {
      this.onSelect(node);
    }
  }

  findNode(id, nodes = this.tree) {
    for (const node of nodes) {
      if (node.id === id) { return node; }
      if (node.children) {
        const found = this.findNode(id, node.children);
        if (found) { return found; }
      }
    }
    return null;
  }

  getVisibleNodes() {
    const visible = [];
    const traverse = (nodes, depth = 0) => {
      for (const node of nodes) {
        if (node.filtered && !this.showFiltered) { continue; }
        visible.push(node);
        if (this.expandedNodes.has(node.id) && node.children) {
          traverse(node.children, depth + 1);
        }
      }
    };
    traverse(this.tree);
    return visible;
  }

  selectNextNode() {
    const visible = this.getVisibleNodes();
    const currentIndex = visible.findIndex(n => n.id === this.selectedNodeId);
    if (currentIndex < visible.length - 1) {
      this.selectNode(visible[currentIndex + 1].id);
    }
  }

  selectPreviousNode() {
    const visible = this.getVisibleNodes();
    const currentIndex = visible.findIndex(n => n.id === this.selectedNodeId);
    if (currentIndex > 0) {
      this.selectNode(visible[currentIndex - 1].id);
    }
  }

  setShowFiltered(show) {
    this.showFiltered = show;
    this.render(this.tree);
  }
}
