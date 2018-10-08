"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const _1 = require(".");
function isConstantValue(value) {
    return /(^\d+(\.\d+)?$|^'.*'$|^".*"$)/.test(value);
}
function transform(uiStyle) {
    let wxStyle = '';
    let decls = uiStyle.split(',');
    decls.forEach((decl) => {
        let arr = decl.split(':');
        let name = _.trim(_1.default.camelCase2Dash(arr[0])).replace(/('|")/g, '');
        let value = _.trim(arr[1]);
        if (isConstantValue(value)) {
            wxStyle += `${name}: ${value.replace(/('|")/g, '')};`;
        }
        else {
            wxStyle += `${name}: {{ ${value} }};`;
        }
    });
    return wxStyle;
}
function uiStyle2wxStyle(elem) {
    let attribs = elem.attribs;
    let match = attribs.style.match(/\{\{\s*\{(.*)\}\s*\}\}/);
    if (match && match[1]) {
        attribs.style = transform(match[1]);
    }
}
function reviseBrace(elem) {
    Object.keys(elem.attribs).forEach((key) => {
        let value = elem.attribs[key];
        if (value.indexOf('{{{') > -1 || value.indexOf('}}}') > -1) {
            elem.attribs[key] = value.replace('{{{', '{{ {').replace('}}}', '} }}');
        }
    });
}
exports.style = {
    uiStyle2wxStyle,
    reviseBrace
};
