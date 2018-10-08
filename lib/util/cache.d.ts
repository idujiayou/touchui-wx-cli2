import { XcxNode } from '../class';
export declare const xcxNodeCache: {
    cached: {};
    set(request: string, xcxNode: XcxNode): void;
    get(request: string): XcxNode | null;
    getBeDepends(request: string): string[];
    remove(request: string): void;
    check(request: string): boolean;
    clear(): void;
};
export declare const xcxNext: {
    lack: {};
    buffer: {};
    addLack(request: string): void;
    removeLack(request: string): void;
    checkLack(request: string): boolean;
    watchNewFile(request: string): void;
    watchChangeFile(request: string): void;
    watchDeleteFile(request: string): void;
    reset(): void;
    clear(): void;
    get(): string[];
};
