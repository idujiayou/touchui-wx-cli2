import * as babel from 'babel-core';
export declare const scriptAstUtil: {
    transform(source: string): babel.types.File;
    getExportDefaultProperties(node: any): any;
    getNodeFromRootByPath(node: any, path: string): any;
    getReturnObjectProperties(node: any): any;
    isMatchMethods(n: any, methods: string[]): boolean;
    transformFromNode(node: any): any;
    transformFromAst(ast: any, handle?: Function | undefined): string;
};
