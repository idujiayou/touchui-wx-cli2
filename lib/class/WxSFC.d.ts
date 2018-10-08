import { Depend, Request, WxFile, WxSFMScript, WxSFMStyle, WxSFMTemplate } from '../class';
export declare class WxSFC implements WxFile.Core {
    source: string;
    template: WxSFMTemplate;
    style: WxSFMStyle;
    script: WxSFMScript;
    constructor(source: string, request: Request);
    readonly sfms: (WxSFMTemplate | WxSFMStyle | WxSFMScript)[];
    save(): void;
    remove(): void;
    getDepends(): Depend[];
    updateDepends(useRequests: Request.Core[]): void;
}
