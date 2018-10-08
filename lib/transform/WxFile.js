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
const _1 = require(".");
const util_1 = require("../util");
class WxFile {
    constructor(src, dest, isApp) {
        this.src = src;
        this.dest = dest;
        this.isApp = isApp;
        this.source = util_1.default.readFile(src);
        let { script: { code: scriptCode }, template: { code: templateCode }, style: { code: styleCode } } = util_1.dom.getSFC(this.source);
        this.template = new _1.WxTemplate(templateCode, isApp);
        this.script = new _1.WxScript(scriptCode, isApp);
        this.style = new _1.WxStyle(styleCode, isApp);
    }
    get config() {
        return this.script.config;
    }
    writeFile(relativePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let templateCode = yield this.template.generator();
                let scriptCode = yield this.script.generator();
                let styleCode = yield this.style.generator();
                let code = util_1.dom.combineCode(templateCode, scriptCode, styleCode);
                util_1.default.writeFile(this.dest, code);
                util_1.log.msg(util_1.LogType.WRITE, `${relativePath}`);
                this.copyImages(relativePath);
            }
            catch (err) {
                util_1.log.error(`写入${relativePath}失败，${err}`);
            }
        });
    }
    copyImages(relativePath) {
        const srcDir = path.join(path.dirname(this.src), 'images');
        const destDir = path.join(path.dirname(this.dest), 'images');
        try {
            if (fs.existsSync(srcDir) && (this.isApp || !fs.existsSync(destDir))) {
                const relativeDir = path.join(path.dirname(relativePath), 'images');
                fs.copySync(srcDir, destDir);
                util_1.log.msg(util_1.LogType.COPY, `${relativeDir}目录`);
            }
        }
        catch (e) {
            util_1.log.error(`拷贝${srcDir}失败，${e}`);
        }
    }
}
exports.WxFile = WxFile;
