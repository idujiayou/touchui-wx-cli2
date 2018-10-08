"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_1 = require("../class");
const declare_1 = require("../declare");
class WxNFC {
    constructor(source, request) {
        this.source = source;
        this.request = request;
        let { isScript, isStyle, isTemplate } = request;
        let { compileType = undefined } = declare_1.LangTypes[request.ext] || {};
        if (isScript) {
            this.sfm = new class_1.WxSFMScript(this.source, request, {
                compileType
            });
        }
        else if (isStyle) {
            this.sfm = new class_1.WxSFMStyle(this.source, request, {
                compileType
            });
        }
        else if (isTemplate) {
            this.sfm = new class_1.WxSFMTemplate(this.source, request, {
                compileType
            });
        }
        else {
            throw new Error(`创建【WxNFC】失败，没有找到扩展名为 ${request.ext} 的编译类型`);
        }
    }
    save() {
        this.sfm.save();
    }
    remove() {
        this.sfm.remove();
    }
    getDepends() {
        return this.sfm.getDepends();
    }
    updateDepends(useRequests) {
        this.sfm.updateDepends(useRequests);
    }
}
exports.WxNFC = WxNFC;
