"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");
const _ = require("lodash");
const chokidar = require("chokidar");
const class_1 = require("../class");
const util_1 = require("../util");
const MINI_PROGRAM_CONFIG_FILE_NAME = 'project.config.json';
class Xcx {
    constructor(options) {
        this.options = options;
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            let { isClear } = this.options;
            if (!isClear)
                return;
            util_1.Global.clear();
            util_1.xcxNext.clear();
            util_1.xcxNodeCache.clear();
            let result = yield util_1.default.checkWechatdevtoolsRunningOnWindows();
            if (!result) {
                fs.emptyDirSync(util_1.config.getPath('dest'));
            }
        });
    }
    parser(entry) {
        let xcxNodes = [];
        if (_.isArray(entry)) {
            entry.forEach(item => {
                xcxNodes = [...xcxNodes, ...this.parser(item)];
            });
        }
        else {
            if (entry.isGlob) {
                let requests = glob.sync(entry.request, {
                    cwd: entry.parent || util_1.config.cwd
                });
                let list = requests.map(request => {
                    return Object.assign({}, _.omit(entry, 'isGlob'), { request });
                });
                xcxNodes = [...xcxNodes, ...this.parser(list)];
            }
            else {
                let xcxNode = class_1.XcxNode.create(entry);
                if (xcxNode) {
                    xcxNodes.push(xcxNode);
                }
            }
        }
        return xcxNodes;
    }
    transfromFromEntry(entry) {
        try {
            let xcxNodes = this.parser(entry);
            this.transfrom(xcxNodes);
        }
        catch (err) {
            console.log(err.stack);
        }
    }
    transfrom(xcxNode) {
        class_1.XcxTraverse.traverse(xcxNode, this.options.traverse);
    }
    compile() {
        try {
            util_1.log.newline();
            this.clear()
                .then(() => {
                this.copyProjectConfig();
                this.appCompile();
                this.componentsCompile();
                this.pagesCompile();
                this.imagesCompile();
            });
        }
        catch (err) {
            console.log(err.stack);
        }
    }
    clearPackages() {
        let { isClear, packageNames = [] } = this.options;
        if (!isClear)
            return;
        packageNames.forEach(packageName => {
            fs.emptyDirSync(util_1.config.getPath('packages', packageName, util_1.config.package.dest));
        });
    }
    
    compilePackages() {
        this.clearPackages();
        let { packageNames = [] } = this.options;
        let glob = '';
        if (packageNames.length === 0) {
            glob = '**';
        }
        else if (packageNames.length === 1) {
            glob = packageNames[0];
        }
        else {
            glob = `{${packageNames.join(',')}}`;
        }
        glob = `./${glob}/${util_1.config.package.src}/*${util_1.config.ext.wxc}`;
        let xcxEntry = {
            request: glob,
            parent: util_1.config.getPath('packages'),
            isMain: true,
            isGlob: true,
            isPublish: true
        };
        this.transfromFromEntry(xcxEntry);
    }
    watch() {
        let watchList = [];
        let commonList = [util_1.config.filename, util_1.config.packages];
        if (fs.existsSync(path.join(util_1.config.cwd, util_1.config.packages))) {
            commonList.push(util_1.config.packages);
        }
        if (util_1.config.src === '') {
            watchList = ['pages', 'static', 'images', 'app.wxa', ...commonList];
        }
        else {
            watchList = [util_1.config.src, ...commonList];
        }
        let watcher = chokidar.watch(watchList, {
            cwd: util_1.config.cwd,
            ignored: /node_modules|\.git|\.txt|\.log|\.DS_Store|\.npmignore|package\.json/i,
            persistent: true,
            ignoreInitial: true
        });
        watcher
            .on('add', this.watchAdd.bind(this))
            .on('change', this.watchChange.bind(this))
            .on('unlink', this.watchDelete.bind(this))
            .on('error', (err) => {
            util_1.log.fatal(err);
        })
            .on('ready', () => {
            if (!this.isWatched) {
                this.isWatched = true;
                util_1.log.msg(util_1.LogType.WATCH, '开始监听文件改动。');
                this.checkPackageUpdates();
            }
        });
        return watcher;
    }
    checkPackageUpdates() {
        setTimeout(() => {
            util_1.default.notifyPackageUpdate({
                packagePath: path.join(util_1.config.cwd, 'node_modules', 'touchui-wx-components', 'package.json'),
                packageName: 'touchui-wx-components'
            });
            util_1.default.notifyPackageUpdate({
                packagePath: path.resolve(__dirname, '../../package.json'),
                packageName: 'touchui-wx-cli',
                isGlobal: true
            });
        }, 100);
    }
    next() {
        let requests = util_1.xcxNext.get();
        if (!requests.length) {
            return;
        }
        let xcxEntry = requests.map(request => {
            return {
                request,
                parent: util_1.config.cwd,
                isMain: true,
                isForce: true
            };
        });
        util_1.log.newline();
        this.transfromFromEntry(xcxEntry);
        util_1.xcxNext.reset();
    }
    copyProjectConfig() {
        let src = path.join(util_1.config.cwd, MINI_PROGRAM_CONFIG_FILE_NAME);
        let dest = util_1.config.getPath('dest', MINI_PROGRAM_CONFIG_FILE_NAME);
        if (!fs.existsSync(src)) {
            return;
        }
        util_1.log.newline();
        util_1.log.msg(util_1.LogType.COPY, MINI_PROGRAM_CONFIG_FILE_NAME);
        fs.copySync(src, dest);
    }
    deleteProjectConfig() {
        let dest = util_1.config.getPath('dest', MINI_PROGRAM_CONFIG_FILE_NAME);
        if (!fs.existsSync(dest)) {
            return;
        }
        util_1.log.newline();
        util_1.log.msg(util_1.LogType.DELETE, MINI_PROGRAM_CONFIG_FILE_NAME);
        fs.unlinkSync(dest);
    }
    appCompile() {
        let { app = {} } = this.options;
        let { isSFC } = app;
        let xcxEntry = {
            request: isSFC ? `./app${util_1.config.ext.wxa}` : './app.{js,wxss}',
            parent: util_1.config.getPath('src'),
            isMain: true,
            isGlob: isSFC ? false : true
        };
        this.transfromFromEntry(xcxEntry);
    }
    componentsCompile () {
        let src = path.join(util_1.config.cwd, '');
        let _this = this

        fs.readdir(src + '/components',function (err,files) {
            if (err) return
            let pages = files;
            let xcxEntry = [];
            let pageFiles = [];

            for (let i = 0; i < pages.length; i++) {
                let item = 'components/'+ pages[i]

                pageFiles.push(item)
                
            }

            pageFiles = _.uniq(pageFiles);

            xcxEntry = [...xcxEntry, ...pageFiles.map(pageFile => {
                return {
                    request: pageFile,
                    parent: util_1.config.getPath('src'),
                    isMain: false
                };
            })];
            _this.transfromFromEntry(xcxEntry);
        })
    }
    pagesCompile() {
        const tabBarList = util_1.Global.appTabBarList;
        let pages = this.options.pages || [];
        if (pages.length === 0) {
            pages = util_1.Global.appPages || [];
        }
        let xcxEntry = [];
        if (pages.length > 0) {
            let pageFiles = [];
            pageFiles = [...pageFiles, ...pages.map(page => `${page}${util_1.config.ext.wxp}`)];
            pageFiles = [...pageFiles, ...tabBarList.map(tabBarItem => `${tabBarItem.pagePath}${util_1.config.ext.wxp}`)];
            pageFiles = _.uniq(pageFiles);
            xcxEntry = [...xcxEntry, ...pageFiles.map(pageFile => {
                    return {
                        request: pageFile,
                        parent: util_1.config.getPath('src'),
                        isMain: true
                    };
                })];
        }
        else {
            xcxEntry = [...xcxEntry, {
                    request: `**/*${util_1.config.ext.wxp}`,
                    parent: util_1.config.getPath('pages'),
                    isMain: true,
                    isGlob: true
                }];
        }

        this.transfromFromEntry(xcxEntry);
    }
    imagesCompile() {
        const tabBarList = util_1.Global.appTabBarList;
        const images = Array.prototype.concat.apply([], tabBarList.map(tabBarItem => {
            let map = [];
            if (tabBarItem.iconPath) {
                map.push({
                    origin: util_1.config.getPath('src', tabBarItem.iconPath),
                    target: util_1.config.getPath('dest', tabBarItem.iconPath)
                });
            }
            if (tabBarItem.selectedIconPath) {
                map.push({
                    origin: util_1.config.getPath('src', tabBarItem.selectedIconPath),
                    target: util_1.config.getPath('dest', tabBarItem.selectedIconPath)
                });
            }
            return map;
        }));
        images.forEach(image => {
            if (!fs.existsSync(image.origin)) {
                util_1.log.fatal(`找不到文件：${image.origin}`);
                return;
            }
            fs.copySync(image.origin, image.target);
        });
    }
    watchAdd(file) {
        let isProjectConfig = file === MINI_PROGRAM_CONFIG_FILE_NAME;
        if (isProjectConfig) {
            this.copyProjectConfig();
        }
        else {
            util_1.xcxNext.watchNewFile(file);
            this.next();
        }
    }
    watchChange(file) {
        let isApp = file === path.join(util_1.config.src, `app${util_1.config.ext.wxa}`);
        let isMinConfig = file === util_1.config.filename;
        let isProjectConfig = file === MINI_PROGRAM_CONFIG_FILE_NAME;
        if (isProjectConfig) {
            this.copyProjectConfig();
        }
        else if (isApp || isMinConfig) {
            this.compile();
        }
        else {
            util_1.xcxNext.watchChangeFile(file);
            this.next();
        }
    }
    watchDelete(file) {
        let isMinConfig = file === util_1.config.filename;
        let isProjectConfig = file === MINI_PROGRAM_CONFIG_FILE_NAME;
        if (isProjectConfig) {
            this.deleteProjectConfig();
        }
        else if (isMinConfig) {
            this.compile();
        }
        else {
            util_1.xcxNext.watchDeleteFile(file);
            this.next();
        }
    }
}
exports.Xcx = Xcx;
