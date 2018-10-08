export declare abstract class BaseParser {
    abstract parse(node: any): void;
    readonly themeColor: string;
    protected setThemeColor(node: any, attr: string): void;
    protected transformTag(options: any): void;
    protected setTruthyClasses(node: any, attrs: any): void;
}
