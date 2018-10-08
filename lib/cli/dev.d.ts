export declare namespace DevCommand {
    interface Options {
        pages?: string[];
        watch?: boolean;
        clear?: boolean;
    }
    interface CLIOptions {
    }
}
export declare class DevCommand {
    options: DevCommand.Options;
    private watcher;
    constructor(options: DevCommand.Options);
    run(): Promise<void>;
    closeWatch(): void;
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
    action(name: string, options: DevCommand.CLIOptions): Promise<void>;
};
export default _default;
