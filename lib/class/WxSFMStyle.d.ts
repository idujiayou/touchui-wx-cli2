import { Depend, Request, WxSFM } from '../class';
import { CompileType } from '../declare';
export declare namespace WxSFMStyle {
    interface Options {
        compileType?: CompileType;
    }
}
export declare class WxSFMStyle extends WxSFM {
    options: WxSFMStyle.Options;
    private result;
    private depends;
    constructor(source: string, request: Request, options: WxSFMStyle.Options);
    compileStyle(): Promise<any>;
    compileLess(): Promise<string>;
    compilePcss(): Promise<string>;
    generator(): Promise<string>;
    save(): void;
    remove(): void;
    getDepends(): Depend[];
    updateDepends(useRequests: Request.Core[]): void;
    private initDepends();
}
