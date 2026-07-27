// template-compiler.d.ts

/** Values a template expression can carry once literals are coerced. */
export type ASTValue = string | number | boolean;

/**
 * Node types the compiler emits. The open `string` member keeps ASTs loaded
 * from JSON (the precompiled SSR workflow) assignable while still offering
 * completions for the known types.
 */
export type ASTNodeType =
  | 'html'
  | 'expression'
  | 'if'
  | 'elseif'
  | 'else'
  | 'match'
  | 'is'
  | 'isExactly'
  | 'each'
  | 'async'
  | 'rerender'
  | 'snippet'
  | 'template'
  | 'slot'
  | 'svg'
  | (string & {});

/** Names of the tag patterns the compiler matches inside `{}` or `{{}}`. */
export type TagPattern =
  | 'IF'
  | 'ELSEIF'
  | 'ELSE'
  | 'MATCH'
  | 'ISEXACTLY'
  | 'IS'
  | 'EACH'
  | 'SNIPPET'
  | 'RERENDER'
  | 'GUARD'
  | 'ASYNC'
  | 'ASYNC_LOADING'
  | 'ASYNC_ERROR'
  | 'CLOSE_IF'
  | 'CLOSE_MATCH'
  | 'CLOSE_EACH'
  | 'CLOSE_SNIPPET'
  | 'CLOSE_RERENDER'
  | 'CLOSE_GUARD'
  | 'CLOSE_ASYNC'
  | 'SLOT'
  | 'TEMPLATE'
  | 'HTML_EXPRESSION'
  | 'FN_EXPRESSION'
  | 'EXPRESSION';

/** Names of the patterns used to move the scanner between tags. */
export type ParserPattern = 'NEXT_TAG' | 'EXPRESSION_START' | 'EXPRESSION_END' | 'TAG_CLOSE';

/** Names of the HTML primitives parsed outside of expressions. */
export type HTMLPattern = 'SVG_OPEN' | 'SVG_CLOSE';

/** AST properties that hold child content, walked by optimize and condense. */
export type ContentProperty = 'content' | 'elseContent' | 'loadingContent' | 'errorContent';

/**
 * Tag patterns bucketed by the first significant character that can open them.
 * `fallback` holds the catch-all patterns for characters no keyword starts with.
 * @internal
 */
export interface DispatchBuckets {
  byChar: Map<string, Array<[TagPattern, RegExp]>>;
  fallback: Array<[TagPattern, RegExp]>;
}

export interface ASTNode {
  type: ASTNodeType;
  /** Child nodes. Present on every block node. */
  content?: ASTNode[];
  /** Value of an expression node, coerced from the source text. */
  value?: ASTValue;
  /** Condition of an `if` or `elseif` node. */
  condition?: ASTValue;
  /** `elseif` and `else` branches of an `if`, or the cases of a `match`. */
  branches?: ASTNode[];
  /** For match blocks, the value branched on */
  discriminant?: string;
  /** For match {is}/{isExactly} cases, expressions compared to the discriminant */
  values?: string[];
  /** Name of a snippet, slot, or subtemplate. */
  name?: string;
  /** Collection expression of an `each` node. */
  over?: string;
  /** Item alias of an `each` or `async` node. */
  as?: string;
  /** Index alias of an `each` node, when one was declared. */
  indexAs?: string;
  /** Content rendered by an `each` node when the collection is empty. */
  elseContent?: ASTNode[];
  /** Awaited expression of an `async` node, or the tracked expression of a `rerender` node. Null for guard blocks. */
  expression?: string | null;
  /** Destructured keys of an `async` alias. */
  parts?: string[];
  /** Rest alias of a destructured `async` alias. */
  rest?: string;
  /** Content rendered by an `async` node while the promise is pending. */
  loadingContent?: ASTNode[];
  /** Content rendered by an `async` node when the promise rejects. */
  errorContent?: ASTNode[];
  /** Alias the rejection value is bound to inside `errorContent`. */
  errorAs?: string | null;
  /** Static markup of an `html` node. */
  html?: string;
  /** Set by `{#html expr}`, renders the result as raw HTML. */
  unsafeHTML?: boolean;
  /** Set by `{#fn expr}`, passes the value through without invoking functions. */
  literalValue?: boolean;
  /** Set for expressions in attribute position that should be removed when falsy. */
  ifDefined?: boolean;
  /** Key of a guard block, or the `key=` of a rerender block. */
  key?: string | null;
  /** Reactive data passed to a subtemplate, as unevaluated expression strings. */
  reactiveData?: Record<string, string>;
  /** The reserved `data` blob passed to a subtemplate, as an expression string. */
  data?: string;
  /** Ordinal assigned to duplicate template calls so subtree caching can tell them apart. */
  position?: number;
  /** Source offset of the node, added when compiling with `includePositions`. */
  start?: number;
  /** End offset of the node, added when compiling with `includePositions`. */
  end?: number;
}

