"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_1 = require("../class");
const util_1 = require("../util");
class XcxNode {
    constructor(request, root) {
        this.children = [];
        this.useRequests = [];
        this.lackRequests = [];
        if (root) {
            root.children.push(this);
        }
        this.request = request;
        this.wxFile = new class_1.WxFile(this.request);
        this.cached();
        this.recursive();
        this.lack();
    }
    static create(options) {
        let { isMain, isForce, root } = options;
        if (isMain && root) {
            util_1.log.debug(`XcxNode.create 不能同时设定'option.parent' 和 'root'`);
        }
        let request = new class_1.Request(options);
        if (!request.src) {
            if (isMain) {
                util_1.log.error(`找不到入口：${request.request}`);
            }
            return null;
        }
        let xcxNode = util_1.xcxNodeCache.get(request.src);
        if (isForce || !xcxNode) {
            xcxNode = new XcxNode(request, root);
        }
        return xcxNode;
    }
    compile() {
        this.wxFile.updateDepends(this.useRequests);
        this.wxFile.save();
    }
    cached() {
        util_1.xcxNodeCache.set(this.request.src, this);
    }
    recursive() {
        let depends = this.wxFile.getDepends();
        for (let i = 0; i < depends.length; i++) {
            let { request, requestType } = depends[i];
            let xcxNode = XcxNode.create({
                request,
                requestType,
                parent: this.request.src,
                isMain: false,
                root: this,
                isThreeNpm: this.request.isThreeNpm
            });
            if (xcxNode) {
                this.useRequests.push({
                    request,
                    requestType,
                    src: xcxNode.request.src,
                    srcRelative: xcxNode.request.srcRelative,
                    ext: xcxNode.request.ext,
                    dest: xcxNode.request.dest,
                    destRelative: xcxNode.request.destRelative,
                    isThreeNpm: xcxNode.request.isThreeNpm
                });
            }
            else {
                this.lackRequests.push({
                    request,
                    requestType
                });
            }
        }
    }
    lack() {
        if (this.lackRequests.length > 0) {
            util_1.xcxNext.addLack(this.request.srcRelative);
            this.lackRequests.forEach(lackRequest => {
                util_1.log.error(`找不到模块：${lackRequest.request} in ${this.request.srcRelative}`);
            });
        }
        else {
            util_1.xcxNext.removeLack(this.request.srcRelative);
        }
    }
}
exports.XcxNode = XcxNode;
