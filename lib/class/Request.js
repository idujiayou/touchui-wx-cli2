"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const changeCase = require("change-case");
const util_1 = require("../util");
class RequestCore {
    constructor(options) {
        _.merge(this, util_1.resolveDep(options));
    }
}
exports.RequestCore = RequestCore;
class RequestExtend extends RequestCore {
    get isSFC() {
        return this.isWxa || this.isWxp || this.isWxc;
    }
    get isNFC() {
        return this.isTemplate || this.isScript || this.isStyle;
    }
    get isTemplate() {
        return this.isWxml;
    }
    get isScript() {
        return this.isJs || this.isTs || this.isCs || this.isWxs;
    }
    get isStyle() {
        return this.isCss || this.isWxss || this.isLess || this.isPcss || this.isSass || this.isStylus;
    }
    get isStatic() {
        return this.isJson || this.isImage || this.isIconFont;
    }
    get isIconFont() {
        return this.isEot || this.isSvg || this.isTtf || this.isWoff;
    }
    get isImage() {
        return this.isPng || this.isJpeg || this.isGif || this.isBmp || this.isWebp;
    }
    constructor(options) {
        super(options);
        let key = _.findKey(util_1.config.ext, value => value === this.ext);
        if (key) {
            this[`is${changeCase.pascalCase(key)}`] = true;
        }
    }
}
exports.RequestExtend = RequestExtend;
class Request extends RequestExtend {
    constructor(options) {
        super(options);
    }
}
exports.Request = Request;