export interface TemplateInfo {
  name?: string;
  reactiveData?: Record<string, string>;
  data?: string;
  [key: string]: any;
}

/** An error collected during a recoverable compile. */
export interface CompilerError {
  message: string;
  pos: number;
}

export interface CompileOptions {
  /** Add start/end byte offsets to each AST node. Skips whitespace condensing. */
  includePositions?: boolean;
  /** Collect errors instead of throwing, return partial AST. Skips whitespace condensing. */
  recoverable?: boolean;
  /** Keep template whitespace exactly as authored. */
  preserveWhitespace?: boolean;
}

/**
 * Compiles a template string into an Abstract Syntax Tree (AST).
 * @see {@link https://next.semantic-ui.com/docs/api/templating/template-compiler TemplateCompiler API Reference}
 */
export class TemplateCompiler {
  /**
   * Pattern sources for every tag, with `{OPEN}` and `{CLOSE}` placeholders
   * filled in per bracket syntax.
   * @internal
   */
  static basePatterns: Record<TagPattern, string>;

  /**
   * Pattern sources used to advance the scanner between tags.
   * @internal
   */
  static baseParserPatterns: Record<ParserPattern, string>;

  /**
   * Builds the tag patterns for a bracket syntax from {@link basePatterns}.
   * @internal
   */
  static generateRegExpPatterns(open: string, close: string): Record<TagPattern, RegExp>;

  /**
   * Builds the scanner patterns for a bracket syntax from {@link baseParserPatterns}.
   * @internal
   */
  static generateParserRegExpPatterns(open: string, close: string): Record<ParserPattern, RegExp>;

  /**
   * Regular expressions used for parsing single-bracket syntax ({...}).
   * @internal
   */
  static singleBracketRegExp: Record<TagPattern, RegExp>;

  /**
   * Regular expressions used for parsing expressions in single-bracket syntax.
   * @internal
   */
  static singleBracketParserRegExp: Record<ParserPattern, RegExp>;

  /**
   * Regular expressions used for parsing double-bracket syntax ({{...}}).
   * @internal
   */
  static doubleBracketRegExp: Record<TagPattern, RegExp>;

  /**
   * Regular expressions used for parsing expressions in double-bracket syntax.
   * @internal
   */
  static doubleBracketParserRegExp: Record<ParserPattern, RegExp>;

  /**
   * Entries of {@link singleBracketRegExp}, in declaration order.
   * @internal
   */
  static singleBracketRegExpEntries: Array<[TagPattern, RegExp]>;

  /**
   * Entries of {@link doubleBracketRegExp}, in declaration order.
   * @internal
   */
  static doubleBracketRegExpEntries: Array<[TagPattern, RegExp]>;

  /**
   * First non-whitespace characters a pattern can match after the open bracket.
   * Returns null for the catch-all expression pattern.
   * @internal
   */
  static firstCharsForPattern(source: string): Set<string> | null;

  /**
   * Dispatch characters for each tag pattern, null for the catch-all.
   * @internal
   */
  static dispatchCharsByType: Record<TagPattern, Set<string> | null>;

  /**
   * Buckets pattern entries by the characters that can open them, preserving
   * declaration order so first-match-wins is unchanged.
   * @internal
   */
  static buildDispatchBuckets(entries: Array<[TagPattern, RegExp]>): DispatchBuckets;

  /**
   * Dispatch buckets for single-bracket syntax.
   * @internal
   */
  static singleBracketDispatch: DispatchBuckets;

  /**
   * Dispatch buckets for double-bracket syntax.
   * @internal
   */
  static doubleBracketDispatch: DispatchBuckets;

  /**
   * Regular expressions used for parsing HTML tags.
   * @internal
   */
  static htmlRegExp: Record<HTMLPattern, RegExp>;

  /**
   * Entries of {@link htmlRegExp}, in declaration order.
   * @internal
   */
  static htmlRegExpEntries: Array<[HTMLPattern, RegExp]>;

