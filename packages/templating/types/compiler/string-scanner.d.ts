export class StringScanner {
    static DEBUG_MODE: boolean;
    input: string;
    pos: number;

    constructor(input: string);
    matches(regex: RegExp): boolean;
    rest(): string;
    step(step?: number): void;
    rewind(step?: number): void;
    isEOF(): boolean;
    peek(): string;
    consume(pattern: string | RegExp): string | null;
    consumeUntil(pattern: string | RegExp): string;
    returnTo(pattern: string | RegExp): string | undefined;
    getContext(): { insideTag: boolean; attribute?: string; booleanAttribute?: boolean };
    fatal(msg?: string): never;
}
