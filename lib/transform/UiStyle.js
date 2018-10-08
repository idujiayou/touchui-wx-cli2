"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
const plugin_1 = require("../plugin");
const classSelectors1 = ['ui-view', 'ui-scroll-view', 'ui-swiper', 'ui-swiper-item', 'ui-image', 'ui-text', 'ui-rich-text', 'ui-progress', 'ui-button', 'ui-checkbox', 'ui-form', 'ui-input', 'ui-label', 'ui-picker', 'ui-picker-view', 'ui-radio', 'ui-switch', 'ui-textarea', 'ui-navigator', 'ui-audio', 'ui-image', 'ui-video', 'ui-map'];
const classSelectors2 = ['ui-accordion', 'ui-badge', 'ui-blur', 'ui-calendar', 'ui-calendar1', 'ui-cascader', 'ui-check-list', 'ui-count-down', 'ui-count-up', 'ui-divider', 'ui-fixed-view', 'ui-index-list', 'ui-mask', 'ui-mini-star', 'ui-nav-bar', 'ui-popover', 'ui-popup', 'ui-roller', 'ui-roller-item', 'ui-row-list', 'ui-ruler', 'ui-segment', 'ui-segment-item', 'ui-slider', 'ui-star', 'ui-stepper', 'ui-sticky', 'ui-summary', 'ui-swipe-out', 'ui-tab', 'ui-tabs', 'ui-tags', 'ui-timeline', 'ui-timeline-item', 'ui-v-calendar', 'ui-v-tab', 'ui-v-tabs', 'ui-w-calendar'];
class UiStyle {
    constructor(source, isApp) {
        this.source = source;
        this.isApp = isApp;
    }
    generator() {
        return __awaiter(this, void 0, void 0, function* () {
            let code = this.source;
            code = this.transformSelectors(code);
            code = yield this.removeUselessRules(code);
            if (this.isApp) {
                code = code.replace(/@import((?!common\/).)+;\n/g, '')
                
                code = `@import './static/styles/index.less';\n` + code;
            }
            return code;
        });
    }
    transformSelectors(code) {
        return code.replace(/\.(ui(-[\w]+)+)/g, ($1, $2) => {
            if (classSelectors1.indexOf($2) > -1) {
                return $2.replace('ui-', '');
            }
            if (classSelectors2.indexOf($2) > -1) {
                return $2;
            }
            return $1;
        });
    }
    removeUselessRules(code) {
        return __awaiter(this, void 0, void 0, function* () {
            code = code.replace(/(\.mix.*;)/g, '/***###$1###***/');
            code = yield postcss([
                plugin_1.postcssUi2wx
            ]).process(code).then(result => result.css);
            return code.replace(/(\/[*]{3}[#]{3})|([#]{3}[*]{3})\//g, '');
        });
    }
}
exports.UiStyle = UiStyle;
