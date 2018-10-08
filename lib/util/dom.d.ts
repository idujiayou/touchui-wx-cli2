import { CompileType } from '../declare';
export declare const dom: {
    make: (source: string) => any;
    getSFM: (parentElem: any, module: string) => {
        code: string;
        lang: string;
        compileType: CompileType | undefined;
    };
    getSFC: (source: string) => {
        template: {
            code: string;
            lang: string;
            compileType: CompileType | undefined;
        };
        style: {
            code: string;
            lang: string;
            compileType: CompileType | undefined;
        };
        script: {
            code: string;
            lang: string;
            compileType: CompileType | undefined;
        };
    };
    combineCode: (templateCode: string, scriptCode: string, styleCode: string) => string;
    getElementsByAttrRegex: (dom: any, nameReg: RegExp, valueReg?: RegExp | undefined) => any[];
    getElementsByTagName: (dom: any, tagNames: string | string[]) => any;
    getTagNamesByRegex: (dom: any, tagReg: RegExp, duplicate?: Boolean | undefined) => string[];
    isOneRootDom: (dom: any) => boolean;
};
