export declare namespace BuildCommand {
    interface Options {
    }
    interface CLIOptions {
    }
}
export declare class BuildCommand {
    options: BuildCommand.Options;
    constructor(options?: BuildCommand.Options);
    run(): Promise<void>;
    private buildMinProject();
    private buildNpmDepends();
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
    action(cliOptions: BuildCommand.CLIOptions): Promise<void>;
};
export default _default;
