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
const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
const util_1 = require("../util");
const _1 = require(".");
class Wx2Ui extends _1.Transformer {
    constructor(src, dest) {
        super(src, dest);
    }
    init() {
        let appSrc = path.join(this.src, 'app.wxa');
        if (!fs.existsSync(appSrc)) {
            util_1.log.error('未找到app.wxa文件');
            return false;
        }
        let appDest = path.join(this.dest, 'app' + util_1.config.ext.ui);
        let app = new _1.WxApp(appSrc, appDest, true);
        util_1.log.msg(util_1.LogType.READ, 'app.wxa配置');
        if (!app.config || !app.config.pages || app.config.pages.length === 0) {
            util_1.log.error('app.wxa未配置pages');
            return false;
        }
        this.app = app;
        return true;
    }
    transform() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initSuccess) {
                yield this.copyScaffold();
                yield this.writeApp();
                yield this.writePages();
                yield this.done();
            }
        });
    }
    copyScaffold() {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs.existsSync(this.dest)) {
                fs.emptyDirSync(this.dest);
                util_1.log.msg(util_1.LogType.DELETE, this.dest);
            }
            let srcPath = path.join(__dirname, `../../scaffold/project/touchui`);
            let destStaticPath = this.dest;
            fs.copySync(srcPath, destStaticPath);
            util_1.log.msg(util_1.LogType.WRITE, '基础工程结构');
        });
    }
    writeApp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.writeFile('app' + util_1.config.ext.ui);
        });
    }
    writePages() {
        return __awaiter(this, void 0, void 0, function* () {
            let pages = this.getPages();
            let pageSrc;
            let page;
            for (let i = 0; i < pages.length; i++) {
                pageSrc = path.join(this.src, pages[i] + util_1.config.ext.wxp);
                if (!fs.existsSync(pageSrc)) {
                    util_1.log.error(`未找到页面文件${pageSrc}`);
                    continue;
                }
                let pageDest = path.join(this.dest, pages[i] + util_1.config.ext.ui);
                page = new _1.WxFile(pageSrc, pageDest);
                yield page.writeFile(pages[i] + util_1.config.ext.ui);
            }
        });
    }
    getPages() {
        let { config } = this.app;
        let pages = config.pages;
        let tabs = [];
        if (config.tabBar && config.tabBar.list) {
            tabs = config.tabBar.list.map((item) => item.pagePath);
        }
        return _.uniq([...pages, ...tabs]);
    }
    done() {
        return __awaiter(this, void 0, void 0, function* () {
            util_1.log.msg(util_1.LogType.COMPLETE, '小程序工程已转换为TouchUI工程');
        });
    }
}
exports.Wx2Ui = Wx2Ui;
