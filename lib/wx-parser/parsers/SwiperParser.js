"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseParser_1 = require("../BaseParser");
class SwiperParser extends BaseParser_1.BaseParser {
    parse(node) {
        if (node.attribs['indicator-dots'] !== undefined) {
            this.setThemeColor(node, 'indicator-active-color');
        }
    }
}
exports.SwiperParser = SwiperParser;
