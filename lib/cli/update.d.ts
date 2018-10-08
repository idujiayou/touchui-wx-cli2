export declare namespace UpdateCommand {
    interface Options {
        pkgNames?: string[];
    }
    interface CLIOptions {
    }
}
export declare class UpdateCommand {
    options: UpdateCommand.Options;
    constructor(options: UpdateCommand.Options);
    run(): Promise<void>;
    private update(pkgNames);
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
    action(name: string, cliOptions: UpdateCommand.CLIOptions): Promise<void>;
};
export default _default;
