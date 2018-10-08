export declare namespace Global {
    interface StyleConfig {
        [key: string]: string;
    }
    interface Style {
        config: StyleConfig;
        lessCode: string;
        pcssCode: string;
    }
    interface Config {
        style: Style;
    }
    interface Layout {
        app: {
            template: string;
            usingComponents: {
                [key: string]: string;
            };
        };
    }
    interface AppConfig {
        [key: string]: any;
    }
}
export declare class Global {
    static _isDebug: boolean;
    static _pages: string[];
    static _global: Global;
    config: Global.Config;
    layout: Global.Layout;
    appConfig: Global.AppConfig;
    constructor();
    static clear(): void;
    static readonly global: Global;
    static isDebug: boolean;
    static readonly config: Global.Config;
    static readonly layout: Global.Layout;
    static readonly appConfig: Global.AppConfig;
    static readonly appPages: any;
    static readonly appTabBarList: any[];
    static addDevTabBar(tabBarList: any[], devPage: string): void;
    static saveAppConfig(pages: string[], isDelete?: boolean): void;
    private setConfig();
    private generateStyleVariables(styleConfig, styleType);
    private setApp();
}
