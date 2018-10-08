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
const memFs = require("mem-fs");
const editor = require("mem-fs-editor");
const declare_1 = require("../declare");
const util_1 = require("../util");
const _1 = require(".");
const mineType = require('mime-types');

class Ui2Wx extends _1.Transformer {
    constructor(src, dest) {
        super(src, dest);
    }
    init() {
        let appSrc = path.join(this.src, 'app.ui');
        if (!fs.existsSync(appSrc)) {
            util_1.log.error('未找到app.ui文件');
            return false;
        }
        let appDest = path.join(this.dest, 'app' + util_1.config.ext.wxa);
        let app = new _1.UiFile(appSrc, appDest, true);
        util_1.log.msg(util_1.LogType.READ, 'app.ui配置');
        if (!app.config || !app.config.pages || app.config.pages.length === 0) {
            util_1.log.error('app.ui未配置pages');
            return false;
        }
        this.app = app;
        return true;
    }
    transform() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initSuccess) {
                yield this.writeApp();
                yield this.writePages();
                yield this.writeStatic();
                yield this.writePackage();
                yield this.witeComponents();
                yield this.npmInstall();
                yield this.done();
            }
        });
    }
    writeApp() {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs.existsSync(this.dest)) {
                fs.emptyDirSync(this.dest);
                util_1.log.msg(util_1.LogType.DELETE, this.dest);
            }
            this.app.writeFile('app' + util_1.config.ext.wxa);
        });
    }
    witeComponents () {
        return __awaiter(this, void 0, void 0, function* () {
            let _this = this
            fs.readdir(this.src + '/components',function (err,files) {
                if (err) return
                let pages = files;
                let pageSrc;
                let page;

                for (let i = 0; i < pages.length; i++) {
                    let item = '/components/'+ pages[i].split('.')[0] 
                    pageSrc = path.join(_this.src, item + util_1.config.ext.ui);
                    if (!fs.existsSync(pageSrc)) {
                        util_1.log.error(`未找到页面文件${pageSrc}`);
                        continue;
                    }
                    let pageDest = path.join(_this.dest, item + util_1.config.ext.wxc);
                    page = new _1.UiFile(pageSrc, pageDest);

                    page.writeFile(item + util_1.config.ext.wxc);
                }
            })
        })
    }
    writePages() {
        return __awaiter(this, void 0, void 0, function* () {
            let pages = this.app.pages;
            let pageSrc;
            let page;
            
            for (let i = 0; i < pages.length; i++) {
                pageSrc = path.join(this.src, pages[i] + util_1.config.ext.ui);
                if (!fs.existsSync(pageSrc)) {
                    util_1.log.error(`未找到页面文件${pageSrc}`);
                    continue;
                }
                let pageDest = path.join(this.dest, pages[i] + util_1.config.ext.wxp);
                page = new _1.UiFile(pageSrc, pageDest);
                page.writeFile(pages[i] + util_1.config.ext.wxp);
            }
        });
    }
    writeStatic() {
        return __awaiter(this, void 0, void 0, function* () {
      
            let fontpath = this.src + '/static/font/iconfont'
            let iconPath = path.resolve(fontpath + '.ttf')
            let data = fs.readFileSync(iconPath)

            data = new Buffer(data).toString('base64')
            
            let base64 = 'data:' + mineType.lookup(iconPath) + ';base64,' + data;

            let cssData = fs.readFileSync(fontpath + '.css', 'utf-8');

            cssData = cssData.replace(/src.[\s\S]+format\(.+/, `src: url('${base64}') format('truetype');`)

            let srcStaticPath = path.join(__dirname, `../../scaffold/project/application/static`);
            let destStaticPath = path.join(this.dest, 'static');
            fs.copy(srcStaticPath, destStaticPath,  (err) => {
                if (err) {
                    console.error(err)
                    return
                }

                fs.writeFileSync(path.resolve(destStaticPath + '/styles/icon.less'), cssData)

            });

            util_1.log.msg(util_1.LogType.WRITE, 'static目录');
        });
    }
    writePackage() {
        return __awaiter(this, void 0, void 0, function* () {
            const store = memFs.create();
            const fsEditor = editor.create(store);
            let proName = path.basename(this.dest);
            let options = {
                proName: proName,
                projectPath: this.dest,
                projectType: 'application',
                proNameToCamelCase: proName,
                title: proName,
                appId: 'touristappid',
                description: 'TouchUI-小程序',
                prefix: 'ui',
                useExample: false,
                useGlobalStyle: false,
                useGlobalLayout: false,
                dest: 'dist',
                npmScope: '',
                npmDest: 'dist/packages',
                gitUrl: '',
                author: '',
                prefixStr: '',
                npmScopeStr: '',
                projectTypeTitle: '小程序',
                options: { ProjectType: { Component: 'component', Application: 'application' } }
            };
            fsEditor.copyTpl(util_1.default.getScaffoldPath(declare_1.ScaffoldType.Project, 'common'), this.dest, options, null, {
                globOptions: {
                    dot: true
                }
            });
            return new Promise((resolve, reject) => {
                fsEditor.commit(() => {
                    util_1.log.msg(util_1.LogType.WRITE, `package.json"`);
                    resolve();
                });
            });
        });
    }
    npmInstall() {
        return __awaiter(this, void 0, void 0, function* () {
            util_1.log.newline();
            util_1.log.msg(util_1.LogType.RUN, '命令：npm install');
            util_1.log.msg(util_1.LogType.INFO, '安装中, 请耐心等待...');
            yield util_1.exec('npm', ['install'], true, {
                cwd: this.dest
            });
        });
    }
    done() {
        return __awaiter(this, void 0, void 0, function* () {
            util_1.log.msg(util_1.LogType.COMPLETE, 'TouchUI工程已转换为小程序工程');
        });
    }
}
exports.Ui2Wx = Ui2Wx;
