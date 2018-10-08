"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const declare_1 = require("../declare");
const util_1 = require("../util");
const htmlparser = require('htmlparser2');
const domUtils = htmlparser.DomUtils;
function make(source) {
    let handler = new htmlparser.DomHandler();
    let parser = new htmlparser.Parser(handler, {
        lowerCaseAttributeNames: false
    });
    parser.write(source);
    parser.done();
    return handler.dom;
}
function getSFM(parentElem, module) {
    let elem = domUtils.getElementsByTagName(module, parentElem, true, [])[0];
    let code = '';
    let lang = '';
    let compileType;
    if (elem) {
        code = util_1.getInnerHTML(elem);
        lang = elem.attribs.lang;
        let langType = declare_1.LangTypes[`.${lang}`];
        compileType = langType ? langType.compileType : undefined;
    }
    return {
        code,
        lang,
        compileType
    };
}
function getSFC(source) {
    let elem = make(source);
    return {
        template: getSFM(elem, 'template'),
        style: getSFM(elem, 'style'),
        script: getSFM(elem, 'script')
    };
}
function combineCode(templateCode, scriptCode, styleCode) {
    let code = `
            <template>
              ${templateCode}
            </template>\n
            <script>
              ${scriptCode}
            </script>\n
            <style lang="less">
              ${styleCode}
            </style>`;
    return util_1.beautifyHtml(code);
}
function getElementsByAttrRegex(dom, nameReg, valueReg) {
    let elems = [];
    dom.forEach((elem) => {
        if (elem.type === 'tag' && elem.attribs) {
            let keys = _.keys(elem.attribs);
            if (valueReg) {
                if (_.some(keys, key => nameReg.test(key) && valueReg.test(elem.attribs[key]))) {
                    elems.push(elem);
                }
            }
            else {
                if (_.some(keys, key => nameReg.test(key))) {
                    elems.push(elem);
                }
            }
        }
        if (elem.children) {
            elems = elems.concat(getElementsByAttrRegex(elem.children, nameReg, valueReg));
        }
    });
    return elems;
}
function getElementsByTagName(dom, tagNames) {
    if (typeof tagNames === 'string') {
        tagNames = [tagNames];
    }
    return domUtils.getElementsByTagName((name) => {
        return tagNames.indexOf(name) > -1;
    }, dom, true, []);
}
function getTagNamesByRegex(dom, tagReg, duplicate) {
    let tags = [];
    dom.forEach((elem) => {
        if (elem.type === 'tag' && tagReg.test(elem.name)) {
            if (duplicate) {
                tags.push(elem.name);
            }
            else {
                if (tags.indexOf(elem.name) < 0) {
                    tags.push(elem.name);
                }
            }
        }
        if (elem.children) {
            tags = tags.concat(getTagNamesByRegex(elem.children, tagReg));
        }
    });
    return tags;
}
function isOneRootDom(dom) {
    let tagCount = dom.filter((elem) => {
        return elem.type === 'tag';
    }).length;
    return tagCount === 1;
}
exports.dom = {
    make,
    getSFM,
    getSFC,
    combineCode,
    getElementsByAttrRegex,
    getElementsByTagName,
    getTagNamesByRegex,
    isOneRootDom
};
