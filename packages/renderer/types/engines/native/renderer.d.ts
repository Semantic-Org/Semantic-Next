import { ASTNode } from '@semantic-ui/compiler';
import { Dependency, Reaction } from '@semantic-ui/reactivity';
import { DataContext, Template } from '@semantic-ui/templating';
import { AttributePart, BuildEntry, BuildHTMLStringResult } from '../../build-html-string.js';
import { ExpressionEvaluator } from '../../expression-evaluator.js';

/**
 * A node in the reaction ownership tree. Every binding a render creates is
 * tracked on the scope that owns it, so disposing a region stops its reactions
 * and its children's in one call.
 *
 * Constructed by the renderer, never exported as a value.
 */
export interface ReactionScope {
  /** Reactions owned directly by this scope. */
  reactions: Reaction[];
  /** Scopes created by blocks rendering inside this one. */
  children: ReactionScope[];
  /** Cleanup callbacks run on dispose, after reactions stop. */
  disposers: Array<() => void>;
  /** Owning scope, or `null` for a root scope. */
  parent: ReactionScope | null;
  /** This scope's slot in `parent.children`, for O(1) detach. `-1` when detached. */
  index: number;

  /**
   * Takes ownership of an existing reaction.
   * @param reaction - Reaction to stop when this scope disposes
   */
  track(reaction: Reaction): void;

  /**
   * Creates a tracked reaction that stops itself once `node` leaves the document.
   * @param node - Node whose connectedness gates the reaction
   * @param callback - Reactive computation, receiving its own Reaction
   * @param context - Debug context, attached only while tracing is on
   */
  reaction(node: Node, callback: (comp: Reaction) => void, context?: Record<string, any>): void;

  /**
   * Registers a cleanup callback.
   * @param fn - Called once, on dispose
   */
  onDispose(fn: () => void): void;

  /** Creates a scope owned by this one. */
  child(): ReactionScope;

  /**
   * Stops every reaction in this scope and its children, then runs disposers.
   * @param fromParent - Set by a parent tearing down its whole subtree, which
   * skips the per-child unlink from `parent.children`
   */
  dispose(fromParent?: boolean): void;
}

/**
 * A stretch of DOM owned by a block. The region keeps an anchor text node where
 * its marker used to be, so content can be replaced without touching siblings.
 *
 * Constructed by the renderer, never exported as a value.
 */
export interface DynamicRegion {
  /** Element the region's content lives in. */
  parentNode: Node;
  /** Nodes currently rendered by this region. */
  ownedNodes: ChildNode[];
  /** Scopes owning the reactions inside the current content. */
  childScopes: ReactionScope[];
  /** Empty text node marking where content begins. */
  anchor: Text;
  /** Empty text node marking where content ends, present once content exists. */
  endAnchor?: Text | null;

  /** Removes the current content and disposes the reactions that produced it. */
  clear(): void;

  /**
   * Replaces the region's content.
   * @param fragment - Nodes to insert after the anchor
   * @param scope - Scope owning the new content's reactions
   */
  setContent(fragment: DocumentFragment, scope?: ReactionScope): void;

  /** Moves the end anchor after the last owned node, creating it on first use. */
  placeEndAnchor(): void;

  /** Last owned node, or the anchor when the region is empty. */
  getLastNode(): ChildNode;
}

/** Settings for a new {@link Renderer}. */
export interface RendererSettings {
  /** Compiled template AST. */
  ast?: ASTNode[];
  /** Data context expressions resolve against. */
  data?: DataContext;
  /** Template instance this renderer draws for. */
  template?: Template;
  /** Templates reachable by name from `{>template}`. */
  subTemplates?: Record<string, Template>;
  /** Snippet definitions in scope, extended with any the AST declares. */
  snippets?: Record<string, ASTNode>;
  /** Template helpers reachable from an expression. */
  helpers?: Record<string, any>;
  /** Whether the AST renders inside an SVG subtree. */
  isSVG?: boolean;
  /**
   * Whether this renderer receives its data from a parent. Subtemplates set it
   * so expression reads also depend on the coarse data version.
   */
  receivesData?: boolean;
  /** Keys a data update may not overwrite, such as each and async variables. */
  protectedKeys?: string[];
}

/**
 * Renders a template AST to DOM and keeps it up to date.
 *
 * The build runs in three phases: the AST becomes one HTML string with markers
 * standing in for dynamic regions, the string is parsed once and cached for
 * cloning, then a tree walk swaps markers for reactive bindings.
 * @see {@link https://next.semantic-ui.com/docs/api/renderer Renderer API Reference}
 */
