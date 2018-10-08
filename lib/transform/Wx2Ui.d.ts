import { Transformer, WxFile, UiFile } from '.';
export declare class Wx2Ui extends Transformer {
    app: WxFile;
    uiApp: UiFile;
    constructor(src: string, dest: string);
    init(): boolean;
    transform(): Promise<void>;
    copyScaffold(): Promise<void>;
    writeApp(): Promise<void>;
    writePages(): Promise<void>;
    getPages(): any[];
    done(): Promise<void>;
}
