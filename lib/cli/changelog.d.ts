export declare namespace ChangelogCommand {
    interface Options {
    }
    interface CLIOptions {
    }
}
export declare class ChangelogCommand {
    options: ChangelogCommand.Options;
    constructor(options?: ChangelogCommand.Options);
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
    action(cliOptions: ChangelogCommand.CLIOptions): Promise<void>;
};
export default _default;
