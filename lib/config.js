"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scope = '@minui';
const config = {
    title: 'TouchUI',
    cli: 'tui',
    filename: 'min.config.json',
    projectType: '',
    cwd: process.cwd(),
    prefix: 'wxc',
    src: '',
    dest: 'dist',
    pages: '{{src}}/pages',
    static: '{{src}}/static',
    packages: 'packages',
    package: {
        src: 'src',
        dest: '{{dest}}',
        default: 'index'
    },
    homePage: 'pages/home/index',
    layout: {
        placeholder: '<page></page>'
    },
    npm: {
        scope,
        src: 'node_modules',
        dest: '{{dest}}/{{packages}}'
    },
    alias: {
        'common': '{{src}}/common',
        'layout': '{{src}}/common/layout',
        'assets': '{{src}}/common/assets',
        'components': '{{src}}/common/components'
    },
    ext: {
        wxc: '.wxc',
        wxp: '.wx',
        wxa: '.wxa',
        ui: '.ui',
        wxml: '.wxml',
        wxss: '.wxss',
        js: '.js',
        json: '.json',
        png: '.png',
        jpg: '.jpg',
        jpeg: '.jpeg',
        gif: '.gif',
        webp: '.webp',
        eot: '.eot',
        svg: '.svg',
        ttf: '.ttf',
        woff: '.woff',
        wxs: '.wxs',
        css: '.css',
        less: '.less',
        pcss: '.pcss',
        postcss: '.postcss',
        sass: '.sass',
        stylus: '.stylus'
    },
    structure: {
        wxc: 'Component',
        wxp: 'Page',
        wxa: 'App'
    },
    compilers: {},
    style: {
        lang: {
            'less': 'less',
            'scss': 'sass',
            'sass': 'sass',
            'pcss': 'postcss',
            'postcss': 'postcss'
        },
        compile: {},
        unit: {
            px2rpx: false,
            rem2rpx: false
        },
        bem: {
            use: true,
            rule: ''
        }
    },
    log: {
        verbose: true,
        time: true,
        level: 0
    },
    cache: {}
};
exports.default = config;
