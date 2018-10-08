"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
class NodeUtil {
    normalizeNodeAttr(node, attr) {
        let camelCaseAttr = util_1.default.dash2CamelCase(attr);
        let dashAttr = util_1.default.camelCase2Dash(attr);
        if (node.attribs[camelCaseAttr] && attr !== dashAttr) {
            node.attribs[attr] = node.attribs[camelCaseAttr];
            delete node.attribs[camelCaseAttr];
        }
    }
    transformTag(options) {
        let { node, className, tag } = options;
        node.name = tag || 'view';
        if (!node.attribs.class) {
            node.attribs.class = className;
        }
        else {
            node.attribs.class += ` ${className}`;
        }
        if (!node.attribs.style) {
            node.attribs.style = '';
        }
        else {
            if (node.attribs.style.slice(-1) !== ';') {
                node.attribs.style += ';';
            }
        }
    }
    setTruthyClasses(node, props) {
        props.forEach((prop) => {
            if (node.attribs[prop.name] !== undefined) {
                node.attribs.class += ` ${prop.class}`;
                delete node.attribs[prop.name];
            }
        });
    }
}
exports.default = NodeUtil;
