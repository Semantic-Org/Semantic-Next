import { Query } from './query';

export interface BehaviorConfig {
  /** Behavior name */
  name: string;
  /** Namespace for storing behavior on element */
  namespace?: string;
  /** Function that returns behavior instance */
  createBehavior?: Function;
  /** Event handlers */
  events?: Record<string, Function>;
  /** Mutation observers */
  mutations?: Record<string, Function>;
  /** Shared behavior across instances */
  sharedBehavior?: Record<string, any>;
  /** Query element to initialize */
  $element: Query;
  /** Query elements in group */
  $elements: Query;
  /** CSS to be added to page */
  css?: string;
  /** Query class reference */
  Query: typeof Query;
  /** Allow data attributes to override settings */
  allowDataOverride?: boolean;
  /** Callback when created */
  onCreated?: Function;
  /** Callback when destroyed */
  onDestroyed?: Function;
  /** Custom method invocation handler */
  customInvocation?: Function;
  /** Index of element in group */
  elementIndex?: number;
  /** Total elements in group */
  totalElements?: number;
  /** CSS selectors */
  selectors?: Record<string, string>;
  /** CSS class names */
  classNames?: Record<string, string>;
  /** Error messages */
  errors?: Record<string, string>;
  /** Behavior settings */
  settings?: Record<string, any>;
  /** HTML templates */
  templates?: Record<string, string>;
}

export class Behavior {
  static TEMPLATING_REGEX: RegExp;

  constructor(config: BehaviorConfig);

  $: (selector: any, options?: any) => Query;
  Query: typeof Query;
  $element: Query;
  $elements: Query;
  element: Element;
  settings: Record<string, any>;
  namespace: string;
  customInvocation: Function;
  onCreated: Function;
  onDestroyed: Function;
  elementIndex: number;
  totalElements: number;
  classNames: Record<string, string>;
  selectors: Record<string, string>;
  errors: Record<string, string>;
  templates: Record<string, string>;
  mutations: Record<string, Function>;
  sharedBehavior: Record<string, any>;
  controller: AbortController;
  mutationObservers?: MutationObserver[];
  events?: Record<string, Function>;

  adoptStylesheet(css: string): void;
  addDataOverrides(element?: Element): void;
  reinitialize(settings: BehaviorConfig): void;
  parseTemplate(templateString: string, data: Record<string, any>): string;
  parseEventString(eventString: string): Array<{ eventName: string; eventType: string; selector: string; }>;
  getElementData(element?: Element): Record<string, any>;
  attachEvents(events?: Record<string, Function>): void;
  attachMutations(mutations?: Record<string, Function>): void;
  removeMutations(): void;
  parseMutationString(mutationString: string): {
    observedElement: Element;
    keyword: string;
    observerOptions: MutationObserverInit;
    selector: string;
  };
  getMutationCallbackArgs(mutations: MutationRecord[], additionalData?: Record<string, any>): Record<string, any>;
  removeEvents(): void;
  dispatchEvent(
    eventName: string,
    detail?: Record<string, any>,
    eventSettings?: Record<string, any>,
    options?: { element?: Element; namespace?: string; },
  ): void;
  dispatchGroupEvent(
    eventName: string,
    detail?: Record<string, any>,
    eventSettings?: Record<string, any>,
    options?: { $elements?: Query; namespace?: string; },
  ): void;
  lookup(query: string): any;
  callMethod(query: string, ...methodArgs: any[]): any;
  setting(name: string, value?: any): any;
  settings(newSettings?: Record<string, any>): Record<string, any> | this;
  call(func: Function, options?: { additionalParams?: Record<string, any>; }): any;
  destroy(): void;

  static getInstance(element: Element, namespace: string): Behavior | undefined;
  static runSetup(
    setup?: Function,
    config?: { $elements?: Query; settings?: any; templates?: any; },
  ): Record<string, any>;
}
