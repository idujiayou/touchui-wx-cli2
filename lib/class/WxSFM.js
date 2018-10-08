"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const _ = require("lodash");
const fs = require("fs-extra");
const util_1 = require("../util");
class WxSFM {
    constructor(source, request, options) {
        this.request = request;
        this.source = (source || '').trim();
        this.destExt = options.destExt;
        this.initDest();
    }
    get isWxa() {
        return this.request.isWxa;
    }
    get isWxp() {
        return this.request.isWxp;
    }
    get isWxc() {
        return this.request.isWxc;
    }
    get isSFC() {
        return this.request.isSFC;
    }
    getDester(ext) {
        let ppath = path.parse(this.request.dest);
        ppath.base = ppath.name + ext;
        ppath.ext = ext;
        let dest = path.format(ppath);
        let destRelative = path.relative(util_1.config.cwd, dest);
        return {
            dest,
            destRelative
        };
    }
    generator() {
        util_1.log.fatal('WxSFM.generator Method not implemented.');
        return '';
    }
    beforeSave() {
    }
    save() {
        this.beforeSave();
        let code = this.generator();
        if (_.isString(code)) {
            this.write(code);
        }
        else {
            code.then(this.write.bind(this));
        }
        this.afterSave();
    }
    afterSave() {
    }
    beforeRemove() {
    }
    saveStatic() {
        let srcImages = path.join(path.dirname(this.request.src), 'images');
        let destImages = path.join(path.dirname(this.dest), 'images');
        if (fs.existsSync(srcImages)) {
            fs.copySync(srcImages, destImages);
        }
    }
    remove() {
        this.beforeRemove();
        util_1.log.msg(util_1.LogType.DELETE, this.destRelative);
        util_1.default.unlink(this.dest);
        this.afterRemove();
    }
    afterRemove() {
    }
    getDepends() {
        util_1.log.fatal('WxSFM.getDepends Method not implemented.');
        return [];
    }
    updateDepends(uses) {
        util_1.log.fatal('WxSFM.updateRequest Method not implemented.');
    }
    initDest() {
        let dester = this.getDester(this.destExt);
        this.dest = dester.dest;
        this.destRelative = dester.destRelative;
    }
    write(code) {
        util_1.log.msg(util_1.LogType.WRITE, this.destRelative);
        util_1.default.writeFile(this.dest, code);
    }
}
exports.WxSFM = WxSFM;
