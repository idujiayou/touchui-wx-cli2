"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const util_1 = require("../util");
const attrs_1 = require("./attrs");
const renameTags = ['view', 'scroll-view', 'swiper', 'swiper-item', 'image', 'text', 'rich-text', 'progress', 'button', 'checkbox-group', 'checkbox', 'form', 'input', 'label', 'picker', 'picker-view', 'radio-group', 'radio', 'switch', 'textarea', 'navigator', 'audio', 'image', 'video', 'map'];
const twoWayBindingConfigs = {
    'input': { wxAttrName: 'value' },
    'textarea': { wxAttrName: 'textarea' },
    'switch': { wxAttrName: 'checked', uiAttrName: 'value' },
    'ui-popup': { wxAttrName: 'show', uiAttrName: 'value' },
    'ui-mask': { wxAttrName: 'show', uiAttrName: 'value' }
};
const adjustmentTags = ['progress', 'button', 'form', 'input', 'textarea', 'navigator'];
const uiForAssits = ['ui:for-item', 'ui:for-index', 'ui:key'];
class WxTemplate {
    constructor(source, isApp) {
        this.source = source;
        this.isApp = isApp;
        this.initDom();
    }
    initDom() {
        if (!this.source)
            return;
        this.dom = util_1.dom.make(this.source);
        this.directiveElems = util_1.dom.getElementsByAttrRegex(this.dom, /(^wx:|hidden)/);
        this.bindEventsElems = util_1.dom.getElementsByAttrRegex(this.dom, /^bind/, /^\w+\((.*)\)/);
        this.styleElems = util_1.dom.getElementsByAttrRegex(this.dom, /^style$/);
        this.customStyleElems = util_1.dom.getElementsByAttrRegex(this.dom, /-style/);
        this.wechatIconElems = util_1.dom.getElementsByTagName(this.dom, 'icon');
        this.twoWayBindingElems = util_1.dom.getElementsByTagName(this.dom, Object.keys(twoWayBindingConfigs));
        this.adjustmentElems = util_1.dom.getElementsByTagName(this.dom, adjustmentTags);
        this.renameElems = util_1.dom.getElementsByTagName(this.dom, renameTags);
       
    }
    generator() {
        return __awaiter(this, void 0, void 0, function* () {
            let code = '';
            if (!this.dom)
                return code;
            this.transformWxDirective();
            this.transformIcons();
            this.transformTwoWayBinding();
            this.adjustAttrs();
            this.transformWxTag2UiTag();
            this.handleRootElement();
            code = util_1.getOuterHTML(this.dom);
            return code;
        });
    }
    transformWxDirective() {
        this.directiveElems.forEach((elem) => {
            Object.keys(elem.attribs).forEach((key) => {
                let value = elem.attribs[key];
                let newKey;
                let change = true;
                if (key === 'hidden') {
                    newKey = 'ui:show';
                    let match = value.match(/\{\{\s*(.*)\s*\}\}/);
                    if (match) {
                        if (match[1].startsWith('!')) {
                            value = `{{ ${match[1].substring(1)} }}`;
                        }
                        else {
                            value = /(\|\||&&|>=?|<=?|===?)/.test(match[1]) ? `{{ !(${match[1]}) }}` : `{{ !${match[1]} }}`;
                        }
                    }
                    else {
                        if (value === '') {
                            value = '{{ false }}';
                        }
                        else {
                            if (value[0].startsWith('!')) {
                                value = `{{ ${value.substring(1)} }}`;
                            }
                            else {
                                value = `{{ !${value} }}`;
                            }
                        }
                    }
                }
                else if (/^wx:/.test(key)) {
                    newKey = key.replace('wx:', 'ui:');
                    if (uiForAssits.indexOf(newKey) < 0) {
                        value = util_1.default.getMustcacheValue(value);
                    }
                }
                else {
                    change = false;
                }
                if (newKey && change) {
                    elem.attribs[newKey] = value;
                    delete elem.attribs[key];
                }
            });
        });
    }
    transformEventArgs() {
        this.bindEventsElems.forEach((elem) => {
            _.keys(elem.attribs).forEach((key) => {
                if (/^bind/.test(key)) {
                    let matches = elem.attribs[key].match(/^(\w+)\((.*)\)/);
                    if (matches && matches[2]) {
                        let args = matches[2].split(',').map((arg) => _.trim(arg));
                        args.forEach((arg, index) => {
                            elem.attribs['data-arg' + index] = `{{ ${args[index]} }}`;
                        });
                        elem.attribs[key] = matches[1];
                    }
                }
            });
        });
    }
    transformBraceStyle() {
        this.styleElems.forEach((elem) => {
            util_1.style.uiStyle2wxStyle(elem);
        });
        this.customStyleElems.forEach((elem) => {
            util_1.style.reviseBrace(elem);
        });
    }
    transformIcons() {
        this.wechatIconElems.forEach((elem) => {
            elem.name = 'ui-icon';
            elem.attribs.mode = 'wechat';
        });
    }
    transformTwoWayBinding() {
        this.twoWayBindingElems.forEach((elem) => {
            let wxAttrName = twoWayBindingConfigs[elem.name].wxAttrName;
            let uiAttrName = twoWayBindingConfigs[elem.name].uiAttrName;
            if (/\{\{/.test(elem.attribs[wxAttrName])) {
                elem.attribs['ui:model'] = elem.attribs[wxAttrName];
                delete elem.attribs[wxAttrName];
            }
            else if (uiAttrName) {
                let value = elem.attribs[wxAttrName];
                elem.attribs[uiAttrName] = value === '' ? '{{ true }}' : value;
                delete elem.attribs[wxAttrName];
            }
        });
    }
    adjustAttrs() {
        this.adjustmentElems.forEach((elem) => {
            if (elem.name === 'input' && elem.attribs.password === '') {
                elem.attribs.type = 'password';
                delete elem.attribs.password;
            }
            let attrs = attrs_1.ignoredAttrs.wx2ui[elem.name];
            _.keys(elem.attribs).forEach((attr) => {
                if (attrs.indexOf(attr) > -1) {
                    delete elem.attribs[attr];
                }
            });
        });
    }
    transformWxTag2UiTag() {
        this.renameElems.forEach((elem) => {
            elem.name = `ui-${elem.name}`;
        });
    }
    handleRootElement() {
        if (util_1.dom.isOneRootDom(this.dom)) {
            for (let elem of this.dom) {
                if (elem.type === 'tag') {
                    elem.name = 'ui-page';
                    break;
                }
            }
        }
        else {
            this.dom = [{
                    type: 'tag',
                    name: 'ui-page',
                    children: this.dom
                }];
        }
    }
}
exports.WxTemplate = WxTemplate;
