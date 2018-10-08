"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const path = require("path");
const declare_1 = require("../declare");
const util_1 = require("../util");
class XcxTraverse {
    constructor(options) {
        this.options = options;
        this.pages = [];
        this.components = [];
    }
    static traverse(parent, options) {
        let xcxTraverse = new XcxTraverse(options);
        xcxTraverse.traverse(parent);
    }
    traverse(parent) {
        if (_.isArray(parent) && parent.length === 0) {
            return;
        }
        this.trigger('start', undefined);
        this.recursive(parent);
        if (this.pages.length > 0) {
            this.trigger('pages', this.pages);
        }
        if (this.components.length > 0) {
            this.trigger('components', this.components);
        }
        this.trigger('end', undefined);
    }
    pageReplacer(destRelative) {
        let regExp = new RegExp(`(^${util_1.config.dest}\\\\)|(^${util_1.config.dest}/)|(${util_1.config.ext.wxp}$)`, 'g');
        return destRelative.replace(regExp, '').split(path.sep).join('/');
    }
    componentReplacer(destRelative) {
        let regExp = new RegExp(`(^${util_1.config.dest}\\\\)|(^${util_1.config.dest}/)|(${util_1.config.ext.wxc}$)`, 'g');
        return destRelative.replace(regExp, '').split(path.sep).join('/');
    }
    recursive(parent) {
        if (_.isArray(parent)) {
            parent.forEach(this.resolve.bind(this));
        }
        else if (parent) {
            this.resolve(parent);
        }
    }
    resolve(xcxNode) {
        this.trigger('enter', xcxNode);
        let { request } = xcxNode;
        switch (request.requestType) {
            case declare_1.RequestType.WXA:
                this.trigger('app', xcxNode);
                break;
            case declare_1.RequestType.WXP:
                this.pages = _.union(this.pages, [
                    this.pageReplacer(request.destRelative)
                ]);
                this.trigger('page', xcxNode);
                break;
            case declare_1.RequestType.WXC:
                this.components = _.union(this.components, [
                    this.componentReplacer(request.destRelative)
                ]);
                this.trigger('component', xcxNode);
                break;
            default:
                break;
        }
        this.recursive(xcxNode.children);
        this.trigger('exit', xcxNode);
    }
    trigger(method, value) {
        let _method = this.options[method];
        if (_.isFunction(_method)) {
            _method.call(this.options, value);
        }
    }
}
exports.XcxTraverse = XcxTraverse;
