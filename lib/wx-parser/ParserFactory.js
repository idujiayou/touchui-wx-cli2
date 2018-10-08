"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class ParserFactory {
    static create(name, recurse) {
        switch (name) {
            case 'ui-row-list':
                return new _1.RowListParser();
            case 'ui-row':
                return new _1.RowParser();
            case 'ui-col':
                return new _1.ColParser(recurse);
            case 'ui-icon':
                return new _1.IconParser();
            case 'ui-tabs':
                return new _1.TabsParser();
            case 'switch':
                return new _1.SwitchParser();
            case 'checkbox':
                return new _1.CheckboxParser();
            case 'radio':
                return new _1.RadioParser();
            case 'slider':
                return new _1.SliderParser();
            case 'progress':
                return new _1.ProgressParser();
            case 'swiper':
                return new _1.SwiperParser();
            default:
                return new _1.NoopParser();
        }
    }
}
exports.ParserFactory = ParserFactory;
