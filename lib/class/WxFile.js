"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_1 = require("../class");
const util_1 = require("../util");
class WxFile {
    constructor(request) {
        let { ext, src, isSFC, isNFC, isStatic } = request;
        if (isSFC) {
            util_1.log.msg(util_1.log.type.BUILD, request.srcRelative);
            this.core = new class_1.WxSFC(util_1.default.readFile(src), request);
        }
        else if (isNFC) {
            util_1.log.msg(util_1.log.type.BUILD, request.srcRelative);
            this.core = new class_1.WxNFC(util_1.default.readFile(src), request);
        }
        else if (isStatic) {
            this.core = new class_1.CompileStatic(request);
        }
        else {
            throw new Error(`创建【WxFile】失败，没有找到扩展名为 ${ext} 的编译类型`);
        }
    }
    save() {
        this.core.save();
    }
    remove() {
        this.core.remove();
    }
    getDepends() {
        return this.core.getDepends();
    }
    updateDepends(useRequests) {
        this.core.updateDepends(useRequests);
    }
}
exports.WxFile = WxFile;
