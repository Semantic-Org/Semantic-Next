import { StringScanner } from './string-scanner';
//import {  Snippets } from '../types'; // NO LONGER NEED

export interface ASTNode {  // Moved ASTNode here
    type: string;
    content?: ASTNode[];
    condition?: string;
    branches?: ASTNode[];
    name?: string;
    over?: string;
    as?: string;
    html?: string;
    value?: any;
    unsafeHTML?: boolean;
    ifDefined?: boolean;
    reactiveData?: Record<string, any>;
}

export interface Snippets {
    [key:string]: {
        type: string;
        content: ASTNode[]
    }
}
export class TemplateCompiler {
    templateString: string;
    snippets: Snippets;

    static singleBracketRegExp: Record<string, RegExp>;
    static singleBracketParserRegExp: Record<string, RegExp>;
    static doubleBracketRegExp: Record<string, RegExp>;
    static doubleBracketParserRegExp: Record<string, RegExp>;
    static htmlRegExp: Record<string, RegExp>;
    static preprocessRegExp: Record<string, RegExp>;
    static templateRegExp: Record<string, RegExp>;

    constructor(templateString?: string);

    compile(templateString?: string): ASTNode[];
    getValue(expression: string): any;
    parseTemplateString(expression?: string):  Record<string, any>;

    static getObjectFromString(objectString?: string): Record<string, any> | string;
    static detectSyntax(templateString?: string): 'singleBracket' | 'doubleBracket';
    static preprocessTemplate(templateString?: string): string;
    static optimizeAST(ast: ASTNode[]): ASTNode[];
}