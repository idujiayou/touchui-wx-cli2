export declare namespace InstallCommand {
    interface Options {
        pkgNames: string[];
    }
    interface CLIOptions {
    }
}
export declare class InstallCommand {
    options: InstallCommand.Options;
    constructor(options: InstallCommand.Options);
    run(): Promise<void>;
    private install(pkgNames);
}
declare const _default: {
    name: string;
    alias: string;
    usage: string;
    description: string;
    options: never[];
    on: {
        '--help': () => void;
    };
    action(name: string, cliOptions: InstallCommand.CLIOptions): Promise<void>;
};
export default _default;
