import { Depend, Request, WxSFM } from '../class';
import { CompileType } from '../declare';
export declare namespace WxSFMScript {
    interface Options {
        compileType?: CompileType;
        templateCode?: string;
    }
    interface Config {
        component?: boolean;
        usingComponents?: UsingComponents;
        [name: string]: any;
    }
    interface UsingComponents {
        [key: string]: string;
    }
}
export declare class WxSFMScript extends WxSFM {
    options: WxSFMScript.Options;
    private node;
    private config;
    private depends;
    constructor(source: string, request: Request, options: WxSFMScript.Options);
    initConfig(options: WxSFMScript.Options): void;
    getConfig(): WxSFMScript.Config;
    getUsingComponents(): WxSFMScript.UsingComponents;
    getDepends(): Depend[];
    updateDepends(useRequests: Request.Core[]): void;
    generator(): string;
    save(): void;
    remove(): void;
    afterSave(): void;
    private initNode();
    private traverse();
    private checkUseModuleExports(path);
    private checkUseExportDefault(path);
    private visitStructure(path);
    private visitMarkdown(path);
    private visitDepend(path);
    private visitConfig(path);
    private addWXCDepends(usingComponents?);
    private addNativeDepends($node);
    private md2htmlFromFile(file);
    private transfromConfig(node);
    private saveConfigFile();
}
