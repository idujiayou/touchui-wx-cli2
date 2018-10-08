"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prettier = require('prettier');
function prettifyJs(source) {
    return prettier.format(source, {
        semi: false,
        singleQuote: true
    });
}
exports.prettifyJs = prettifyJs;
