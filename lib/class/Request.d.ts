import { RequestType } from '../declare';
export declare namespace Request {
    interface Options {
        request: string;
        requestType?: RequestType;
        parent?: string;
        isMain?: boolean;
        isPublish?: boolean;
        isThreeNpm?: boolean;
    }
    interface Default {
        request: string;
        requestType: RequestType;
    }
    interface Path {
        src: string;
        srcRelative: string;
        ext: string;
        dest: string;
        destRelative: string;
        isThreeNpm: boolean;
    }
    interface Core extends Request.Default, Request.Path {
    }
    interface Extend {
        isWxa: boolean;
        isWxp: boolean;
        isWxc: boolean;
        isWxml: boolean;
        isWxss: boolean;
        isWxs: boolean;
        isJs: boolean;
        isTs: boolean;
        isCs: boolean;
        isJson: boolean;
        isCss: boolean;
        isLess: boolean;
        isPcss: boolean;
        isSass: boolean;
        isStylus: boolean;
        isSFC: boolean;
        isNFC: boolean;
        isTemplate: boolean;
        isScript: boolean;
        isStyle: boolean;
        isPng: boolean;
        isJpeg: boolean;
        isGif: boolean;
        isBmp: boolean;
        isWebp: boolean;
        isImage: boolean;
        isEot: boolean;
        isSvg: boolean;
        isTtf: boolean;
        isWoff: boolean;
        isIconFont: boolean;
    }
}
export declare class RequestCore implements Request.Core {
    request: string;
    requestType: RequestType;
    src: string;
    srcRelative: string;
    ext: string;
    dest: string;
    destRelative: string;
    isThreeNpm: boolean;
    constructor(options: Request.Options);
}
export declare class RequestExtend extends RequestCore implements Request.Extend {
    isWxa: boolean;
    isWxp: boolean;
    isWxc: boolean;
    isWxml: boolean;
    isWxss: boolean;
    isJs: boolean;
    isTs: boolean;
    isCs: boolean;
    isJson: boolean;
    isWxs: boolean;
    isPng: boolean;
    isJpeg: boolean;
    isGif: boolean;
    isBmp: boolean;
    isWebp: boolean;
    isEot: boolean;
    isSvg: boolean;
    isTtf: boolean;
    isWoff: boolean;
    isCss: boolean;
    isLess: boolean;
    isPcss: boolean;
    isSass: boolean;
    isStylus: boolean;
    readonly isSFC: boolean;
    readonly isNFC: boolean;
    readonly isTemplate: boolean;
    readonly isScript: boolean;
    readonly isStyle: boolean;
    readonly isStatic: boolean;
    readonly isIconFont: boolean;
    readonly isImage: boolean;
    constructor(options: Request.Options);
}
export declare class Request extends RequestExtend {
    constructor(options: Request.Options);
}
