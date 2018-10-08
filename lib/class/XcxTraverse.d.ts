import { XcxNode } from '../class';
export declare namespace XcxTraverse {
    type VisitType = 'start' | 'end' | 'enter' | 'exit' | 'app' | 'page' | 'component' | 'pages' | 'components';
    type VisitNode<T> = VisitNodeFunction<T> | VisitNodeObject<T>;
    type VisitNodeFunction<T> = (xcxNode: T) => void;
    interface VisitNodeObject<T> {
        enter?(xcxNode: T): void;
        exit?(xcxNode: T): void;
    }
    interface Visitor<T = XcxNode> extends VisitNodeObject<T> {
        start?: () => void;
        end?: () => void;
        app?: VisitNode<T>;
        page?: VisitNodeFunction<T>;
        component?: VisitNodeFunction<T>;
        pages?: VisitNodeFunction<string[]>;
        components?: VisitNodeFunction<T[]>;
    }
    interface Options extends Visitor {
    }
}
export declare class XcxTraverse {
    private options;
    private pages;
    private components;
    constructor(options: XcxTraverse.Options);
    static traverse(parent: XcxNode | XcxNode[], options: XcxTraverse.Options): void;
    traverse(parent: XcxNode | XcxNode[]): void;
    private pageReplacer(destRelative);
    private componentReplacer(destRelative);
    private recursive(parent);
    private resolve(xcxNode);
    private trigger(method, value);
}
