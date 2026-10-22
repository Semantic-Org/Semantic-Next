import { CallParams, Template } from '@semantic-ui/templating';

export interface PluginSetupParams<TSettings extends Record<string, any> = Record<string, any>> {
  settings: TSettings;
  isServer: boolean;
  isClient: boolean;
  namespace: string;
}

export interface PluginCallParams<
  TSettings extends Record<string, any> = Record<string, any>,
  TSelf extends Record<string, any> = Record<string, any>,
  TConfig = any,
> extends Omit<CallParams, 'self' | 'settings'> {
  self: TSelf;
  plugin: TSelf;
  settings: TSettings;
  config: TConfig;
  componentSettings: Record<string, any>;
  namespace: string;
}

export interface PluginAppliesToParams<
  TSettings extends Record<string, any> = Record<string, any>,
  TConfig = any,
> {
  config: TConfig;
  tagName: string | undefined;
  templateName: string;
  isSubtemplate: boolean;
  settings: TSettings;
  componentSettings: Record<string, any>;
  el: HTMLElement | undefined;
  template: Template;
}

export type PluginAppliesTo<
  TSettings extends Record<string, any> = Record<string, any>,
  TConfig = any,
> =
  | 'components'
  | 'all'
  | 'templates'
  | 'configured'
  | string
  | string[]
  | ((params: PluginAppliesToParams<TSettings, TConfig>) => boolean);

export interface PluginDefinition<
  TSettings extends Record<string, any> = Record<string, any>,
  TShared extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
  TConfig = any,
> {
  namespace: string;
  name?: string;
  defaultSettings?: TSettings;
  resolveSettings?: (params: PluginCallParams<TSettings, TShared, TConfig>) => Partial<TSettings>;
  setup?: (params: PluginSetupParams<TSettings>) => TShared;
  createPlugin?: (params: PluginCallParams<TSettings, TShared & TInstance, TConfig>) => TInstance;
  lifecycleParams?:
    | Record<string, any>
    | ((params: PluginCallParams<TSettings, TShared & TInstance, TConfig>) => Record<string, any>);
  params?:
    | Record<string, any>
    | ((params: PluginCallParams<TSettings, TShared & TInstance, TConfig>) => Record<string, any>);
  templateData?:
    | Record<string, any>
    | ((params: PluginCallParams<TSettings, TShared & TInstance, TConfig>) => Record<string, any>);
  data?:
    | Record<string, any>
    | ((params: PluginCallParams<TSettings, TShared & TInstance, TConfig>) => Record<string, any>);
  templateHelpers?:
    | Record<string, any>
    | ((params: PluginCallParams<TSettings, TShared & TInstance, TConfig>) => Record<string, any>);
  onCreated?: (params: PluginCallParams<TSettings, TShared & TInstance, TConfig>) => void;
  onRendered?: (params: PluginCallParams<TSettings, TShared & TInstance, TConfig>) => void;
  onDestroyed?: (params: PluginCallParams<TSettings, TShared & TInstance, TConfig>) => void;
  appliesTo?: PluginAppliesTo<TSettings, TConfig>;
}

export interface InstalledPluginEntry<
  TSettings extends Record<string, any> = Record<string, any>,
  TShared extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
> {
  namespace: string;
  definition: PluginDefinition<TSettings, TShared, TInstance>;
  baseSettings: TSettings;
  pluginSettings: TSettings;
  settingsVars: Map<string, any>;
  sharedState: TShared;
}

export function registerPlugin<
  TSettings extends Record<string, any> = Record<string, any>,
  TShared extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
  TConfig = any,
>(
  plugin: PluginDefinition<TSettings, TShared, TInstance, TConfig>,
): PluginDefinition<TSettings, TShared, TInstance, TConfig>;

export function addPlugin<
  TSettings extends Record<string, any> = Record<string, any>,
  TShared extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
>(
  pluginOrNamespace: PluginDefinition<TSettings, TShared, TInstance> | string,
  appSettings?: Partial<TSettings>,
): InstalledPluginEntry<TSettings, TShared, TInstance>;

export function extendParams(
  params: Record<string, any> | ((params: PluginCallParams) => Record<string, any>),
): void;

export function extendData(
  data: Record<string, any> | ((params: PluginCallParams) => Record<string, any>),
): void;
