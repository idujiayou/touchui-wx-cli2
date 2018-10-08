"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const beautify = require("js-beautify");
const { js_beautify, html_beautify, css_beautify } = beautify;
function beautifyHtml(source) {
    return html_beautify(source, {
        'indent_size': 2,
        'brace_style': 'collapse',
        'indent_char': ' ',
        'preserve_newlines': true,
        'unformatted': [],
        'indent_scripts': 'keep',
        'eol': '\n',
        'indent_with_tabs': false,
        'max_preserve_newlines': 10,
        'wrap_line_length': 0,
        'wrap_attributes': 'auto',
        'wrap_attributes_indent_size': 2,
        'end_with_newline': false
    });
}
exports.beautifyHtml = beautifyHtml;
function beautifyCss(source) {
    return css_beautify(source, {
        'end_with_newline': false,
        'indent_char': ' ',
        'indent_size': 2,
        'selector_separator_newline': true
    });
}
exports.beautifyCss = beautifyCss;
function beautifyJs(source) {
    return js_beautify(source, {
        'brace_style': 'collapse',
        'break_chained_methods': false,
        'eval_code': false,
        'indent_char': ' ',
        'indent_level': 0,
        'indent_size': 2,
        'indent_with_tabs': false,
        'jslint_happy': false,
        'keep_array_indentation': false,
        'keep_function_indentation': false,
        'max_preserve_newlines': 10,
        'preserve_newlines': true,
        'space_before_conditional': true,
        'unescape_strings': false,
        'wrap_line_length': 1
    });
}
exports.beautifyJs = beautifyJs;
