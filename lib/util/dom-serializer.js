"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ElementType = require('domelementtype');
const entities = require('entities');
const isTag = ElementType.isTag;
const booleanAttributes = {
    __proto__: null,
    allowfullscreen: true,
    async: true,
    autofocus: true,
    checked: true,
    controls: true,
    default: true,
    defer: true,
    hidden: true,
    ismap: true,
    loop: true,
    multiple: true,
    muted: true,
    open: true,
    readonly: true,
    required: true,
    reversed: true,
    scoped: true,
    seamless: true,
    selected: true,
    typemustmatch: true,
    'hover-stop-propagation': true,
    'scroll-x': true,
    'scroll-y': true,
    'scroll-with-animation': true,
    'enable-back-to-top': true,
    'indicator-dots': true,
    'autoplay': true,
    'circular': true,
    'vertical': true,
    'inertia': true,
    'out-of-bounds': true,
    'selectable': true,
    'decode': true,
    'show-info': true,
    'active': true,
    'plain': true,
    'disabled': true,
    'loading': true,
    'show-message-card': true,
    'report-submit': true,
    'password': true,
    'auto-focus': true,
    'focus': true,
    'confirm-hold': true,
    'show-value': true,
    'auto-height': true,
    'fixed': true,
    'show-confirm-bar': true,
    'lazy-load': true,
    'danmu-btn': true,
    'enable-danmu': true,
    'page-gesture': true,
    'background-mute': true,
    'autopush': true,
    'enable-camera': true,
    'show-location': true,
    'disable-scroll': true,
    'animate': true,
    'animate-duration': true,
    'show-title': true,
    'border': true,
    'border-left': true,
    'border-right': true,
    'border-top': true,
    'border-bottom': true,
    'bordered': true,
    'border-left-indent': true,
    'border-indent': true,
    'select-range-mode': true,
    'disable-past-days': true,
    'disable-fore-days': true,
    'can-select-today': true,
    'checkbox': true,
    'show-toast': true,
    'show-top': true,
    'show-number': true,
    'show-max-value': true,
    'show-tooltip': true,
    'unlimited': true,
    'show-arrow': true,
    'can-swipe': true,
    'auto-width': true,
    'ink-bar': true,
    'cropout': true,
    'fixed-width': true,
    'half': true,
    'show-line': true,
    'shadow': true
};
const unencodedElements = {
    __proto__: null,
    style: true,
    script: true,
    xmp: true,
    iframe: true,
    noembed: true,
    noframes: true,
    plaintext: true,
    noscript: true
};
function formatAttrs(attributes, opts) {
    if (!attributes)
        return;
    let output = '';
    let value;
    for (let key in attributes) {
        value = attributes[key];
        if (output) {
            output += ' ';
        }
        if (!value && booleanAttributes[key]) {
            output += key;
        }
        else {
            output += key + '="' + (opts.decodeEntities ? entities.encodeXML(value) : value) + '"';
        }
    }
    return output;
}
const singleTag = {
    __proto__: null,
    area: true,
    base: true,
    basefont: true,
    br: true,
    col: true,
    command: true,
    embed: true,
    frame: true,
    hr: true,
    img: true,
    image: true,
    import: true,
    include: true,
    checkbox: false,
    input: false,
    isindex: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    template: true,
    wbr: true
};
function getOuterHTML(dom, opts) {
    if (!Array.isArray(dom) && !dom.cheerio)
        dom = [dom];
    opts = opts || {};
    let output = '';
    for (let i = 0; i < dom.length; i++) {
        let elem = dom[i];
        if (elem.type === 'root') {
            output += getOuterHTML(elem.children, opts);
        }
        else if (ElementType.isTag(elem)) {
            if (elem.name !== 'script' && elem.name !== 'style') {
                output += renderTag(elem, opts);
            }
        }
        else if (elem.type === ElementType.Directive) {
            output += renderDirective(elem);
        }
        else if (elem.type === ElementType.Comment) {
            output += renderComment(elem);
        }
        else if (elem.type === ElementType.CDATA) {
            output += renderCdata(elem);
        }
        else {
            output += renderText(elem, opts);
        }
    }
    return output;
}
exports.getOuterHTML = getOuterHTML;
function renderTag(elem, opts) {
    if (elem.name === 'svg')
        opts = { decodeEntities: opts.decodeEntities, xmlMode: true };
    let tag = '<' + elem.name;
    let attribs = formatAttrs(elem.attribs, opts);
    if (attribs) {
        tag += ' ' + attribs;
    }
    if (opts.xmlMode
        && (!elem.children || elem.children.length === 0)) {
        tag += '/>';
    }
    else {
        let isExternalTemplate = elem.name === 'template' && elem.attribs.name;
        tag += singleTag[elem.name] && !isExternalTemplate ? '/>' : '>';
        if (elem.children) {
            tag += getOuterHTML(elem.children, opts);
        }
        if (!singleTag[elem.name] || isExternalTemplate || opts.xmlMode) {
            tag += '</' + elem.name + '>';
        }
    }
    return tag;
}
function renderDirective(elem) {
    return '<' + elem.data + '>';
}
function renderText(elem, opts) {
    let data = elem.data || '';
    if (opts.decodeEntities && !(elem.parent && elem.parent.name in unencodedElements)) {
        data = entities.encodeXML(data);
    }
    return data;
}
function renderCdata(elem) {
    return '<![CDATA[' + elem.children[0].data + ']]>';
}
function renderComment(elem) {
    return '<!--' + elem.data + '-->';
}
function getInnerHTML(elem, opts) {
    return elem.children ? elem.children.map(function (elem) {
        return getOuterHTML(elem, opts);
    }).join('') : '';
}
exports.getInnerHTML = getInnerHTML;
function getText(elem) {
    if (Array.isArray(elem))
        return elem.map(getText).join('');
    if (isTag(elem))
        return elem.name === 'br' ? '\n' : getText(elem.children);
    if (elem.type === ElementType.CDATA)
        return getText(elem.children);
    if (elem.type === ElementType.Text)
        return elem.data;
    return '';
}
exports.getText = getText;
