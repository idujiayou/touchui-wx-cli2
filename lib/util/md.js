"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const marked = require("marked");
const highlight = require("highlight.js");
const util_1 = require("../util");
const htmlparser = require('htmlparser2');
const renderer = new marked.Renderer();
const { DomUtils: domUtils } = htmlparser;
function tagAddClassName(source) {
    let element = util_1.dom.make(source);
    let elems = domUtils.getElementsByTagName(() => true, element, true, []);
    elems.forEach((elem) => {
        elem.attribs = elem.attribs || {};
        elem.attribs.class = [elem.attribs.class || '', `md-${elem.name}`].filter(name => !!name).join(' ');
    });
    return domUtils.getOuterHTML(element);
}
renderer.table = (header, body) => {
    return `<table class="md-table">
    ${tagAddClassName(header)}
    ${tagAddClassName(body)}
  </table>`;
};
renderer.heading = (text, level, raw) => {
    return `<h${level} class="md-h${level}">${text}</h${level}>`;
};
renderer.code = (code, language, isEscaped) => {
    code = highlight.highlightAuto(code).value;
    return `<code class="lang-${language} md-code">${code}</code>`;
};
marked.setOptions({
    renderer,
    highlight(code, lang) {
        return highlight.highlightAuto(code, [lang]).value;
    }
});
function md2html(source, isFormat) {
    source = exports.md.marked(source);
    if (isFormat) {
        source = source.replace(/\n/g, '<br/>');
        source = source.replace(/[ ]{2}/g, '<span class="md--tab"></span>');
    }
    return source;
}
exports.md = {
    marked,
    md2html
};
