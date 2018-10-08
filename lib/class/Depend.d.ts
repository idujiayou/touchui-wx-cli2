import * as babel from 'babel-core';
import * as postcss from 'postcss';
import { Request } from '../class';
import { RequestType } from '../declare';
import t = babel.types;
export declare type Depend = Depend.Template | Depend.TemplateImage | Depend.Wxs | Depend.Script | Depend.Style | Depend.StyleIconFont | Depend.Wxc | Depend.Wxp | Depend.Json;
export declare namespace Depend {
    interface Template extends Request.Default {
        requestType: RequestType.TEMPLATE;
        $elem: any;
    }
    interface TemplateImage extends Request.Default {
        requestType: RequestType.IMAGE;
        $elem: any;
    }
    interface Wxs extends Request.Default {
        requestType: RequestType.WXS;
        $elem?: any;
        $node?: t.StringLiteral;
    }
    interface Script extends Request.Default {
        requestType: RequestType.SCRIPT;
        $node: t.StringLiteral;
    }
    interface Json extends Request.Default {
        requestType: RequestType.JSON;
        $node: t.StringLiteral;
    }
    interface Style extends Request.Default {
        requestType: RequestType.STYLE;
        $atRule: postcss.AtRule;
    }
    interface StyleIconFont extends Request.Default {
        requestType: RequestType.ICONFONT;
        $decl: postcss.Declaration;
    }
    interface Wxc extends Request.Default {
        requestType: RequestType.WXC;
        usingKey: string;
    }
    interface Wxp extends Request.Default {
        requestType: RequestType.WXP;
        usingKey: string;
    }
}