export class Renderer {
  /** Source of the sequential debug {@link id}. */
  static nextId: number;

  /**
   * Creates a renderer for one template instance.
   * @param settings - AST, data context, template, and helpers
   */
  constructor(settings?: RendererSettings);

  /** Compiled template AST. */
  ast: ASTNode[];
  /** Data context expressions resolve against. */
  data: DataContext;
  /** Template instance this renderer draws for. */
  template?: Template;
  /** Templates reachable by name from `{>template}`. */
  subTemplates?: Record<string, Template>;
  /** Snippet definitions in scope, including those hoisted out of the AST. */
  snippets: Record<string, ASTNode>;
  /** Template helpers reachable from an expression. */
  helpers: Record<string, any>;
  /** Whether the AST renders inside an SVG subtree. */
  isSVG: boolean;
  /** Whether this renderer receives its data from a parent. */
  receivesData: boolean;
  /** Keys a data update may not overwrite. */
  protectedKeys?: string[];
  /** Sequential debug ID, unique per renderer in the page. */
  id: number;
  /** Coarse data invalidation, used only when {@link receivesData} is set. */
  dataDep: Dependency;
  /** Root of this renderer's reaction ownership tree. */
  scope: ReactionScope;
  /** Evaluator shared by every binding this renderer creates. */
  evaluator: ExpressionEvaluator;
  /** @internal Whether an `onUpdated` notification is already queued. */
  updateScheduled: boolean;
  /**
   * Reports a post-mount DOM change to the template. Coalesced, so several
   * changes in one tick fire `onUpdated` once.
   */
  notifyUpdate: () => void;

  /**
   * Registers the AST's top-level snippet definitions.
   * @internal
   * @param ast - AST to scan
   */
  collectSnippets(ast: ASTNode[]): void;

  /**
   * Resolves an expression, adding a dependency on the coarse data version for
   * renderers that receive data from a parent.
   * @param expression - Expression source
   * @param data - Data context
   */
  lookupExpression(expression: string, data: DataContext): any;

  /** Renders the AST to a fragment, wiring every reactive binding. */
  render(): DocumentFragment;

  /** Stops every reaction this renderer owns. */
  destroy(): void;

  /**
   * Renders an AST to a fragment with an explicit data context and scope. Blocks
   * call this to render their inner content.
   * @param params - AST, data context, owning scope, and SVG context
   */
  readAST(params: {
    ast: ASTNode[];
    data: DataContext;
    scope: ReactionScope;
    isSVG?: boolean;
  }): DocumentFragment;

  /**
   * Assembles the AST into a marked-up HTML string. Memoized per AST and
   * namespace, so repeat calls return the same entries the last render bound.
   * @param ast - AST to assemble
   * @param isSVG - Whether assembly starts inside an SVG subtree
   */
  buildHTMLString(ast: ASTNode[], isSVG?: boolean): BuildHTMLStringResult;

  /**
   * Parses an HTML string into a fragment. Parsed templates are cached and
   * cloned, so the same markup is only parsed once.
   * @param htmlString - Markup to parse
   * @param isSVG - Parse in the SVG namespace
   */
  parseHTML(htmlString: string, isSVG?: boolean): DocumentFragment;

  /**
   * Binds one attribute's markers, dispatching on the first entry's position:
   * property, event, boolean, single expression, or interpolated string.
   * @param element - Element carrying the attribute
   * @param attrName - Attribute name as it appears in the DOM
   * @param parts - Static and dynamic segments of the value
   * @param entries - Entries from the build, indexed by marker ID
   * @param data - Data context
   * @param scope - Scope owning the binding
   * @param options - `skipFirstWrite` registers dependencies without writing,
   * used when hydrating server markup
   */
  bindAttributeExpression(
    element: Element,
    attrName: string,
    parts: AttributePart[],
    entries: BuildEntry[],
    data: DataContext,
    scope: ReactionScope,
    options?: { skipFirstWrite?: boolean; },
  ): void;

  /**
   * Walks a freshly parsed fragment and binds every marker in it.
   * @internal
   * @param root - Fragment to walk
   * @param entries - Entries from the build, indexed by marker ID
   * @param data - Data context
   * @param scope - Scope owning the bindings
   * @param ast - AST the fragment came from, used to cache a replayable binding plan
   * @param isSVG - Namespace the fragment was built for, defaults to the renderer's
   */
  bindMarkers(
    root: Node,
    entries: BuildEntry[],
    data: DataContext,
    scope: ReactionScope,
    ast?: ASTNode[],
    isSVG?: boolean,
  ): void;

