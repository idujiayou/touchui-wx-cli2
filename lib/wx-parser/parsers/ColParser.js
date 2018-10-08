"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseParser_1 = require("../BaseParser");
class ColParser extends BaseParser_1.BaseParser {
    constructor(recurse) {
        super();
        this.recurse = recurse;
    }
    parse(node) {
        this.transformTag({ node: node, className: 'ui-col' });
        let oldChildren = node.children;
        let colContent = {
            type: 'tag',
            name: 'view',
            attribs: {
                class: 'ui-col-content'
            },
            children: oldChildren
        };
        if (node.attribs.span) {
            node.attribs.class += ` ui-col-${node.attribs.span}`;
            node.attribs.style += `flex: 0 0 ${Number(node.attribs.span) / 12 * 100}%;`;
            delete node.attribs.span;
        }
        if (node.attribs['border-left'] !== undefined) {
            node.attribs.class += ' ui-col-border-left';
            delete node.attribs['border-left'];
        }
        if (node.attribs['border-right'] !== undefined) {
            node.attribs.class += ' ui-col-border-right';
            delete node.attribs['border-right'];
        }
        if (node.attribs.align) {
            node.attribs.class += ` ui-col-align-${node.attribs.align}`;
            node.attribs.class += ` align-${node.attribs.align}`;
            colContent.attribs.class += ` align-${node.attribs.align}`;
            delete node.attribs.align;
        }
        if (node.attribs['vertical-align']) {
            node.attribs.class += ` valign-${node.attribs['vertical-align']}`;
            colContent.attribs.class += ` valign-${node.attribs['vertical-align']}`;
            delete node.attribs['vertical-align'];
        }
        if (node.attribs['content-direction']) {
            colContent.attribs.class += ` flex-${node.attribs['content-direction']}`;
        }
        if (node.attribs['space-left']) {
            node.attribs.style += `padding-left: ${node.attribs['space-left']}px;`;
            delete node.attribs['space-left'];
        }
        if (node.attribs['space-right']) {
            node.attribs.style += `padding-right: ${node.attribs['space-right']}px;`;
            delete node.attribs['space-right'];
        }
        if (node.attribs['space']) {
            node.attribs.style += `padding-left: ${node.attribs['space'] / 2}px; padding-right: ${node.attribs['space'] / 2}px;`;
            delete node.attribs['space'];
        }
        if (node.attribs.width) {
            node.attribs.style += `flex:0 0 ${node.attribs.width}px;`;
            delete node.attribs.width;
        }
        node.children = [colContent];
        this.recurse(colContent.children);
    }
}
exports.ColParser = ColParser;
