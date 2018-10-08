"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseParser_1 = require("../BaseParser");
class RadioParser extends BaseParser_1.BaseParser {
    parse(node) {
        this.setThemeColor(node, 'color');
    }
}
exports.RadioParser = RadioParser;
