import { Depend, Request, WxFile, WxSFMTemplate, WxSFMScript, WxSFMStyle } from '../class';
export declare class WxNFC implements WxFile.Core {
    source: string;
    request: Request;
    sfm: WxSFMTemplate | WxSFMStyle | WxSFMScript;
    constructor(source: string, request: Request);
    save(): void;
    remove(): void;
    getDepends(): Depend[];
    updateDepends(useRequests: Request.Core[]): void;
}
