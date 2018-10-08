export declare class CLIExample {
    command: string;
    constructor(command: string);
    group(group: string): this;
    rule(rule: string, comment?: string): this;
}