  /**
   * Regular expressions used during template preprocessing.
   * @internal
   */
  static preprocessRegExp: {
    WEB_COMPONENT_SELF_CLOSING: RegExp;
  };

  /**
   * AST properties holding child content, the shared walk set for optimize and condense.
   * @internal
   */
  static contentProperties: ContentProperty[];

  /**
   * Regular expressions used during template parsing.
   * @internal
   */
  static templateRegExp: {
    VERBOSE_KEYWORD: RegExp;
    VERBOSE_PROPERTIES: RegExp;
    STANDARD: RegExp;
    DATA_OBJECT: RegExp;
    SINGLE_QUOTES: RegExp;
    AS_KEYWORD: RegExp;
  };

  /** The input template string. */
  templateString: string;
  /**
   * Snippets
   */
  snippets: Record<string, ASTNode>;

  /** Errors collected during recoverable compilation. */
  errors: CompilerError[];

  /**
   * Whether the last compile recorded source offsets.
   * @internal
   */
  includePositions: boolean;

  /**
   * Whether the last compile collected errors instead of throwing.
   * @internal
   */
  recoverable: boolean;

  /**
   * Creates a new TemplateCompiler instance.
   * @param templateString - The template string to compile.
   */
  constructor(templateString?: string);

  /**
   * Compiles the template string into an Abstract Syntax Tree (AST).
   * @param templateString The template string to compile. Defaults to the instance's `templateString`.
   * @param options Compilation options.
   * @returns The compiled AST.
   */
  compile(templateString?: string, options?: CompileOptions): ASTNode[];

  /**
   * Splits a rerender expression into its tracked expression and optional `key=`.
   * @internal
   * @param content the text inside `{#rerender}` or `{#guard}`
   */
  parseRerenderExpression(content: string): { expression: string; key: string | null; };

  /**
   * Parses a template string expression (e.g., `templateName data1=value1 data2=value2`).
   * @param {string} expression -
   * @returns {TemplateInfo} Parsed template info.
   * @internal
   */
  parseTemplateString(expression?: string): TemplateInfo;

  /**
   * Converts an object like string
   * @internal
   * @param {string} objectString object string
   * @returns {Record<string, string> | string} an object of unevaluated expressions, or the trimmed string
   */
  static getObjectFromString(objectString?: string): Record<string, string> | string;

  /**
   * Detects whether the template uses single or double bracket syntax.
   * @param templateString - The template string.
   * @returns Either 'singleBracket' or 'doubleBracket'.
   * @internal
   */
  static detectSyntax(templateString?: string): 'singleBracket' | 'doubleBracket';

  /**
   * Splits an async expression into its promise expression and alias, including
   * any destructuring in the alias.
   * @param asyncString - The text inside `{#async}`.
   * @internal
   */
  static parseAsyncString(asyncString?: string): {
    expression: string;
    as: string | null;
    parts: string[] | null;
    rest: string | null;
  };

  /**
   * Parses an alias that may destructure, as in `{#async load as { name, ...rest }}`.
   * @param destructuringString - The alias text.
   * @internal
   */
  static parseDestructuring(destructuringString?: string): {
    as: string | null;
    parts: string[] | null;
    rest: string | null;
  };

  /**
   * Extracts the parts of an iterator, supporting both `each..in` and `each..as`.
   * @param iteratorString - The text inside `{#each}`.
   * @internal
   */
  static parseIteratorString(iteratorString?: string): {
    as: string | undefined;
    over: string;
    indexAs: string | undefined;
  };

  /**
   * Splits `{#match}` case values into top-level expression tokens, respecting
   * quotes and balanced parens.
   * @param valuesString - The text inside `{is}` or `{isExactly}`.
   * @internal
   */
  static parseMatchValues(valuesString?: string): string[];

  /**
   * Preprocesses the template string, handling self-closing web component tags.
   * @param templateString - The template string to preprocess.
   * @returns The preprocessed template string.
   * @internal
   */
  static preprocessTemplate(templateString?: string): string;

  /**
   * Optimizes the AST by merging adjacent HTML nodes and hoisting snippets.
   * @param ast - The AST to optimize.
   * @param options - Pass `condense` to also run the whitespace condensing pass.
   * @returns The optimized AST.
   * @internal
   */
  static optimizeAST(ast: ASTNode[], options?: { condense?: boolean; }): ASTNode[];
}
