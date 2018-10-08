export declare namespace PublishCommand {
    interface Options {
        pkgName?: string;
        lernaOptions?: Object;
    }
    interface CLIOptions {
    }
}
export declare class PublishCommand {
    options: PublishCommand.Options;
    constructor(options: PublishCommand.Options);
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
    action(pkgName: string, cliOptions: PublishCommand.CLIOptions): Promise<void>;
};
export default _default;
