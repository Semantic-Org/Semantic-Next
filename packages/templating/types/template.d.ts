import { LitRenderer } from '@semantic-ui/renderer';
import { TemplateHelpers } from './template-helpers';
import { Query, QueryOptions } from '@semantic-ui/query';
import { Signal, SignalOptions, Reaction } from '@semantic-ui/reactivity';
import { ASTNode } from '@semantic-ui/templating';

export interface TemplateSettings {
    templateName?: string;
    ast?: ASTNode[];
    template?: string;
    data?: DataContext;
    element?: HTMLElement;
    renderRoot?: ShadowRoot | HTMLElement;
    css?: string;
    events?: Record<string, Function>;
    keys?: KeyBindings;
    defaultState?: Record<string, any>;
    subTemplates?: Record<string, Function>;
    createComponent?: (this: Template) => any;
    parentTemplate?: Template;
    renderingEngine?: 'lit' | string;
    isPrototype?: boolean;
    attachStyles?: boolean;
    onCreated?: (params: CallParams) => void;
    onRendered?: (params: CallParams) => void;
    onUpdated?: (params: CallParams) => void;
    onDestroyed?: (params: CallParams) => void;
    onThemeChanged?: (params: CallParams) => void;
}
export type DataContext = Record<string, any>;

export interface RenderedTemplate {
    [key: string]: any;
}

type ExtractSignalValues<T> = {
  [K in keyof T]: T[K] extends Signal<infer U> ? U : T[K];
};

export interface CallParams<
    TState extends Record<string, any>,
    TSettings extends Record<string, any>,
    TComponentInstance extends Record<string, any>,
    TProperties extends Record<string, any>
> {
    el: HTMLElement;
    tpl?: TComponentInstance;
    self?: TComponentInstance;
    component?: TComponentInstance;
    $: (selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy, args?: QueryOptions) => Query;
    $$: (selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy, args?: QueryOptions) => Query;
    reaction: Template['reaction'];
    signal: Template['signal'];
    afterFlush: (callback: () => void) => void;
    nonreactive: <T>(fn: () => T) => T;
    flush: () => void;
    data?: DataContext;
    settings?: TSettings & TProperties;
    state?: ExtractSignalValues<TState>;
    isRendered: () => boolean;
    isServer: boolean;
    isClient: boolean;
    dispatchEvent: Template['dispatchEvent'];
    attachEvent: Template['attachEvent']
    bindKey: Template['bindKey'];
    unbindKey: Template['unbindKey'];
    abortController?: AbortController;
    helpers: typeof TemplateHelpers;
    template: Template;
    templateName: string;
    templates: Map<string, Template[]>;
    findTemplate: (templateName: string) => Template | undefined;
    findParent: (templateName: string) => RenderedTemplate | undefined;
    findChild: (templateName: string) => RenderedTemplate | undefined;
    findChildren(templateName: string): RenderedTemplate[];
    content?: any;
    darkMode: boolean;
    [key: string]: any;
}

export interface EventData {
    [key: string]: any;
}

export interface EventSettings {
    abortController?: AbortController;
    returnHandler?: boolean;
    [key: string]: any;
}

export type KeyBindingHandler = (event: KeyboardEvent) => void;

export interface KeyBindings {
    [keySequence: string]: KeyBindingHandler;
}
export interface ParsedEvent {
    eventName: string;
    eventType: 'deep' | 'global' | 'delegated';
    selector: string;
}

export interface QuerySettings {
    root?: HTMLElement | ShadowRoot | Document;
    pierceShadow?: boolean;
    filterTemplate?: boolean;
    [key: string]: any;
}

export interface AttachSettings {
    parentNode?: HTMLElement | ShadowRoot;
    startNode?: Node;
    endNode?: Node;
}


export class Template {
    static templateCount: number;
    static isServer: boolean;
    static renderedTemplates: Map<string, Template[]>;

