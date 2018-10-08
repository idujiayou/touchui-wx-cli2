"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const changeCase = require("change-case");
const class_1 = require("../class");
const util_1 = require("../util");
const RequestType_1 = require("../declare/RequestType");
const wx_parser_1 = require("../wx-parser");
const domUtils = require('htmlparser2').DomUtils;
const PID_KEY = '_pid';
class WxSFMTemplate extends class_1.WxSFM {
    constructor(source, request, options) {
        super(source, request, {
            destExt: util_1.config.ext.wxml
        });
        this.options = options;
        this.customElems = [];
        this.styleElems = [];
        this.demoElems = [];
        this.depends = [];
        this.initDom();
        this.initDepends();
    }
    generator() {
        let code = '';
        if (!this.dom)
            return code;
        this.setCustomTagPidAttr();
        this.addExampleMdDocTag();
        this.setExampleDemoSourceAttr();
        this.parseBraceStyle();
        wx_parser_1.parseWxTags(this.dom);
        code = util_1.getOuterHTML(this.dom);
        code = util_1.beautifyHtml(code);
        return code;
    }
    save() {
        if (this.request.isWxa) {
            return;
        }
        super.save();
    }
    remove() {
        super.remove();
    }
    getDepends() {
        return this.depends;
    }
    updateDepends(useRequests) {
        let depends = this.getDepends();
        if (!depends.length)
            return;
        useRequests.forEach(useRequest => {
            depends
                .filter(depend => {
                return depend.requestType === useRequest.requestType && depend.request === useRequest.request;
            })
                .forEach(depend => {
                let request = '';
                request = path.relative(path.dirname(this.dest), path.dirname(useRequest.dest));
                request = path.join(request, path.basename(useRequest.dest));
                request = request.charAt(0) !== '.' ? `./${request}` : request;
                request = request.split(path.sep).join('/');
                switch (depend.requestType) {
                    case RequestType_1.RequestType.TEMPLATE:
                    case RequestType_1.RequestType.IMAGE:
                    case RequestType_1.RequestType.WXS:
                        depend.$elem.attribs['src'] = request;
                        break;
                }
            });
        });
    }
    initDom() {
        if (!this.source)
            return;
        let { usingComponents = {} } = this.options;
        let source = this.source;
        this.dom = util_1.dom.make(source);
        this.customElems = domUtils.getElementsByTagName((name) => {
            return !!usingComponents[name];
        }, this.dom, true, []);
        this.styleElems = util_1.dom.getElementsByAttrRegex(this.dom, /^style$/);
        this.exampleElem = domUtils.getElementsByTagName('example', this.dom, true, [])[0] || null;
        if (!this.exampleElem)
            return;
        this.demoElems = domUtils.getElementsByTagName((name) => {
            return /^demo-/.test(name);
        }, this.exampleElem, true, []);
    }
    initDepends() {
        if (!this.dom) {
            return;
        }
        let importElems = domUtils.getElementsByTagName('import', this.dom, true, []);
        let imageElems = domUtils.getElementsByTagName('image', this.dom, true, []);
        let wxsElems = domUtils.getElementsByTagName('wxs', this.dom, true, []);
        importElems.forEach((elem) => {
            let { src } = elem.attribs;
            if (!src) {
                return;
            }
            this.depends.push({
                request: src,
                requestType: RequestType_1.RequestType.TEMPLATE,
                $elem: elem
            });
        });
        imageElems.forEach((elem) => {
            let { src } = elem.attribs;
            if (!src) {
                return;
            }
            if (!util_1.default.checkLocalImgUrl(src)) {
                return;
            }
            if (/\{\{/.test(src)) {
                return;
            }
            this.depends.push({
                request: src,
                requestType: RequestType_1.RequestType.IMAGE,
                $elem: elem
            });
        });
        wxsElems.forEach((elem) => {
            let { src } = elem.attribs;
            if (!src) {
                return;
            }
            this.depends.push({
                request: src,
                requestType: RequestType_1.RequestType.WXS,
                $elem: elem
            });
        });
    }
    setCustomTagPidAttr() {
        this.customElems.forEach((elem) => {
            elem.attribs = elem.attribs || {};
            elem.attribs[PID_KEY] = `{{${PID_KEY}}}`;
        });
    }
    addExampleMdDocTag() {
        if (!this.exampleElem)
            return;
        domUtils.appendChild(this.exampleElem, {
            type: 'tag',
            name: 'example-md',
            attribs: {
                content: '{{__code__.readme}}',
                [PID_KEY]: `{{${PID_KEY}}}`
            }
        }, null);
    }
    setExampleDemoSourceAttr() {
        if (!this.exampleElem)
            return;
        this.demoElems.forEach((elem) => {
            let { parent } = elem;
            if (parent.name === 'example-demo' && !parent.attribs['source']) {
                let pcName = changeCase.camelCase(elem.name);
                parent.attribs['source'] = `{{__code__.${pcName}}}`;
            }
        });
    }
    parseBraceStyle() {
        this.styleElems.forEach((elem) => {
            util_1.style.uiStyle2wxStyle(elem);
        });
    }
}
exports.WxSFMTemplate = WxSFMTemplate;
