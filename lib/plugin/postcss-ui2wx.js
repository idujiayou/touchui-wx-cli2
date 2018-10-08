"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
const excludedRules = ['*', 'html', 'body', '#ui-app'];
exports.postcssUi2wx = postcss.plugin('postcss-ui2wx', (options) => {
    return root => {
        root.walkRules((rule, index) => {
            let isExclude = excludedRules.some((item) => {
                return rule.selector.indexOf(item) > -1;
            });
            if (isExclude) {
                rule.remove();
            }
        });
    };
});
