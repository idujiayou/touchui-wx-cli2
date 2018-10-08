import { UiTemplate, UiScript, UiStyle } from '.';
export declare class UiFile {
    src: string;
    dest: string;
    isApp: Boolean | undefined;
    template: UiTemplate;
    script: UiScript;
    style: UiStyle;
    source: string;
    constructor(src: string, dest: string, isApp?: Boolean | undefined);
    readonly config: any;
    readonly pages: string[];
    writeFile(relativePath: string): Promise<void>;
    copyImages(relativePath: string): void;
}
