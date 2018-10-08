"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_1 = require("../class");
const util_1 = require("../util");
class WxSFC {
    constructor(source, request) {
        this.source = source;
        let { script: { code: scriptCode, compileType: scriptCompileType }, template: { code: templateCode, compileType: templateCompileType }, style: { code: styleCode, compileType: styleCompileType } } = util_1.dom.getSFC(this.source);
        this.script = new class_1.WxSFMScript(scriptCode, request, {
            compileType: scriptCompileType,
            templateCode: templateCode
        });
        let usingComponents = this.script.getUsingComponents();

        this.template = new class_1.WxSFMTemplate(templateCode, request, {
            compileType: templateCompileType,
            usingComponents
        });
        this.style = new class_1.WxSFMStyle(styleCode, request, {
            compileType: styleCompileType
        });
    }
    get sfms() {
        return [this.template, this.style, this.script];
    }
    save() {
        this.sfms.forEach(sfm => sfm.save());
        if (this.sfms.length > 0) {
            this.sfms[0].saveStatic();
        }
    }
    remove() {
        this.sfms.forEach(sfm => sfm.remove());
    }
    getDepends() {
        return Array.prototype.concat.apply([], this.sfms.map(sfm => sfm.getDepends()));
    }
    updateDepends(useRequests) {
        this.sfms.forEach(sfm => sfm.updateDepends(useRequests));
    }
}
exports.WxSFC = WxSFC;
