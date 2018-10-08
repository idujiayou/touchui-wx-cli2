"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
const util_1 = require("../util");
function src2relative(src) {
    if (!path.isAbsolute(src)) {
        return src;
    }
    return path.relative(util_1.config.cwd, src);
}
function path2request(src) {
    return src.split(path.sep).join('/');
}
function bindChangeRequestPath(target, methods) {
    methods.forEach(method => {
        let fn = target[method];
        if (!_.isFunction(fn))
            return;
        target[method] = (src, ...args) => {
            src = src2relative(src);
            src = path2request(src);
            args.unshift(src);
            return fn.apply(target, args);
        };
    });
}
function getMdRootWxpRequestPath(request) {
    let srcRelative = path.normalize(request);
    let extName = path.extname(srcRelative);
    let baseName = path.basename(srcRelative);
    let dirName = path.dirname(srcRelative);
    let packageRegExp = new RegExp(`^${util_1.config.packages}\\${path.sep}${util_1.config.prefixStr}([a-z-]+)$`);
    let mdRootWxpPath = '';
    if ((extName === util_1.config.ext.wxc && new RegExp(`\\${path.sep}demos$`).test(dirName)) ||
        (extName === '.md' && new RegExp(`\\${path.sep}docs$`).test(dirName))) {
        mdRootWxpPath = path.join(util_1.config.cwd, dirName, '..', `index${util_1.config.ext.wxp}`);
    }
    else if ((baseName.toLowerCase() === 'readme.md' && packageRegExp.test(dirName))) {
        let matchs = dirName.match(packageRegExp);
        let pageName = matchs && matchs.length > 1 ? matchs[1] : '';
        mdRootWxpPath = util_1.config.getPath('pages', pageName, `index${util_1.config.ext.wxp}`);
    }
    if (mdRootWxpPath && fs.existsSync(mdRootWxpPath)) {
        mdRootWxpPath = src2relative(mdRootWxpPath);
        mdRootWxpPath = path2request(mdRootWxpPath);
        return mdRootWxpPath;
    }
    return '';
}
exports.xcxNodeCache = {
    cached: {},
    set(request, xcxNode) {
        this.cached[request] = xcxNode;
    },
    get(request) {
        return this.cached[request] || null;
    },
    getBeDepends(request) {
        let beDepends = [];
        let srcRelative = path.normalize(request);
        _.forIn(this.cached, (xcxNode, cacheKey) => {
            let isExsit = xcxNode.useRequests.some(useRequest => useRequest.srcRelative === srcRelative);
            if (isExsit) {
                beDepends.push(cacheKey);
            }
        });
        return beDepends;
    },
    remove(request) {
        if (this.check(request)) {
            delete this.cached[request];
        }
    },
    check(request) {
        return this.get(request) !== null;
    },
    clear() {
        this.cached = {};
    }
};
bindChangeRequestPath(exports.xcxNodeCache, ['set', 'get', 'getBeDepends', 'remove', 'check']);
exports.xcxNext = {
    lack: {},
    buffer: {},
    addLack(request) {
        this.lack[request] = true;
    },
    removeLack(request) {
        if (!this.checkLack(request)) {
            return;
        }
        delete this.lack[request];
    },
    checkLack(request) {
        return !!this.lack[request];
    },
    watchNewFile(request) {
        if (path.extname(request) === util_1.config.ext.wxp) {
            this.buffer[request] = true;
        }
    },
    watchChangeFile(request) {
        if (exports.xcxNodeCache.check(request)) {
            this.buffer[request] = true;
        }
        let mdRootWxpPath = getMdRootWxpRequestPath(request);
        if (mdRootWxpPath) {
            this.buffer[mdRootWxpPath] = true;
        }
    },
    watchDeleteFile(request) {
        if (exports.xcxNodeCache.check(request)) {
            exports.xcxNodeCache.remove(request);
            let beDepends = exports.xcxNodeCache.getBeDepends(request);
            beDepends.forEach(request => this.buffer[request] = true);
        }
        let mdRootWxpPath = getMdRootWxpRequestPath(request);
        if (mdRootWxpPath) {
            this.buffer[mdRootWxpPath] = true;
        }
    },
    reset() {
        this.buffer = {};
    },
    clear() {
        this.lack = {};
        this.buffer = {};
    },
    get() {
        let next = Object.assign({}, this.lack, this.buffer);
        return _.keys(next);
    }
};
bindChangeRequestPath(exports.xcxNext, ['addLack', 'removeLack', 'checkLack', 'watchNewFile', 'watchChangeFile', 'watchDeleteFile']);
