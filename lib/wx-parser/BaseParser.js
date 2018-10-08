"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const NodeUtil_1 = require("./libs/NodeUtil");
const nodeUtil = new NodeUtil_1.default();
class BaseParser {
    get themeColor() {
        return util_1.Global.appConfig.theme['theme-color'];
    }
    setThemeColor(node, attr) {
        nodeUtil.normalizeNodeAttr(node, attr);
        if (!node.attribs[attr]) {
            node.attribs[attr] = this.themeColor;
        }
    }
    transformTag(options) {
        nodeUtil.transformTag(options);
    }
    setTruthyClasses(node, attrs) {
        nodeUtil.setTruthyClasses(node, attrs);
    }
}
exports.BaseParser = BaseParser;
