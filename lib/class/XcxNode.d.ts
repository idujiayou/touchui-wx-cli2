import { Request, WxFile } from '../class';
export declare namespace XcxNode {
    interface Options extends Request.Options {
        isForce?: boolean;
        root?: XcxNode;
    }
}
export declare class XcxNode {
    request: Request;
    children: XcxNode[];
    wxFile: WxFile;
    useRequests: Request.Core[];
    lackRequests: Request.Default[];
    constructor(request: Request, root?: XcxNode);
    static create(options: XcxNode.Options): XcxNode | null;
    compile(): void;
    private cached();
    private recursive();
    private lack();
}
