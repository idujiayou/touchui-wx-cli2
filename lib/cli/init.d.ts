/// <reference path="../../types/index.d.ts" />
import { ProjectType } from '../declare';
export declare namespace InitCommand {
    interface Options {
        proName: string;
        projectPath: string;
        projectType: ProjectType;
        isContinue: Boolean;
        projectTypeTitle: '组件库' | '小程序';
        title: string;
        appId?: string;
        description?: string;
        prefix?: string;
        prefixStr?: string;
        useGlobalStyle: boolean;
        useGlobalLayout?: boolean;
        dest: string;
        npmDest?: string;
        npmScope?: string;
        npmScopeStr?: string;
        gitUrl?: string;
        author?: string;
        initAfterContinueNewPackage?: boolean;
    }
    interface CLIOptions {
    }
}
export declare class InitCommand {
    options: InitCommand.Options;
    constructor(options: InitCommand.Options);
    run(): Promise<void>;
    private copyScaffold();
    private updateConfig();
    private newPackage();
    private npmInstall();
    private minBuild();
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
    action(proName: string, options: InitCommand.Options): Promise<void>;
};
export default _default;