  /**
   * Evaluates nodes collected inside a raw-text element to a string. Blocks
   * without a text evaluation throw: `<script>`, `<style>`, `<textarea>`, and
   * `<title>` cannot host a region that needs live DOM.
   * @param nodes - Nodes collected for the raw-text entry
   * @param data - Data context
   */
  evaluateRawTextNodes(nodes: ASTNode[], data: DataContext): string;

  /**
   * Dispatches a comment marker to its registered block.
   * @internal
   * @param comment - Marker comment, replaced by the block's anchor
   * @param entry - Entry for the marker
   * @param data - Data context
   * @param scope - Scope owning the block
   */
  bindBlock(comment: Comment, entry: BuildEntry, data: DataContext, scope: ReactionScope): void;

  /**
   * Wires reactive bindings onto server-rendered DOM instead of building it.
   * Only top-level markers are visited here — each block hydrates its own contents.
   * @param params - Root to walk, entries from the build, data context, and scope
   */
  hydrateMarkers(params: {
    root: Node;
    entries: BuildEntry[];
    data: DataContext;
    scope: ReactionScope;
  }): void;

  /**
   * Binds attributes on server-rendered elements, resolved through the
   * `data-sui-bind` attribute the server stamped rather than a reference walk.
   * @internal
   * @param root - Root to walk
   * @param entries - Entries from the build, indexed by marker ID
   * @param data - Data context
   * @param scope - Scope owning the bindings
   */
  hydrateAttributes(
    root: Node,
    entries: BuildEntry[],
    data: DataContext,
    scope: ReactionScope,
  ): void;

  /**
   * Adopts the server-rendered nodes between a block's markers into a region and
   * hands them to the block's hydrate hook.
   * @internal
   * @param comment - Opening block marker
   * @param entry - Entry for the marker
   * @param data - Data context
   * @param scope - Scope owning the block
   */
  hydrateBlock(comment: Comment, entry: BuildEntry, data: DataContext, scope: ReactionScope): void;

  /**
   * Hydrates the markers inside a block's server-rendered nodes. Rewrites
   * `ownedNodes` in place, since hydration strips the comment markers.
   * @param params - Owned nodes, the AST that produced them, data context, and scope
   */
  hydrateInnerContent(params: {
    ownedNodes: ChildNode[];
    innerAST: ASTNode[];
    data: DataContext;
    scope: ReactionScope;
  }): void;

  /**
   * Hydrates a region's server-rendered content and reinserts it after the
   * region anchor.
   * @param params - Region, the AST that produced its content, data context, and
   * scope. `asChild` defaults to `true`, creating a child scope for the content
   * @returns The scope the content's reactions were registered on
   */
  hydrateInto(params: {
    region: DynamicRegion;
    innerAST: ASTNode[];
    data: DataContext;
    scope: ReactionScope;
    asChild?: boolean;
  }): ReactionScope;

  /**
   * Replaces the data context, dropping keys the new one does not carry.
   * @param newData - Replacement data context
   */
  setData(newData: DataContext): void;

  /**
   * Merges data into the context in place, so existing references stay live.
   * @param newData - Data to merge
   * @param options - `preserveExistingData` keeps keys the update omits and
   * defaults to `true`; `respectProtectedKeys` drops keys listed in
   * {@link protectedKeys}
   */
  updateData(
    newData: DataContext,
    options?: { preserveExistingData?: boolean; respectProtectedKeys?: boolean; },
  ): void;

  /**
   * Invalidates every expression read through this renderer. Used for subtrees
   * whose parent cannot track dependencies at the value level.
   */
  bumpDataVersion(): void;

  /**
   * Resolves the block scope layers acting at a DOM position, innermost first.
   * Templates merge these into the `scope` bag an event handler receives.
   * @param target - Node the event fired on
   * @param bounds - `rootNode` ends the walk upward, `startNode` ends the
   * backward scan at the template's own start anchor
   * @returns Layers innermost first, or `null` when the target is outside the
   * template's tree
   */
  resolveScopeLayers(
    target: Node | null,
    bounds?: { rootNode?: Node | null; startNode?: Node | null; },
  ): DataContext[] | null;
}
