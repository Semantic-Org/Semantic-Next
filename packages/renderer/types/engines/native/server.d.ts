import { ASTNode } from '@semantic-ui/compiler';
import { DataContext, Template } from '@semantic-ui/templating';
import { ExpressionEvaluator } from '../../expression-evaluator.js';

/**
 * Serialization state threaded through one render pass. It carries the marker
 * counter the client matches against, plus the character-stream tag scanner's
 * position, so `data-sui-bind` lands on the right element even when an
 * attribute value spans several AST nodes.
 */
export interface ServerRenderScope {
  /** Next marker ID, kept in step with the client's entry indexes. */
  entryId: number;
  /** HTML emitted so far, read backwards to classify each marker's position. */
  htmlBuffer: string;
  /** Whether the scanner has consumed `<tagname` but not the closing `>`. */
  insideTag: boolean;
  /** Quote character when inside an attribute value, `null` otherwise. */
  inQuote: '"' | "'" | null;
  /** Raw attribute name owning the value being written, with any `.` or `@` prefix. */
  currentAttrName: string | null;
  /** First entry ID per bound attribute on the open tag, flushed at tag close. */
  tagBindings: Record<string, number>;
  /** Whether output is inside `<script>`, `<style>`, `<textarea>`, or `<title>`. */
  insideRawText: boolean;
}

/** Settings for a new {@link ServerRenderer}. */
export interface ServerRendererSettings {
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
  /** Keys a data update may not overwrite, such as each and async variables. */
  protectedKeys?: string[];
}

/**
 * Renders a template AST to an HTML string.
 *
 * Same interface as the client `Renderer`, which a template creates instead
 * when it runs in a browser, except `render()` returns markup rather than a
 * fragment. No DOM, no reactions: pure string assembly, so it runs anywhere
 * `new Function` is allowed.
 * @see {@link https://next.semantic-ui.com/docs/api/renderer Renderer API Reference}
 */
export class ServerRenderer {
  /**
   * Creates a server renderer for one template instance.
   * @param settings - AST, data context, template, and helpers
   */
  constructor(settings?: ServerRendererSettings);

  /** Compiled template AST. */
  ast: ASTNode[];
  /** Data context expressions resolve against. */
  data: DataContext;
  /** Template instance this renderer draws for. */
  template?: Template;
  /** Templates reachable by name from `{>template}`. */
  subTemplates?: Record<string, Template>;
  /** Snippet definitions in scope, extended as the AST declares them. */
  snippets: Record<string, ASTNode>;
  /** Template helpers reachable from an expression. */
  helpers: Record<string, any>;
  /** Whether the AST renders inside an SVG subtree. */
  isSVG: boolean;
  /** Keys a data update may not overwrite. */
  protectedKeys?: string[];
  /** Evaluator every expression in this render resolves through. */
  evaluator: ExpressionEvaluator;

  /** Renders the AST to HTML, with hydration markers the client walks. */
  render(): string;

  /** No-op. The server renderer holds no reactions to stop. */
  destroy(): void;

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

  /** No-op. Nothing subscribes to a server render. */
  bumpDataVersion(): void;

  /**
   * Renders a list of AST nodes to HTML. Called recursively for block contents,
   * which share the caller's scope so marker IDs stay sequential.
   * @param ast - Nodes to render
   * @param data - Data context
   * @param scope - Serialization state, created for the top-level call
   */
  renderNodes(ast: ASTNode[], data: DataContext, scope?: ServerRenderScope): string;

  /**
   * Renders one expression: a marker plus escaped text in content position, the
   * value inline in attribute position, literal text inside raw-text elements.
   * @internal
   * @param node - Expression node
   * @param data - Data context
   * @param scope - Serialization state
   */
  renderExpression(node: ASTNode, data: DataContext, scope: ServerRenderScope): string;

  /**
   * Adapter exposing this renderer's evaluator under the client renderer's
   * interface, so the shared string walker can drive either one.
   * @internal
   */
  stringRenderer(): { lookupExpression: (expression: string, data: DataContext) => any; };

  /**
   * Emits a block's evaluated value inline as an attribute value, registering it
   * for `data-sui-bind` the way an expression in the same position would.
   * @internal
   * @param id - Marker ID for the block
   * @param value - Evaluated string value
   * @param scope - Serialization state
   */
  emitAttributeBlock(id: number, value: unknown, scope: ServerRenderScope): string;

  /**
   * Renders the matching branch of an `{#if}`, stamping the branch index on the
   * closing marker so the client can spot a hydration mismatch.
   * @internal
   * @param node - Conditional node
   * @param data - Data context
   * @param scope - Serialization state
   */
  renderConditional(node: ASTNode, data: DataContext, scope: ServerRenderScope): string;

  /**
   * Renders the matching branch of a `{#match}`, comparing each case against the
   * discriminant with `==` for `{is}` and `===` for `{isExactly}`.
   * @internal
   * @param node - Match node
   * @param data - Data context
   * @param scope - Serialization state
   */
  renderMatch(node: ASTNode, data: DataContext, scope: ServerRenderScope): string;

  /**
   * Renders an `{#each}`, marking every item with its key so the client can adopt
   * the matching node range. Throws in attribute position.
   * @internal
   * @param node - Each node
   * @param data - Data context
   * @param scope - Serialization state
   */
  renderEach(node: ASTNode, data: DataContext, scope: ServerRenderScope): string;

  /**
   * Renders an `{#async}` block's loading content. The server never awaits.
   * Throws in attribute position.
   * @internal
   * @param node - Async node
   * @param data - Data context
   * @param scope - Serialization state
   */
  renderAsync(node: ASTNode, data: DataContext, scope: ServerRenderScope): string;

  /**
   * Renders a `{#rerender}` block's content once.
   * @internal
   * @param node - Rerender node
   * @param data - Data context
   * @param scope - Serialization state
   */
  renderRerender(node: ASTNode, data: DataContext, scope: ServerRenderScope): string;

  /**
   * Renders a `{>template}`, resolving the name against snippets first and
   * subtemplates second. Throws in attribute position.
   * @internal
   * @param node - Template node
   * @param data - Data context
   * @param scope - Serialization state
   */
  renderTemplate(node: ASTNode, data: DataContext, scope: ServerRenderScope): string;

  /**
   * Renders a subtemplate. Templates with their own lifecycle are cloned and
   * initialized, which gives them their own server renderer.
   * @internal
   * @param template - Template instance, or a bare object carrying an `ast`
   * @param data - Data context for the subtemplate
   */
  renderSubtemplate(template: Template | { ast?: ASTNode[]; }, data: DataContext): string;

  /**
   * Builds the data context for a subtemplate or snippet: the parent context on
   * the prototype chain, with the node's declared arguments layered on top.
   * @internal
   * @param node - Node carrying `data` and `reactiveData`
   * @param data - Parent data context
   */
  resolveNodeData(node: ASTNode, data: DataContext): DataContext;
}
