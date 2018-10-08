import * as babel from 'babel-core';
import { NodePath } from 'babel-traverse';
import t = babel.types;
export declare namespace WxScript {
    interface Config {
        [name: string]: any;
    }
}
export declare class WxScript {
    source: string;
    isApp: Boolean | undefined;
    node: any;
    props: any;
    constructor(source: string, isApp?: Boolean | undefined);
    readonly config: any;
    initNode(): void;
    generator(): Promise<string>;
    transformProperties(): void;
    transformWx(): void;
    vistorExpressionStatement(path: NodePath<t.ExpressionStatement>): void;
    addOnLaunchToApp(): void;
    _tranformData(props: any, data: any, i: number): void;
    _transformMethods(props: any, methods: any, i: number): void;
    _transformLifeCycle(lifeCycle: any, name: string): void;
    generateCode(): string;
}
