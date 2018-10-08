"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseParser_1 = require("./BaseParser");
exports.BaseParser = BaseParser_1.BaseParser;
var RowParser_1 = require("./parsers/RowParser");
exports.RowParser = RowParser_1.RowParser;
var RowListParser_1 = require("./parsers/RowListParser");
exports.RowListParser = RowListParser_1.RowListParser;
var ColParser_1 = require("./parsers/ColParser");
exports.ColParser = ColParser_1.ColParser;
var SwitchParser_1 = require("./parsers/SwitchParser");
exports.SwitchParser = SwitchParser_1.SwitchParser;
var CheckboxParser_1 = require("./parsers/CheckboxParser");
exports.CheckboxParser = CheckboxParser_1.CheckboxParser;
var RadioParser_1 = require("./parsers/RadioParser");
exports.RadioParser = RadioParser_1.RadioParser;
var ProgressParser_1 = require("./parsers/ProgressParser");
exports.ProgressParser = ProgressParser_1.ProgressParser;
var SliderParser_1 = require("./parsers/SliderParser");
exports.SliderParser = SliderParser_1.SliderParser;
var SwiperParser_1 = require("./parsers/SwiperParser");
exports.SwiperParser = SwiperParser_1.SwiperParser;
var IconParser_1 = require("./parsers/IconParser");
exports.IconParser = IconParser_1.IconParser;
var TabsParser_1 = require("./parsers/TabsParser");
exports.TabsParser = TabsParser_1.TabsParser;
var NoopParser_1 = require("./parsers/NoopParser");
exports.NoopParser = NoopParser_1.NoopParser;
const ParserFactory_1 = require("./ParserFactory");
const parsers = {};
function parse(node, recurse) {
    let name = node.name;
    if (name) {
        let parser = parsers[name];
        if (!parser) {
            parser = ParserFactory_1.ParserFactory.create(name, recurse);
        }
        parser.parse(node);
    }
}
exports.parseWxTags = function (nodes) {
    nodes.forEach((node) => {
        if (node.name === 'ui-row') {
            parse(node);
            node.children.forEach((childNode) => {
                if (childNode.name === 'ui-col') {
                    parse(childNode, exports.parseWxTags);
                }
            });
        }
        else {
            parse(node);
        }
        if (node.children) {
            exports.parseWxTags(node.children);
        }
    });
};
