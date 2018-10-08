import { Depend, Request } from '../class';
export declare namespace WxSFM {
    interface Options {
        destExt: string;
    }
}
export declare class WxSFM {
    request: Request;
    source: string;
    protected dest: string;
    protected destRelative: string;
    protected destExt: string;
    constructor(source: string, request: Request, options: WxSFM.Options);
    readonly isWxa: boolean;
    readonly isWxp: boolean;
    readonly isWxc: boolean;
    readonly isSFC: boolean;
    getDester(ext: string): {
        dest: string;
        destRelative: string;
    };
    generator(): Promise<string> | string;
    beforeSave(): void;
    save(): void;
    afterSave(): void;
    beforeRemove(): void;
    saveStatic(): void;
    remove(): void;
    afterRemove(): void;
    getDepends(): Depend[];
    updateDepends(uses: Request.Core[]): void;
    private initDest();
    private write(code);
}
