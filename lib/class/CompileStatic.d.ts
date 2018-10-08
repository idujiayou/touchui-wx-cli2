import { Depend, Request, WxFile } from '../class';
export declare class CompileStatic implements WxFile.Core {
    request: Request;
    constructor(request: Request);
    save(): void;
    remove(): void;
    getDepends(): Depend[];
    updateDepends(useRequests: Request.Core[]): void;
}
