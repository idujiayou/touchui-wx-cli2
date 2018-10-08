"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
class CompileStatic {
    constructor(request) {
        this.request = request;
    }
    save() {
        if (this.request.isJson) {
            let content = util_1.default.readFile(this.request.src);
            util_1.default.writeFile(this.request.dest + util_1.config.ext.js, `module.exports = ${content}`);
        }
        else {
            util_1.default.copyFile(this.request.src, this.request.dest);
        }
    }
    remove() {
        util_1.log.msg(util_1.LogType.DELETE, this.request.destRelative);
        util_1.default.unlink(this.request.dest);
    }
    getDepends() {
        return [];
    }
    updateDepends(useRequests) {
    }
}
exports.CompileStatic = CompileStatic;
