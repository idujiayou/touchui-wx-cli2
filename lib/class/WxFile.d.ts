import { Depend, Request } from '../class';
export declare namespace WxFile {
    interface Core {
        save(): void;
        remove(): void;
        getDepends(): Depend[];
        updateDepends(useRequests: Request.Core[]): void;
    }
}
export declare class WxFile implements WxFile.Core {
    private core;
    constructor(request: Request);
    save(): void;
    remove(): void;
    getDepends(): Depend[];
    updateDepends(useRequests: Request.Core[]): void;
}