    ast: ASTNode[];
    css?: string;
    data: DataContext;
    defaultState?: Record<string, any>;
    element?: HTMLElement;
    events?: Record<string, Function>;
    id: string;
    instance: Record<string, any>;
    isPrototype: boolean;
    keys: KeyBindings;
    onCreatedCallback: (params: CallParams) => void;
    onDestroyedCallback: (params: CallParams) => void;
    onRenderedCallback: (params: CallParams) => void;
    onThemeChangedCallback: (params: CallParams) => void;
    parentTemplate?: Template;
    reactions: Reaction[];
    renderRoot?: ShadowRoot | HTMLElement;
    renderingEngine: 'lit' | string;
    renderer: LitRenderer;
    startNode?: Node;
    endNode?: Node;
    state: Record<string, Signal<any>>;
    stylesheet?: CSSStyleSheet;
    subTemplates?: Record<string, Function>;
    templateName: string;
    createComponent?: (this: Template) => any;
    attachStyles: boolean;
    initialized: boolean;
    rendered: boolean;
    parentNode: HTMLElement | ShadowRoot | undefined;
    _parentTemplate?: Template;
    _childTemplates?: Template[];
    eventController?: AbortController;
    currentSequence?: string;
    currentKey?: string;
    resetSequence?: ReturnType<typeof setTimeout>;

    constructor(settings?: TemplateSettings);
    createReactiveState(defaultState: Record<string, any>, data: DataContext): Record<string, Signal<any>>;
    setDataContext(data: DataContext, options?: { rerender?: boolean }): void;
    setParent(parentTemplate: Template): void;
    setElement(element: HTMLElement): void;
    getGenericTemplateName(): string;
    initialize(): void;
    attach(renderRoot: ShadowRoot | HTMLElement, options?: AttachSettings): Promise<void>;
    getDataContext(): DataContext;
    adoptStylesheet(): Promise<void>;
    clone(settings?: Partial<TemplateSettings>): Template;
    parseEventString(eventString: string): ParsedEvent[];
    attachEvents(events?: Record<string, Function>): void;
    removeEvents(): void;
    bindKeys(keys?: KeyBindings): void;
    bindKey(key: string, callback: KeyBindingHandler): void;
    unbindKey(key: string): void;
    isNodeInTemplate(node: Node): boolean;
    render(additionalData?: DataContext): any;
    $(selector: string, options?: QuerySettings): Query;
    $$(selector: string, options?: QuerySettings): Query;
    call<TState, TSettings, TComponentInstance, TProperties, T>(
        func: ((this: HTMLElement, params: CallParams<TState, TSettings, TComponentInstance, TProperties>) => T) | undefined,
        options?: {
            params?: CallParams<TState, TSettings, TComponentInstance, TProperties>;
            additionalData?: Record<string, any>;
            firstArg?: any;
            additionalArgs?: any[];
        }
    ): T | undefined;
    attachEvent(selector: string, eventName: string, eventHandler: (event: Event) => void, options?: { eventSettings?: EventSettings, querySettings?: { pierceShadow?: boolean } }): Query;
    dispatchEvent(eventName: string, eventData?: EventData, eventSettings?: EventSettings, options?: { triggerCallback?: boolean }): Query;
    reaction(reaction: () => void): void;
    signal<T>(value: T, options?: SignalOptions<T>): Signal<T>;
    clearReactions(): void;
    findTemplate: (templateName: string) => Template | undefined;
    findParent: (templateName: string) => RenderedTemplate | undefined;
    findChild(templateName: string): RenderedTemplate | undefined;
    findChildren(templateName: string): RenderedTemplate[];
    static addTemplate(template: Template): void;
    static removeTemplate(template: Template): void;
    static getTemplates(templateName: string): Template[];
    static findTemplate(templateName: string): Template | undefined;
    static findParentTemplate(template: Template, templateName: string): RenderedTemplate | undefined;
    static findChildTemplates(template: Template, templateName: string): RenderedTemplate[];
    static findChildTemplate(template: Template, templateName: string): RenderedTemplate | undefined;
    onCreated: () => void;
    onDestroyed: () => void;
    onRendered: () => void;
    onUpdated: () => void;
    onThemeChanged: (...args: any[]) => void;
}
