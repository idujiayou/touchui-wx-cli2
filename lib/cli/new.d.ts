/// <reference path="../../types/index.d.ts" />
import { NewType } from '../declare';
export declare namespace NewCommand {
    interface Options {
        newType?: NewType;
        name?: string;
        title?: string;
        pagePath?: string;
        newAfterContinueBuild?: boolean;
    }
}
export declare class NewCommand {
    options: NewCommand.Options;
    constructor(options: NewCommand.Options);
    run(): Promise<void>;
    private newScaffold(answers);
    private newPackage(newData);
    private newPage(newData);
    private updateConfigPages(pagePath);
    private updateHomeMenu(answers);
    private buildPage(answers);
}
declare const _default: {
    name: string;
    alias: string;
    usage: string;
    description: string;
    options: string[][];
    on: {
        '--help': () => void;
    };
    action(name: string | undefined, options: NewCommand.Options): Promise<void>;
};
export default _default;
