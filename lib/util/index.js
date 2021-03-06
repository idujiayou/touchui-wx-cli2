"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var beautify_1 = require("./beautify");
exports.beautifyHtml = beautify_1.beautifyHtml;
exports.beautifyCss = beautify_1.beautifyCss;
exports.beautifyJs = beautify_1.beautifyJs;
var prettier_1 = require("./prettier");
exports.prettifyJs = prettier_1.prettifyJs;
var filter_1 = require("./filter");
exports.filterPrefix = filter_1.filterPrefix;
exports.filterNpmScope = filter_1.filterNpmScope;
var config_1 = require("./config");
exports.config = config_1.config;
exports.customConfig = config_1.customConfig;
exports.defaultConfig = config_1.defaultConfig;
var cache_1 = require("./cache");
exports.xcxNodeCache = cache_1.xcxNodeCache;
exports.xcxNext = cache_1.xcxNext;
var dom_serializer_1 = require("./dom-serializer");
exports.getText = dom_serializer_1.getText;
exports.getInnerHTML = dom_serializer_1.getInnerHTML;
exports.getOuterHTML = dom_serializer_1.getOuterHTML;
var dom_1 = require("./dom");
exports.dom = dom_1.dom;
var style_1 = require("./style");
exports.style = style_1.style;
var exec_1 = require("./exec");
exports.exec = exec_1.exec;
var global_1 = require("./global");
exports.Global = global_1.Global;
var log_1 = require("./log");
exports.log = log_1.log;
exports.LogType = log_1.LogType;
exports.LogLevel = log_1.LogLevel;
var md_1 = require("./md");
exports.md = md_1.md;
var resolveDep_1 = require("./resolveDep");
exports.resolveDep = resolveDep_1.resolveDep;
var resolveUsingComponents_1 = require("./resolveUsingComponents");
exports.resolveUsingComponents = resolveUsingComponents_1.resolveUsingComponents;
var scriptAstUtil_1 = require("./scriptAstUtil");
exports.scriptAstUtil = scriptAstUtil_1.scriptAstUtil;
var template_1 = require("./template");
exports.WxAppTemplate = template_1.WxAppTemplate;
exports.ICONFONT_PATTERN = /url\([\'\"]{0,}?([^\'\"]*)[\'\"]{0,}\)/;
const tool = require("./tool");
exports.default = tool;
