"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const changeCase = require("change-case");
const babel = require("babel-core");
const class_1 = require("../class");
const declare_1 = require("../declare");
const util_1 = require("../util");
var t = babel.types;
const CONFIG_KEY = 'config';
const DATA_KEY = 'data';
const PATH_SEP = path.sep;
class WxSFMScript extends class_1.WxSFM {
    constructor(source, request, options) {
        super(source, request, {
            destExt: request.ext === util_1.config.ext.wxs ? util_1.config.ext.wxs : util_1.config.ext.js
        });
        this.options = options;
        this.config = Object.create(null);
        this.depends = [];
        if (this.isWxp || this.isWxc) {
            this.initConfig(options);
            this.addWXCDepends(this.config.usingComponents);
        }
        this.initNode();
        this.traverse();
    }
    initConfig(options) {

        let uiComponents = util_1.resolveUsingComponents(options.templateCode);
        this.config = _.merge({}, this.config, {
            usingComponents: util_1.Global.layout.app.usingComponents
        }, {
            usingComponents: uiComponents
        });
    }
    getConfig() {
        return this.config;
    }
    getUsingComponents() {
        return this.config.usingComponents || {};
    }
    getDepends() {
        return this.depends;
    }
    updateDepends(useRequests) {
        let depends = this.getDepends();
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
                    case declare_1.RequestType.SCRIPT:
                        depend.$node.value = request + util_1.config.ext.js;
                        break;
                    case declare_1.RequestType.JSON:
                        depend.$node.value = request + useRequest.ext + util_1.config.ext.js;
                        break;
                    case declare_1.RequestType.WXS:
                        if (depend.$node) {
                            depend.$node.value = request + useRequest.ext;
                        }
                        break;
                    case declare_1.RequestType.WXC:
                    case declare_1.RequestType.WXP:
                        this.config.usingComponents = Object.assign(this.config.usingComponents || {}, {
                            [depend.usingKey]: request
                        });
                        break;
                }
            });
        });
    }
    generator() {
        let { isThreeNpm, ext } = this.request;
        let transformOptions = isThreeNpm ? {} : (util_1.config.compilers['babel'] || {});
        if (ext === util_1.config.ext.wxs) {
            transformOptions = _.omit(transformOptions, 'sourceMaps');
        }
        let result = babel.transformFromAst(this.node, this.source, Object.assign({ ast: false, babelrc: false, filename: this.request.src }, transformOptions));
        let { code = '' } = result;
        return code;
    }
    save() {
        super.save();
    }
    remove() {
        super.remove();
    }
    afterSave() {
        this.saveConfigFile();
    }
    initNode() {
        let result = babel.transform(this.source, {
            ast: true,
            babelrc: false
        });
        let { ast = t.emptyStatement() } = result;
        this.node = ast;
    }
    traverse() {
        let visitor = {
            ImportDeclaration: (path) => {
                this.visitDepend(path);
            },
            CallExpression: (path) => {
                this.visitDepend(path);
            },
            ExportDefaultDeclaration: (path) => {
            },
            ObjectExpression: (path) => {
                this.visitStructure(path);
            },
            ObjectProperty: (path) => {
                this.visitMarkdown(path);
                this.visitConfig(path);
            }
        };
        babel.traverse(this.node, visitor);
    }
    checkUseModuleExports(path) {
        if (!this.isSFC) {
            return;
        }
        if (!t.isAssignmentExpression(path.parent)) {
            return;
        }
        let { left, operator } = path.parent;
        if (operator !== '=') {
            return;
        }
        if (!t.isMemberExpression(left)) {
            return;
        }
        if (!t.isIdentifier(left.object) || !t.isIdentifier(left.property)) {
            return;
        }
        let expression = `${left.object.name}.${left.property.name}`;
        if (expression !== 'module.exports' && expression !== 'exports.default') {
            return;
        }
        return true;
    }
    checkUseExportDefault(path) {
        if (!this.isSFC) {
            return;
        }
        if (!t.isExportDefaultDeclaration(path.parent)) {
            return;
        }
        return true;
    }
    visitStructure(path) {
        if (!this.checkUseExportDefault(path) && !this.checkUseModuleExports(path)) {
            return;
        }
        let extKey = _.findKey(util_1.config.ext, (ext) => ext === this.request.ext) || '';
        let structure = util_1.config.structure[extKey];
        if (!structure) {
            util_1.log.error('没找到构造器');
            return;
        }
        path.replaceWith(t.callExpression(t.identifier(structure), [t.objectExpression(path.node.properties)]));
    }
    visitMarkdown(path) {
        if (!this.isWxp) {
            return;
        }
        let { key, value } = path.node;
        let dataKey = '';
        if (t.isIdentifier(key)) {
            dataKey = key.name;
        }
        else if (t.isStringLiteral(key)) {
            dataKey = key.value;
        }
        if (DATA_KEY !== dataKey) {
            return;
        }
        if (!value) {
            util_1.log.warn('data 属性没有值');
            return;
        }
        if (!t.isObjectExpression(value)) {
            util_1.log.warn('data 属性不是一个ObjectExpression');
            return;
        }
        let properties = [];
        let pattern = Array.prototype.concat.apply([], [util_1.config.pages.split('/'), ['([a-z-]+)', `index${util_1.config.ext.wxp}`]]).join(`\\${PATH_SEP}`);
        let matchs = this.request.srcRelative.match(new RegExp(`^${pattern}$`));
        if (!matchs || matchs.length < 2) {
            return;
        }
        let pkgDirName = `${util_1.config.prefixStr}${matchs[1]}`;
        let readmeFile = util_1.config.getPath('packages', pkgDirName, 'README.md');
        properties.push(t.objectProperty(t.identifier('readme'), t.stringLiteral(this.md2htmlFromFile(readmeFile))));
        let dependWxcs = this.depends.filter(depend => {
            return depend.requestType === declare_1.RequestType.WXC && /^demo-/.test(depend.usingKey);
        });
        _.forEach(dependWxcs, (dependWxc, index) => {
            let name = dependWxc.usingKey;
            let file = `${dependWxc.request}${util_1.config.ext.wxc}`;
            properties.push(t.objectProperty(t.identifier(changeCase.camelCase(name)), t.stringLiteral(this.md2htmlFromFile(file))));
        });
        let mdObjectProperty = t.objectProperty(t.stringLiteral('__code__'), t.objectExpression(properties));
        value.properties = [mdObjectProperty, ...value.properties];
    }
    visitDepend(path) {
        if (t.isImportDeclaration(path.node)) {
            let { source: $node } = path.node;
            this.addNativeDepends($node);
        }
        else if (t.isCallExpression(path.node)) {
            let { callee, arguments: args } = path.node;
            if (!(t.isIdentifier(callee) && callee.name === 'require' && args.length > 0)) {
                return;
            }
            let $node = args[0];
            if (t.isStringLiteral($node)) {
                this.addNativeDepends($node);
            }
        }
    }
    visitConfig(path) {
        if (!this.isSFC) {
            return;
        }
        let config = this.transfromConfig(path.node);
        
        if (!config) {
            return;
        }
        this.config = _.merge({}, this.config, config);
        this.addWXCDepends(this.config.usingComponents);
        path.remove();
    }
    addWXCDepends(usingComponents) {
        if (!usingComponents) {
            return;
        }
        if (this.isWxc || this.isWxp) {
            _.forIn(usingComponents, (value, key) => {
                this.depends.push({
                    request: value,
                    requestType: declare_1.RequestType.WXC,
                    usingKey: key
                });
            });
        }
    }
    addNativeDepends($node) {
        let request = $node.value;
        let isJsonExt = path.extname(request) === util_1.config.ext.json;
        let isWxsExt = path.extname(request) === util_1.config.ext.wxs;

        if (isJsonExt) {
            this.depends.push({
                request,
                requestType: declare_1.RequestType.JSON,
                $node
            });
        }
        else if (isWxsExt) {
            this.depends.push({
                request,
                requestType: declare_1.RequestType.WXS,
                $node
            });
        }
        else {
            this.depends.push({
                request,
                requestType: declare_1.RequestType.SCRIPT,
                $node
            });
        }
    }
    md2htmlFromFile(file) {
        if (!path.isAbsolute(file)) {
            file = path.join(path.dirname(this.request.src), file);
        }
        if (fs.existsSync(file)) {
            let source = fs.readFileSync(file, 'utf-8');
            let isWxc = path.extname(file) === util_1.config.ext.wxc;
            if (isWxc) {
                source = '``` html\n' + source + '\n```';
            }
            return `${util_1.md.md2html(source, isWxc)}`;
        }
        return '';
    }
    transfromConfig(node) {
        if (!t.isObjectProperty(node)) {
            return;
        }
        let { key, value } = node;
        let configKey = '';
        if (t.isIdentifier(key)) {
            configKey = key.name;
        }
        else if (t.isStringLiteral(key)) {
            configKey = key.value;
        }
        if (CONFIG_KEY !== configKey) {
            return;
        }
        if (!value) {
            return;
        }
        if (!t.isObjectExpression(value)) {
            util_1.log.warn('config 属性不是一个ObjectExpression');
            return;
        }
        let config = {};
        let configProgram = t.program([
            t.expressionStatement(t.assignmentExpression('=', t.identifier('config'), value))
        ]);
        let { code: configCode = '' } = babel.transformFromAst(configProgram, '', {
            code: true,
            ast: false,
            babelrc: false
        });
        eval(configCode);
        config = config || {};
        config.usingComponents = config.usingComponents || {};
        return config;
    }
    saveConfigFile() {
        if (!this.isWxp && !this.isWxc) {
            return;
        }
        let configCopy = _.cloneDeep(this.config);
        if (this.isWxc) {
            configCopy.component = true;
        }
        let dester = this.getDester(util_1.config.ext.json);
        util_1.log.msg(util_1.LogType.WRITE, dester.destRelative);
        util_1.default.writeFile(dester.dest, JSON.stringify(configCopy, null, 2));
    }
}
exports.WxSFMScript = WxSFMScript;
