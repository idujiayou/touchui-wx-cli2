import { Depend, Request, WxSFM } from '../class';
import { CompileType } from '../declare';
export declare namespace WxSFMTemplate {
    interface Options {
        compileType?: CompileType;
        usingComponents?: {
            [key: string]: string;
        };
    }
}
export declare class WxSFMTemplate extends WxSFM {
    options: WxSFMTemplate.Options;
    dom: any;
    customElems: any[];
    styleElems: any[];
    exampleElem: any;
    demoElems: any[];
    private depends;
    constructor(source: string, request: Request, options: WxSFMTemplate.Options);
    generator(): string;
    save(): void;
    remove(): void;
    getDepends(): Depend[];
    updateDepends(useRequests: Request.Core[]): void;
    private initDom();
    private initDepends();
    private setCustomTagPidAttr();
    private addExampleMdDocTag();
    private setExampleDemoSourceAttr();
    private parseBraceStyle();
}
