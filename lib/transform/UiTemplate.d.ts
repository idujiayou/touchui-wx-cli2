export declare class UiTemplate {
    source: string;
    isApp: Boolean | undefined;
    dom: any;
    directiveElems: any[];
    attrToStyleElems: any[];
    bindEventsElems: any[];
    styleElems: any[];
    customStyleElems: any[];
    wechatIconElems: any[];
    adjustmentElems: any[];
    renameElems: any[];
    constructor(source: string, isApp?: Boolean | undefined);
    initDom(): void;
    generator(): Promise<string>;
    transformUiDirective(): void;
    transformAttrToStyle(): void;
    transformEventArgs(): void;
    transformBraceStyle(): void;
    transformIcons(): void;
    adjustAttrs(): void;
    transformUiTag2WxTag(): void;
}
