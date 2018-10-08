export declare abstract class Transformer {
    src: string;
    dest: string;
    initSuccess: Boolean;
    srcType: string;
    destType: string;
    constructor(src: string, dest: string);
    abstract init(): Boolean;
    abstract transform(): void;
}
