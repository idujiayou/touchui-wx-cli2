"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const util_1 = require("../util");
const _1 = require(".");
class Transformer {
    constructor(src, dest) {
        if (this instanceof _1.Ui2Wx) {
            this.srcType = 'ui';
            this.destType = 'wx';
        }
        else if (this instanceof _1.Wx2Ui) {
            this.srcType = 'wx';
            this.destType = 'ui';
        }
        this.src = src || util_1.config.cwd;
        this.dest = dest || path.join(util_1.config.cwd, path.basename(util_1.config.cwd) + `-${this.destType}`);
        this.initSuccess = this.init();
    }
}
exports.Transformer = Transformer;
