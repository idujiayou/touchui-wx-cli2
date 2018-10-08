export interface Config extends CustomConfig {
    title: string;
    cli: string;
    filename: string;
    projectType: string;
    cwd: string;
    prefix: string;
    src: string;
    dest: string;
    pages: string;
    static: string;
    packages: string;
    package: {
        src: string;
        dest: string;
        default: 'index';
    };
    homePage: string;
    layout: {
        placeholder: string;
    };
    npm: {
        scope: string;
        src: string;
        dest: string;
    };
    alias: {
        common: string;
        layout: string;
        assets: string;
        components: string;
        [key: string]: string;
    };
    ext: {
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
        [key: string]: string;
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
    };
    log: {
        verbose: boolean;
        time: boolean;
        level: number;
    };
    cache: {};
}
export interface CustomConfig {
    compilers?: any;
    style?: {
        [key: string]: string | {
            [key: string]: string | Function | boolean | number;
        };
    };
    src?: string;
    packages?: string;
    dest?: string;
    alias?: {
        [key: string]: string;
    };
    prefix?: string;
    npm?: {
        scope: string;
        dest: string;
    };
    projectType?: string;
}
