/* tslint:disable */
/* eslint-disable */
export function wasm_init(): void;
export class WasmCandidateWithPosition {
  private constructor();
  free(): void;
  readonly candidate: string;
  readonly position: number;
}
export class WasmChangedContent {
  free(): void;
  constructor(content: string | null | undefined, extension: string);
  readonly content: string | undefined;
  readonly extension: string;
}
export class WasmScanner {
  free(): void;
  constructor();
  getCandidatesWithPositions(content: WasmChangedContent): WasmCandidateWithPosition[];
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmchangedcontent_free: (a: number, b: number) => void;
  readonly wasmchangedcontent_new: (a: number, b: number, c: number, d: number) => number;
  readonly wasmchangedcontent_content: (a: number) => [number, number];
  readonly wasmchangedcontent_extension: (a: number) => [number, number];
  readonly __wbg_wasmcandidatewithposition_free: (a: number, b: number) => void;
  readonly wasmcandidatewithposition_candidate: (a: number) => [number, number];
  readonly wasmcandidatewithposition_position: (a: number) => number;
  readonly __wbg_wasmscanner_free: (a: number, b: number) => void;
  readonly wasmscanner_new: () => number;
  readonly wasmscanner_getCandidatesWithPositions: (a: number, b: number) => [number, number];
  readonly wasm_init: () => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput; } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?: { module_or_path: InitInput | Promise<InitInput>; } | InitInput | Promise<InitInput>,
): Promise<InitOutput>;
