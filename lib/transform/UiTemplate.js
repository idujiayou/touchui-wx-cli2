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
const domUtils = require('htmlparser2').DomUtils;
const attrs_1 = require("./attrs");
const renameTags = ['ui-page', 'ui-view', 'ui-scroll-view', 'ui-swiper', 'ui-swiper-item', 'ui-image', 'ui-text', 'ui-rich-text', 'ui-progress', 'ui-button', 'ui-checkbox-group', 'ui-checkbox', 'ui-form', 'ui-input', 'ui-label', 'ui-picker', 'ui-picker-view', 'ui-radio-group', 'ui-radio', 'ui-switch', 'ui-textarea', 'ui-navigator', 'ui-audio', 'ui-image', 'ui-video', 'ui-map'];
const attrToStyleTags = ['ui-scroll-view', 'ui-image'];
const adjustmentTags = ['ui-input', 'ui-text', 'ui-rich-text', 'ui-progress', 'ui-checkbox', 'ui-picker', 'ui-radio', 'ui-switch'];
const wxForAssists = ['wx:for-item', 'wx:for-index', 'wx:key'];
class UiTemplate {
    constructor(source, isApp) {
        this.source = source;
        this.isApp = isApp;
        this.initDom();
    }
    initDom() {
        if (!this.source)
            return;
        this.dom = util_1.dom.make(this.source);
        this.directiveElems = util_1.dom.getElementsByAttrRegex(this.dom, /^ui:/);
        this.attrToStyleElems = domUtils.getElementsByTagName((name) => {
            return attrToStyleTags.indexOf(name) > -1;
        }, this.dom, true, []);
        this.bindEventsElems = util_1.dom.getElementsByAttrRegex(this.dom, /^bind/, /^\w+\((.*)\)/);
        this.styleElems = util_1.dom.getElementsByAttrRegex(this.dom, /^style$/);
        this.customStyleElems = util_1.dom.getElementsByAttrRegex(this.dom, /-style/);
        this.wechatIconElems = util_1.dom.getElementsByAttrRegex(this.dom, /^mode$/, /^wechat$/);
        this.adjustmentElems = util_1.dom.getElementsByTagName(this.dom, adjustmentTags);
        this.renameElems = util_1.dom.getElementsByTagName(this.dom, renameTags);
    }
    generator() {
        return __awaiter(this, void 0, void 0, function* () {
            let code = '';
            if (!this.dom)
                return code;
            if (this.isApp) {
                return util_1.WxAppTemplate;
            }
            this.transformUiDirective();
            this.transformAttrToStyle();
            this.transformEventArgs();
            this.transformBraceStyle();
            this.transformIcons();
            this.adjustAttrs();
            this.transformUiTag2WxTag();
            code = util_1.getOuterHTML(this.dom);
            code = this.compileSync(code)
            return code;
        });
    }
    // 双向绑定实现
    compileSync (source) {
    let syncArr = source.match(/<[^>]*(\.sync)+[^>]*>/g)

    if (syncArr) {
        syncArr.forEach(item => {
            let arr = item.split( ' ' ),
                tag = '',
                tags = [],
                syncMap = [],
                end
            
            arr.forEach((val, index) => {
                if (index === arr.length - 1) {
                    let endArr = val.match(/(\/|>)/g)
                    end = endArr ? endArr.join('') : '>'
                    val = val.replace(/(\/|>)/g, '')
                }

                if (val.indexOf('.sync') !== -1) {
                    let valKeyArr = val.split('='),
                        key = valKeyArr[0].split('.')[0].trim(),
                        valMatch = valKeyArr[1].match(/(\d|\w)+/g),
                        val2 = (valMatch ? valMatch[0] : '').trim()
                        tags.push(`${key}="{{${val2}}}"`)
                        syncMap.push(`${key}=${val2}`)
                } else {
                    tags.push(val)
                }
            })
            tags.push(`sync-attr-map="${syncMap.join('&')}"`)
            tags.push('bindsyncattrupdate="onSyncAttrUpdate"')
            tags.push(end)
            tag = tags.join(' ')
            source = source.replace(item, tag)
        })
    }
    
  return source
}
    transformUiDirective() {
        this.directiveElems.forEach((elem) => {
            Object.keys(elem.attribs).forEach((key) => {
                let value = elem.attribs[key];
                let newKey;
                let change = true;
                if (key === 'ui:model') {
                    if (['ui-popup', 'ui-mask'].indexOf(elem.name) > -1) {
                        newKey = 'show';
                    }
                    else if (elem.name === 'ui-input') {
                        newKey = 'value';
                    }
                    else if (elem.name === 'ui-switch') {
                        newKey = 'checked';
                    }
                    value = util_1.default.getMustcacheValue(value);
                }
                else if (key === 'ui:show') {
                    newKey = 'hidden';
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
                        if (value[0].startsWith('!')) {
                            value = `{{ ${value.substring(1)} }}`;
                        }
                        else {
                            value = `{{ !${value} }}`;
                        }
                    }
                }
                else if (/^ui:/.test(key)) {
                    newKey = key.replace('ui:', 'wx:');
                    if (wxForAssists.indexOf(newKey) < 0) {
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
    transformAttrToStyle() {
        this.attrToStyleElems.forEach((elem) => {
            let attribs = elem.attribs;
            if (!attribs.style) {
                attribs.style = '';
            }
            if (attribs.width) {
                attribs.style += `width: ${attribs.width}px;`;
                delete attribs.width;
            }
            if (attribs.height) {
                attribs.style += `height: ${attribs.height}px;`;
                delete attribs.height;
            }
            if (attribs.style === '') {
                delete attribs.style;
            }
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
            elem.name = 'icon';
            delete elem.attribs.mode;
        });
    }
    adjustAttrs() {
        this.adjustmentElems.forEach((elem) => {
            if (elem.name === 'ui-input' && elem.attribs.type === 'password') {
                elem.attribs.password = '';
                delete elem.attribs.type;
                return;
            }
            let attrs = attrs_1.ignoredAttrs.ui2wx[elem.name];
            _.keys(elem.attribs).forEach((attr) => {
                if (attrs.indexOf(attr) > -1) {
                    delete elem.attribs[attr];
                }
            });
        });
    }
    transformUiTag2WxTag() {
        this.renameElems.forEach((elem) => {
            if (elem.name === 'ui-page') {
                elem.name = 'view';
            }
            else {
                elem.name = elem.name.replace('ui-', '');
            }
        });
    }
}
exports.UiTemplate = UiTemplate;
