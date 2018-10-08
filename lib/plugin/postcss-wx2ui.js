"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
const tagSeletors = ['view', 'scroll-view', 'swiper', 'swiper-item', 'image', 'text', 'rich-text', 'progress', 'button', 'checkbox', 'form', 'input', 'label', 'picker', 'picker-view', 'radio', 'switch', 'textarea', 'navigator', 'audio', 'image', 'video', 'map'];
exports.postcssWx2ui = postcss.plugin('postcss-wx2ui', (options) => {
    return root => {
        root.walkRules((rule, index) => {
            if (rule.selector && tagSeletors.indexOf(rule.selector) > -1) {
                rule.selector = '.ui-' + rule.selector;
            }
        });
    };
});
