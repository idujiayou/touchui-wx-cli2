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
const url = require("url");
const path = require("path");
const fs = require("fs-extra");
const less = require("less");
const postcss = require("postcss");
const class_1 = require("../class");
const declare_1 = require("../declare");
const util_1 = require("../util");
const plugin_1 = require("../plugin");
const postcssMixins = require('postcss-mixins');
const postcssAdvancedVariables = require('postcss-advanced-variables');
const postcssCustomMedia = require('postcss-custom-media');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssMediaMinmax = require('postcss-media-minmax');
const postcssColorFunction = require('postcss-color-function');
const postcssNesting = require('postcss-nesting');
const postcssNested = require('postcss-nested');
const postcssCustomSelectors = require('postcss-custom-selectors');
const postcssAtroot = require('postcss-atroot');
const postcssPropertyLookup = require('postcss-property-lookup');
const postcssExtend = require('postcss-extend');
const postcssSelectorMatches = require('postcss-selector-matches');
const postcssSelectorNot = require('postcss-selector-not');
const postcssBem = require('postcss-bem');
const postcssCalc = require('postcss-calc');
const postcssBemOptions = {
    defaultNamespace: undefined,
    style: 'suit',
    separators: {
        descendent: '__',
        modifier: '--'
    },
    shortcuts: {
        utility: 'u',
        component: 'b',
        descendent: 'e',
        modifier: 'm',
        when: 'is'
    }
};
let importLesses = [];
const utilsPath = path.join(util_1.config.cwd, util_1.config.src, 'static/utils');
if (fs.existsSync(utilsPath)) {
    fs.readdirSync(utilsPath).forEach((file) => {
        if (path.extname(file) === '.less') {
            importLesses.push(file);
        }
    });
}
const processor = postcss([
    postcssBem(postcssBemOptions),
    postcssMixins,
    postcssAdvancedVariables,
    postcssCustomMedia,
    postcssCustomProperties,
    postcssMediaMinmax,
    postcssColorFunction,
    postcssNesting,
    postcssNested,
    postcssCustomSelectors,
    postcssAtroot,
    postcssPropertyLookup,
    postcssExtend,
    postcssSelectorMatches,
    postcssSelectorNot,
    postcssCalc,
    plugin_1.postcssUnit2rpx
]);
class WxSFMStyle extends class_1.WxSFM {
    constructor(source, request, options) {
        super(source, request, {
            destExt: util_1.config.ext.wxss
        });
        this.options = options;
        this.depends = [];
        this.initDepends();
    }
    compileStyle() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.result)
                return '';
            return yield postcss([
                plugin_1.postcssUnit2rpx
            ]).process(this.result).then(result => result.css);
        });
    }
    compileLess() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.source)
                return '';
            let source = '';
            let options = {
                filename: this.request.src
            };
            source = this.source;
            if (path.extname(this.request.src) !== '.wxc') {
                let relativePath = path.relative(this.request.src, utilsPath).replace(/\.\.(\/|\\)/, '');
                let importCode = '';
                importLesses.forEach((file) => {
                    importCode += `@import '${path.join(relativePath, file)}';\r\n`;
                });
                source = importCode + source;
            }
            source = util_1.Global.config.style.lessCode + '\n' + source;
            source = yield less.render(source, options).then(result => result.css);
            source = yield postcss([
                plugin_1.postcssUnit2rpx
            ]).process(source).then(result => result.css);
            return source;
        });
    }
    compilePcss() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.result)
                return '';
            let source = '';
            source = yield postcss().process(this.result).then(result => result.css);
            source = util_1.Global.config.style.pcssCode + '\n' + source;
            source = yield processor.process(source).then(result => result.css);
            return source;
        });
    }
    generator() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.options.compileType) {
                case declare_1.CompileType.LESS:
                    return yield this.compileLess();
                case declare_1.CompileType.PCSS:
                    return yield this.compilePcss();
                default:
                    return yield this.compileStyle();
            }
        });
    }
    save() {
        super.save();
    }
    remove() {
        super.remove();
    }
    getDepends() {
        return this.depends;
    }
    updateDepends(useRequests) {
        let depends = this.getDepends();
        if (!depends.length)
            return;
        useRequests.forEach(useRequest => {
            depends
                .filter(depend => {
                return depend.requestType === useRequest.requestType && depend.request === useRequest.request;
            })
                .forEach(depend => {
                let request = '';
                request = path.relative(path.dirname(this.dest), path.dirname(useRequest.dest));
                request = path.join(request, path.basename(useRequest.dest, useRequest.ext));
                request = request.charAt(0) !== '.' ? `./${request}` : request;
                request = request.split(path.sep).join('/');
                switch (depend.requestType) {
                    case declare_1.RequestType.STYLE:
                        depend.$atRule.params = `'${request}${util_1.config.ext.wxss}'`;
                        break;
                    case declare_1.RequestType.ICONFONT:
                        let requestURL = url.parse(depend.request);
                        depend.$decl.value = depend.$decl.value.replace(depend.request, `${request}${useRequest.ext}${requestURL.search}`);
                        break;
                }
            });
        });
    }
    initDepends() {
        if (!this.source)
            return;
        if (this.options.compileType === declare_1.CompileType.LESS)
            return;
        let transformer = root => {
            root.walkAtRules((rule, index) => {
                if (rule.name !== 'import') {
                    return;
                }
                this.depends.push({
                    request: rule.params.replace(/^('|")(.*)('|")$/g, (match, quotn, filename) => filename),
                    requestType: declare_1.RequestType.STYLE,
                    $atRule: rule
                });
            });
            root.walkDecls((decl, index) => {
                if (decl.prop !== 'src') {
                    return;
                }
                if (decl.value.indexOf('url') === -1) {
                    return;
                }
                let urls = decl.value.split(/format\([\'\"][a-z-]+[\'\"]\),/);
                urls.forEach(url => {
                    let matchs = url.match(util_1.ICONFONT_PATTERN);
                    if (!matchs) {
                        return;
                    }
                    url = matchs[1];
                    if (!util_1.default.checkLocalImgUrl(url)) {
                        return;
                    }
                    this.depends.push({
                        request: url,
                        requestType: declare_1.RequestType.ICONFONT,
                        $decl: decl
                    });
                });
            });
        };
        let lazyResult = postcss([transformer]).process(this.source);
        lazyResult.toString();
        this.result = lazyResult['result'];
    }
}
exports.WxSFMStyle = WxSFMStyle;
