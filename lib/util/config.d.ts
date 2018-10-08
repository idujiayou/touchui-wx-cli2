import { Config, CustomConfig } from '../declare';
declare let defaultConfig: Config & CustomConfig;
declare let customConfig: CustomConfig, customConfigFromPkg: CustomConfig, customConfigFromFile: CustomConfig;
export declare const config: {
    getPath(name: "file" | "src" | "packages" | "dest" | "npm.dest" | "pages" | "cache.file" | "cache.xcxast" | "npm.src", ...paths: string[]): string;
    reload(cwd?: string): void;
    update(newConfig: any): void;
    updateCustomFile(newConfig: any): void;
    title: string;
    cli: string;
    filename: string;
    projectType: string | (string & undefined);
    cwd: string;
    prefix: string | (string & undefined);
    src: string | (string & undefined);
    dest: string | (string & undefined);
    pages: string;
    static: string;
    packages: string | (string & undefined);
    package: {
        src: string;
        dest: string;
        default: "index";
    };
    homePage: string;
    layout: {
        placeholder: string;
    };
    npm: {
        scope: string;
        src: string;
        dest: string;
    } & {
        scope: string;
        dest: string;
    };
    alias: {
        [key: string]: string;
        common: string;
        layout: string;
        assets: string;
        components: string;
    } & {
        [key: string]: string;
    };
    ext: {
        [key: string]: string;
        wxc: string;
        wxp: string;
        wxa: string;
        ui: string;
        wxml: string;
        wxss: string;
        js: string;
        json: string;
        png: string;
        jpg: string;
        jpeg: string;
        gif: string;
        webp: string;
        eot: string;
        svg: string;
        ttf: string;
        woff: string;
        wxs: string;
        less: string;
        pcss: string;
    };
    structure: {
        wxc: string;
        wxp: string;
        wxa: string;
    };
    compilers: any;
    style: {
        lang: {
            less: string;
            scss: string;
            sass: string;
            pcss: string;
            postcss: string;
        };
        compile: {
            [key: string]: Function;
        };
        unit: {
            px2rpx: boolean;
            rem2rpx: boolean;
        };
        bem: {
            use: boolean;
            rule: string;
        };
    } & {
        [key: string]: string | {
            [key: string]: string | number | boolean | Function;
        };
    };
    log: {
        verbose: boolean;
        time: boolean;
        level: number;
    };
    cache: {};
    prefixStr: string;
};
export { defaultConfig, customConfig, customConfigFromFile, customConfigFromPkg };
