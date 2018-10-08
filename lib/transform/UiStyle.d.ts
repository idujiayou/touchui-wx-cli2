export declare namespace UiStyle {
}
export declare class UiStyle {
    source: string;
    isApp: Boolean | undefined;
    dom: any;
    constructor(source: string, isApp?: Boolean | undefined);
    generator(): Promise<string>;
    private transformSelectors(code);
    private removeUselessRules(code);
}
