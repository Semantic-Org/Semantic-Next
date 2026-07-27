import { ASTNode } from '@semantic-ui/compiler';

/**
 * Where a marker lands in the HTML string being assembled. The client renderer
 * uses it to pick a binding strategy, the server renderer to decide between an
 * inline value and a hydration comment.
 */
export interface BindingPosition {
  /**
   * `'text'` outside a tag, `'property'` for `.prop=`, `'event'` for `@event=`,
   * `'boolean'` for an unquoted attribute value, `'attribute'` otherwise.
   */
  type: 'text' | 'attribute' | 'boolean' | 'property' | 'event';
  /** Whether the marker sits inside an open tag. */
  insideTag: boolean;
  /** Attribute name with any `.` or `@` prefix stripped. Empty in text position. */
  attribute: string;
  /** Whether the attribute value is wrapped in quotes. */
  quoted: boolean;
}

/**
 * One segment of an attribute value. A literal segment carries `static`, a
 * dynamic segment carries `markerId` — never both.
 */
export interface AttributePart {
  /** Literal text between markers. */
  static?: string;
  /** Index of the {@link BuildEntry} that fills this segment. */
  markerId?: number;
}

/**
 * A dynamic region found while assembling the HTML string. The entry index is
 * the number embedded in the emitted marker, so the walk that binds the parsed
 * DOM can resolve a marker back to its AST node.
 */
export interface BuildEntry {
  /** Index of this entry in the entries array, and the ID carried by the marker. */
  id: number;
  /**
   * `'expression'`, `'rawText'`, or the block node's own type (`'if'`, `'each'`,
   * `'template'`, and so on).
   */
  type: string;
  /** AST node this marker renders. Absent on `'rawText'` entries. */
  node?: ASTNode;
  /** Nodes collected inside a raw-text element, evaluated to a string rather than DOM. */
  nodes?: ASTNode[];
  /** Position analysis for the marker. Absent on `'rawText'` entries. */
  classification?: BindingPosition;
  /** Set when the entry was built inside an `<svg>` subtree. */
  isSVG?: boolean;
  /**
   * The whole attribute value split into static and dynamic segments. Present
   * only on the first entry of an attribute that carries markers.
   */
  attributeParts?: AttributePart[];
}

/** Options for {@link buildHTMLString}. */
export interface BuildHTMLStringOptions {
  /** Snippet definitions in scope, returned untouched on the result. */
  snippets?: Record<string, ASTNode>;
  /** Whether assembly starts inside an SVG subtree. */
  isSVG?: boolean;
}

/** Result of {@link buildHTMLString}. */
export interface BuildHTMLStringResult {
  /** HTML with comment and attribute markers standing in for dynamic regions. */
  htmlString: string;
  /** Dynamic regions, indexed by marker ID. */
  entries: BuildEntry[];
  /** The snippets passed in, forwarded for the caller's convenience. */
  snippets: Record<string, ASTNode>;
}

/**
 * Marker version stamped into every comment marker, so a client can detect
 * server output it was not built to hydrate.
 */
export const MARKER_VERSION: 'v1';

/**
 * Sentinel `branchIndex` for the main body of an `{#if}`. Branch indexes count
 * from 0 for `{:elseif}` and `{:else}`, so this sits above any real branch.
 */
export const MAIN_BRANCH_INDEX: 1000;

/**
 * Classifies the position at the end of an HTML fragment: text content,
 * a quoted or unquoted attribute value, a property binding, or an event binding.
 * @param html - HTML accumulated so far
 */
export function analyzePosition(html: string): BindingPosition;

/**
 * Assembles an AST into a single HTML string with markers for every dynamic
 * region. Shared by the client renderer, which parses the string and binds the
 * markers, and the server renderer, which evaluates them inline.
 * @param ast - Compiled template AST
 * @param options - Snippets in scope and SVG context
 */
export function buildHTMLString(
  ast: ASTNode[],
  options?: BuildHTMLStringOptions,
): BuildHTMLStringResult;
