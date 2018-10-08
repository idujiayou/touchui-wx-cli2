export declare namespace TransformCommand {
    interface Options {
        type: string;
        src: string;
        dest: string;
    }
    interface CLIOptions {
    }
}
export declare class TransformCommand {
    options: TransformCommand.Options;
    private transformer;
    constructor(options: TransformCommand.Options);
    run(): Promise<void>;
}
declare const _default: {
    name: string;
    usage: string;
    description: string;
    on: {
        '--help': () => void;
    };
    options: string[][];
    action(name: string, options: TransformCommand.Options): Promise<void>;
};
export default _default;
