"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
const config_1 = require("../config");
exports.postcssUnit2rpx = postcss.plugin('postcss-unit2rpx', (options) => {
    return root => {
        root.walkRules((rule, index) => {
            root.walkDecls(decl => {
                decl.value = decl.value.replace(/([0-9.]+)(px|rem)/ig, (match, size, unit) => {
                    if (unit === 'px' && config_1.default.style.unit.px2rpx) {
                        return `${size}rpx`;
                    }
                    else if (unit === 'rem' && config_1.default.style.unit.rem2rpx) {
                        return `${size * 100}rpx`;
                    }
                    return match;
                });
            });
        });
    };
});
