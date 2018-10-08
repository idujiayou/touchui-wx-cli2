"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseParser_1 = require("../BaseParser");
class IconParser extends BaseParser_1.BaseParser {
    parse(node) {
        this.transformTag({
            node: node,
            tag: 'span',
            className: 'ui-icon'
        });
        let { type, color, size = 16 } = node.attribs;
        if (type) {
            node.attribs.class += ` icon-${node.attribs.type}`;
        }
        if (color) {
            node.attribs.style += `color: ${color};`;
        }
        node.attribs.style += `font-size: ${size}px;`;
    }
}
exports.IconParser = IconParser;
