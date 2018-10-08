import * as chokidar from 'chokidar';
import { XcxNode, XcxTraverse } from '../class';
export declare namespace Xcx {
    interface Entry extends XcxNode.Options {
        isGlob?: boolean;
    }
    interface Options {
        isClear?: boolean;
        packageNames?: string[];
        app?: {
            isSFC?: boolean;
        };
        pages?: string[];
        traverse: XcxTraverse.Options;
    }
}
export declare class Xcx {
    options: Xcx.Options;
    private isWatched;
    constructor(options: Xcx.Options);
    clear(): Promise<void>;
    parser(entry: Xcx.Entry | Xcx.Entry[]): XcxNode[];
    transfromFromEntry(entry: Xcx.Entry | Xcx.Entry[]): void;
    transfrom(xcxNode: XcxNode | XcxNode[]): void;
    compile(): void;
    clearPackages(): void;
    compilePackages(): void;
    watch(): chokidar.FSWatcher;
    checkPackageUpdates(): void;
    next(): void;
    private copyProjectConfig();
    private deleteProjectConfig();
    private appCompile();
    private pagesCompile();
    private imagesCompile();
    private watchAdd(file);
    private watchChange(file);
    private watchDelete(file);
}
