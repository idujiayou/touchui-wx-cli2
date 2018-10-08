import { WxTemplate, WxScript, WxStyle } from '.';
export declare class WxFile {
    src: string;
    dest: string;
    isApp: Boolean | undefined;
    template: WxTemplate;
    script: WxScript;
    style: WxStyle;
    source: string;
    constructor(src: string, dest: string, isApp?: Boolean | undefined);
    readonly config: any;
    writeFile(relativePath: string): Promise<void>;
    copyImages(relativePath: string): void;
}
