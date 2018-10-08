/// <reference path="../../types/index.d.ts" />
import { Transformer, UiFile } from '.';
export declare namespace Ui2Wx {
}
export declare class Ui2Wx extends Transformer {
    app: UiFile;
    constructor(src: string, dest: string);
    init(): boolean;
    transform(): Promise<void>;
    writeApp(): Promise<void>;
    writePages(): Promise<void>;
    writeStatic(): Promise<void>;
    writePackage(): Promise<{}>;
    npmInstall(): Promise<void>;
    done(): Promise<void>;
}
