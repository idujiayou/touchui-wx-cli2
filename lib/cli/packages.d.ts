export declare namespace PackagesCommand {
    interface Options {
        name?: string;
    }
    interface CLIOptions {
        delete: boolean;
        list: boolean;
    }
}
export declare class PackagesCommand {
    options: PackagesCommand.Options;
    constructor(options: PackagesCommand.Options);
    delete(): Promise<void>;
    list(): Promise<void>;
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
    action(name: string, cliOptions: PackagesCommand.CLIOptions): Promise<void>;
};
export default _default;
