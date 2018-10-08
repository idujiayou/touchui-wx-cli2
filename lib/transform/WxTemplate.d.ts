export declare class WxTemplate {
    source: string;
    isApp: Boolean | undefined;
    dom: any;
    directiveElems: any[];
    attrToStyleElems: any[];
    bindEventsElems: any[];
    styleElems: any[];
    customStyleElems: any[];
    wechatIconElems: any[];
    twoWayBindingElems: any[];
    adjustmentElems: any[];
    renameElems: any[];
    constructor(source: string, isApp?: Boolean | undefined);
    initDom(): void;
    generator(): Promise<string>;
    transformWxDirective(): void;
    transformEventArgs(): void;
    transformBraceStyle(): void;
    transformIcons(): void;
    transformTwoWayBinding(): void;
    adjustAttrs(): void;
    transformWxTag2UiTag(): void;
    handleRootElement(): void;
}
