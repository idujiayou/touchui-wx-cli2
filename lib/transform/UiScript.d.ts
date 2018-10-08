import * as babel from 'babel-core';
import { NodePath } from 'babel-traverse';
import t = babel.types;
export declare namespace UiScript {
    interface Config {
        [name: string]: any;
    }
}
export declare class UiScript {
    source: string;
    isApp: Boolean | undefined;
    node: any;
    props: any;
    private _config;
    private _pages;
    constructor(source: string, isApp?: Boolean | undefined);
    readonly config: any;
    readonly pages: string[];
    initNode(): void;
    generator(): Promise<string>;
    transformProperties(): void;
    transformUi(): void;
    vistorExpressionStatement(path: NodePath<t.ExpressionStatement>): void;
    updateConfigPages(): void;
    addOnLaunchToApp(): void;
    _tranformData(props: any, data: any): void;
    _transformMethods(props: any, methods: any, i: number): void;
    _transformLifeCycle(lifeCycle: any, name: string): void;
    generateCode(): string;
}
