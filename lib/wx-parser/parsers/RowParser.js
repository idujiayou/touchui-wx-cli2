"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseParser_1 = require("../BaseParser");
class RowParser extends BaseParser_1.BaseParser {
    parse(node) {
        let tag = node.attribs.url ? 'navigator' : 'view';
        this.transformTag({
            node: node,
            tag: tag,
            className: 'ui-row'
        });
        this.setTruthyClasses(node, [
            { name: 'border-top', class: 'ui-row-border-top' },
            { name: 'border-bottom', class: 'ui-row-border-bottom' }
        ]);
        if (node.attribs['space-bottom']) {
            node.attribs.style += `margin-bottom: ${node.attribs['space-bottom']}px;`;
            delete node.attribs['space-bottom'];
        }
        if (node.attribs['space-top']) {
            node.attribs.style += `margin-top: ${node.attribs['space-top']}px;`;
            delete node.attribs['space-top'];
        }
        if (node.attribs['space']) {
            node.attribs.style += `margin-top: ${node.attribs['space'] / 2}px; margin-bottom: ${node.attribs['space'] / 2}px;`;
            delete node.attribs['space'];
        }
        if (node.attribs.height) {
            node.attribs.style += `height:${node.attribs.height}px;`;
            delete node.attribs.height;
        }
    }
}
exports.RowParser = RowParser;
