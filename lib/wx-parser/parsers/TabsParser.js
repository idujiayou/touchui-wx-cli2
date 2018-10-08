"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseParser_1 = require("../BaseParser");
class TabsParser extends BaseParser_1.BaseParser {
    parse(node) {
        if (node.attribs['ink-bar'] === '') {
            node.attribs['ink-bar'] = true;
        }
    }
}
exports.TabsParser = TabsParser;
