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
const _ = require("lodash");
const util_1 = require("../util");
const _1 = require(".");
class WxApp extends _1.WxFile {
    constructor(src, dest, isApp) {
        super(src, dest, isApp);
        this.src = src;
        this.dest = dest;
        this.isApp = isApp;
    }
    writeFile(relativePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const configProps = ['pages', 'window', 'tabBar', 'theme', 'networkTimeout'];
                const uiAppSource = util_1.default.readFile(this.dest);
                let { script: { code: scriptCode }, template: { code: templateCode }, style: { code: styleCode } } = util_1.dom.getSFC(uiAppSource);
                let uiNode = util_1.scriptAstUtil.transform(scriptCode);
                let wxNode = this.script.node;
                let uiConfig = util_1.scriptAstUtil.getNodeFromRootByPath(uiNode, 'config');
                let wxConfig = util_1.scriptAstUtil.getNodeFromRootByPath(wxNode, 'config');
                let uiData = util_1.scriptAstUtil.getNodeFromRootByPath(uiNode, 'data');
                let wxGlobalData = util_1.scriptAstUtil.getNodeFromRootByPath(wxNode, 'globalData');
                let uiMounted = util_1.scriptAstUtil.getNodeFromRootByPath(uiNode, 'mounted');
                let wxOnReady = util_1.scriptAstUtil.getNodeFromRootByPath(wxNode, 'onReady');
                uiConfig.value.properties = _.filter(wxConfig.value.properties, (prop) => {
                    return configProps.indexOf(prop.key.name) > -1;
                });
                if (wxGlobalData) {
                    let uiDataProps = uiData.body.body[0].argument.properties;
                    for (let i = 0; i < uiDataProps.length; i++) {
                        if (uiDataProps[i].key.name === 'globalData') {
                            uiDataProps[i] = wxGlobalData;
                            break;
                        }
                    }
                }
                if (wxOnReady) {
                    uiMounted.body = wxOnReady.body;
                }
                let newScriptCode = util_1.scriptAstUtil.transformFromAst(uiNode, (code) => {
                    return code.replace(/getApp\(\)/g, 'ui.getApp()');
                });
                let code = util_1.dom.combineCode(templateCode, newScriptCode, styleCode);
                util_1.default.writeFile(this.dest, code);
                util_1.log.msg(util_1.LogType.WRITE, `${relativePath}`);
                this.copyImages(relativePath);
            }
            catch (err) {
                util_1.log.error(`写入${relativePath}失败，${err}`);
            }
        });
    }
}
exports.WxApp = WxApp;
