export declare namespace WxStyle {
}
export declare class WxStyle {
    source: string;
    isApp: Boolean | undefined;
    dom: any;
    constructor(source: string, isApp?: Boolean | undefined);
    generator(): Promise<string>;
    private transformSelectors(code);
    private removeUselessRules(code);
}
