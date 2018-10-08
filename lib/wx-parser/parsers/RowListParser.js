"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseParser_1 = require("../BaseParser");
class RowListParser extends BaseParser_1.BaseParser {
    parse(node) {
        this.transformTag({
            node: node,
            className: 'ui-row-list'
        });
        this.setTruthyClasses(node, [
            { name: 'bordered', class: 'ui-row-list-bordered' },
            { name: 'border-left-indent', class: 'ui-row-list-border-left-indent' },
            { name: 'border-indent', class: 'ui-row-list-border-indent' }
        ]);
    }
}
exports.RowListParser = RowListParser;
