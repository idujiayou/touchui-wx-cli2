import { WxFile } from '.';
export declare class WxApp extends WxFile {
    src: string;
    dest: string;
    isApp: Boolean | undefined;
    constructor(src: string, dest: string, isApp?: Boolean | undefined);
    writeFile(relativePath: string): Promise<void>;
}
