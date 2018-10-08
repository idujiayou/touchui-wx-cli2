"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");
const class_1 = require("../class");
const util_1 = require("../util");
class Global {
    constructor() {
        this.setApp();
        this.setConfig();
    }
    static clear() {
        this._pages = [];
        this._global = new Global();
    }
    static get global() {
        return this._global = this._global || new Global();
    }
    static get isDebug() {
        return this._isDebug;
    }
    static set isDebug(value) {
        this._isDebug = value;
    }
    static get config() {
        return this.global.config;
    }
    static get layout() {
        return this.global.layout;
    }
    static get appConfig() {
        return this.global.appConfig;
    }
    static get appPages() {
        return this.appConfig.pages || [];
    }
    static get appTabBarList() {
        let { tabBar = { list: [] } } = this.appConfig;
        let { list = [] } = tabBar;
        return list;
    }
    static addDevTabBar(tabBarList, devPage) {
        let devSeps = devPage.split('/');
        let devName = devSeps[devSeps.length - 2];
        let iconPath = 'assets/tab/dev.png';
        let selectedIconPath = 'assets/tab/dev_hl.png';
        tabBarList.unshift({
            pagePath: devPage,
            iconPath,
            selectedIconPath,
            text: `<${devName}/>`
        });
        fs.copySync(path.join(__dirname, '../../scaffold', iconPath), util_1.config.getPath('dest', iconPath));
        fs.copySync(path.join(__dirname, '../../scaffold', selectedIconPath), util_1.config.getPath('dest', selectedIconPath));
    }
    static saveAppConfig(pages, isDelete) {
        let { _pages } = this;
        if (isDelete) {
            let remove = _.remove(_pages, (page) => {
                return _.indexOf(pages, page) !== -1;
            });
            if (remove.length === 0) {
                return;
            }
            else {
                pages = _pages;
            }
        }
        else {
            let merge = _.union(_pages, pages);
            let isSame = merge.length === _pages.length;
            if (isSame) {
                return;
            }
            else {
                pages = merge;
            }
        }
        if (pages.length === 0) {
            return;
        }
        let appConfig = _.cloneDeep(this.appConfig);
        let tabBarList = _.cloneDeep(this.appTabBarList);
        let homePage = '';
        if (this.isDebug) {
            homePage = pages[0];
            if (tabBarList.length > 0 && _.indexOf(tabBarList, homePage) === -1) {
                this.addDevTabBar(tabBarList, homePage);
            }
        }
        else if (tabBarList.length > 0) {
            homePage = tabBarList[0].pagePath;
        }
        else {
            homePage = util_1.config.homePage;
        }
        if (tabBarList.length > 0) {
            appConfig.tabBar.list = tabBarList;
        }
        this._pages = pages;
        appConfig.pages = pages;
        appConfig = _.omit(appConfig, 'usingComponents');
        let appConfigCont = JSON.stringify(appConfig, null, 2);
        let appConfigPath = util_1.config.getPath('dest', 'app.json');
        util_1.log.msg(util_1.LogType.GENERATE, path.relative(util_1.config.cwd, appConfigPath));
        fs.writeFileSync(appConfigPath, appConfigCont, 'utf8');
    }
    setConfig() {
        let file = path.join(util_1.config.cwd, util_1.config.filename);
        let configData = fs.existsSync(file) ? fs.readJsonSync(file) : {};
        let { style: styleConfig = {} } = configData;
        let theme = this.appConfig.theme;
        styleConfig = Object.assign({}, styleConfig, theme);
        let lessCode = this.generateStyleVariables(styleConfig, 'Less');
        let pcssCode = this.generateStyleVariables(styleConfig, 'Pcss');
        this.config = {
            style: {
                config: configData,
                lessCode,
                pcssCode
            }
        };
    }
    generateStyleVariables(styleConfig, styleType) {
        let map = [];
        let httpRegExp = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
        let symbol = '';
        switch (styleType) {
            case 'Less':
                symbol = '@';
                break;
            case 'Pcss':
                symbol = '$';
                break;
            default:
                throw new Error('没有找到StyleType类型');
        }
        _.forIn(styleConfig, (value, key) => {
            if (httpRegExp.test(value)) {
                value = `'${value}'`;
            }
            map.push(`${symbol}${key}: ${value};`);
        });
        return map.join('\n');
    }
    setApp() {
        let request = new class_1.Request({
            request: `./app${util_1.config.ext.wxa}`,
            parent: util_1.config.getPath('src'),
            isMain: true
        });
        let template = '';
        let appConfig = {};
        let usingComponents = {};
        if (request.src) {
            let source = fs.readFileSync(request.src, 'utf-8');
            let { script: { code: scriptCode, compileType: scriptCompileType }, template: { code: templateCode } } = util_1.dom.getSFC(source);
            let wxSFMScript = new class_1.WxSFMScript(scriptCode, request, {
                compileType: scriptCompileType,
                templateCode: templateCode
            });
            template = templateCode;
            usingComponents = wxSFMScript.getUsingComponents();
            appConfig = wxSFMScript.getConfig();
        }
        this.layout = {
            app: {
                template,
                usingComponents
            }
        };
        let theme = appConfig['theme'] || {};
        if (!theme['theme-color']) {
            theme['theme-color'] = '#39f';
            util_1.log.msg(util_1.LogType.WARN, '未设置主题色，将使用`#39f`作为主题色');
        }
        appConfig['theme'] = theme;
        this.appConfig = appConfig;
    }
}
Global._pages = [];
exports.Global = Global;
