export declare namespace CommitCommand {
    interface Options {
    }
    interface CLIOptions {
    }
}
export declare class CommitCommand {
    options: CommitCommand.Options;
    constructor(options?: CommitCommand.Options);
    run(): Promise<void>;
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
    action(cliOptions: CommitCommand.CLIOptions): Promise<void>;
};
export default _default;
