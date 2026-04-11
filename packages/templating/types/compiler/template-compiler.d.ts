// template-compiler.d.ts
export interface ASTNode {
  type: string;
  content?: ASTNode[];
  value?: any;
  condition?: string;
  branches?: ASTNode[];
  name?: string;
  over?: string;
  as?: string;
  html?: string;
  unsafeHTML?: boolean;
  ifDefined?: boolean;
  attribute?: string; // Added from StringScanner.getContext()
  booleanAttribute?: boolean; // Added from StringScanner.getContext()
  insideTag?: boolean;
  expression?: string; // For rerender blocks
  key?: string; // For guard blocks and rerender key
}

export interface TemplateInfo {
  name?: string;
  reactiveData?: Record<string, any>;
  [key: string]: any;
}

/**
 * Compiles a template string into an Abstract Syntax Tree (AST).
 * @see {@link https://next.semantic-ui.com/docs/api/templating/template-compiler TemplateCompiler API Reference}
 */
export class TemplateCompiler {
  /**
   * Regular expressions used for parsing single-bracket syntax ({...}).
   * @internal
   */
  static singleBracketRegExp: {
    IF: RegExp;
    ELSEIF: RegExp;
    ELSE: RegExp;
    EACH: RegExp;
    SNIPPET: RegExp;
    CLOSE_IF: RegExp;
    CLOSE_EACH: RegExp;
    CLOSE_SNIPPET: RegExp;
    SLOT: RegExp;
    TEMPLATE: RegExp;
    HTML_EXPRESSION: RegExp;
    EXPRESSION: RegExp;
  };

  /**
   * Regular expressions used for parsing expressions in single-bracket syntax.
   * @internal
   */
  static singleBracketParserRegExp: {
    NEXT_TAG: RegExp;
    EXPRESSION_START: RegExp;
    EXPRESSION_END: RegExp;
    TAG_CLOSE: RegExp;
  };

  /**
   * Regular expressions used for parsing double-bracket syntax ({{...}}).
   * @internal
   */
  static doubleBracketRegExp: {
    IF: RegExp;
    ELSEIF: RegExp;
    ELSE: RegExp;
    EACH: RegExp;
    SNIPPET: RegExp;
    CLOSE_IF: RegExp;
    CLOSE_EACH: RegExp;
    CLOSE_SNIPPET: RegExp;
    SLOT: RegExp;
    TEMPLATE: RegExp;
    HTML_EXPRESSION: RegExp;
    EXPRESSION: RegExp;
  };

  /**
   * Regular expressions used for parsing expressions in double-bracket syntax.
   * @internal
   */
  static doubleBracketParserRegExp: {
    NEXT_TAG: RegExp;
    EXPRESSION_START: RegExp;
    EXPRESSION_END: RegExp;
    TAG_CLOSE: RegExp;
  };

  /**
   * Regular expressions used for parsing HTML tags.
   * @internal
   */
  static htmlRegExp: {
    SVG_OPEN: RegExp;
    SVG_CLOSE: RegExp;
  };

  /**
   * Regular expressions used during template preprocessing.
   * @internal
   */
  static preprocessRegExp: {
    WEB_COMPONENT_SELF_CLOSING: RegExp;
  };
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
  };

  /** The input template string. */
  templateString: string;
  /**
   * Snippets
   */
  snippets: Record<string, ASTNode>;

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
  compile(templateString?: string, options?: {
    /** Add start/end byte offsets to each AST node. */
    includePositions?: boolean;
    /** Collect errors instead of throwing, return partial AST. */
    recoverable?: boolean;
  }): ASTNode[];

  /** Errors collected during recoverable compilation. */
  errors: { message: string; pos: number }[];

  /**
   * Extracts value
   * @internal
   * @param expression string containing value
   * @returns the value
   */
  getValue(expression: string): any;

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
   * @returns {Record<string, any> | string} an object or string
   */
  static getObjectFromString(objectString?: string): Record<string, any> | string;

  /**
   * Detects whether the template uses single or double bracket syntax.
   * @param templateString - The template string.
   * @returns Either 'singleBracket' or 'doubleBracket'.
   * @internal
   */
  static detectSyntax(templateString?: string): 'singleBracket' | 'doubleBracket';

  /**
   * Preprocesses the template string, handling self-closing web component tags.
   * @param templateString - The template string to preprocess.
   * @returns The preprocessed template string.
   * @internal
   */
  static preprocessTemplate(templateString?: string): string;

  /**
   * Optimizes the AST by merging adjacent HTML nodes.
   * @param ast - The AST to optimize.
   * @returns The optimized AST.
   * @internal
   */
  static optimizeAST(ast: ASTNode[]): ASTNode[];
}
