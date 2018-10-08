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
const babel = require("babel-core");
const _ = require("lodash");
const util_1 = require("../util");
var t = babel.types;
const lifeCycleMap = {
    onReady: 'mounted'
};
const ignoreMethods = ['onLoad', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap'];
const unsupprotedWxApis = ['getRecorderManager', 'createInnerAudioContext', 'createAudioContext', 'createCameraContext', 'createLivePlayerContext', 'createLivePusherContext', 'canIUse', 'startBeaconDiscovery', 'stopBeaconDiscovery', 'getBeacons', 'onBeaconUpdate', 'onBeaconServiceChange', 'getHCEState', 'startHCE', 'stopHCE', 'onHCEMessage', 'sendHCEMessage', 'startWifi', 'stopWifi', 'connectWifi', 'getWifiList', 'onGetWifiList', 'setWifiList', 'onWifiConnected', 'getConnectedWifi', 'showModal', 'setTopBarText', 'reLaunch', 'createAnimation', 'createSelectorQuery', 'stopPullDownRefresh', 'checkSession', 'login', 'authorize'];
class WxScript {
    constructor(source, isApp) {
        this.source = source;
        this.isApp = isApp;
        this.source = source;
        this.initNode();
    }
    get config() {
        let props = this.props;
        for (let i = 0; i < props.length; i++) {
            let keyName = props[i].key.name;
            if (keyName === 'config') {
                let result = eval(`({${util_1.scriptAstUtil.transformFromNode(props[i])}})`);
                return result.config;
            }
        }
    }
    initNode() {
        this.node = util_1.scriptAstUtil.transform(this.source);
        this.props = util_1.scriptAstUtil.getExportDefaultProperties(this.node);
    }
    generator() {
        return __awaiter(this, void 0, void 0, function* () {
            this.transformProperties();
            this.transformWx();
            if (this.isApp) {
                this.addOnLaunchToApp();
            }
            return this.generateCode();
        });
    }
    transformProperties() {
        let props = this.props;
        let methods = {
            type: 'ObjectProperty',
            key: {
                type: 'Identifier',
                name: 'methods'
            },
            value: {
                type: 'ObjectExpression',
                properties: []
            }
        };
        props.push(methods);
        for (let i = props.length - 1; i >= 0; i--) {
            let type = props[i].type;
            let keyName = props[i].key.name;
            if (type === 'ObjectProperty' && keyName === 'data') {
                this._tranformData(props, props[i], i);
            }
            if (type === 'ObjectMethod') {
                if (keyName === 'onReady') {
                    this._transformLifeCycle(props[i], keyName);
                }
                else if (ignoreMethods.indexOf(keyName) > -1) {
                    props.splice(i, 1);
                }
                else {
                    this._transformMethods(props, methods, i);
                }
            }
        }
    }
    transformWx() {
        let visitor = {
            Identifier: (path) => {
                if (path.node.name === 'wx') {
                    path.node.name = 'ui';
                }
            },
            ExpressionStatement: (path) => {
                this.vistorExpressionStatement(path);
            }
        };
        babel.traverse(this.node, visitor);
    }
    vistorExpressionStatement(path) {
        let n = path.node;
        let isSetData = t.isCallExpression(n.expression)
            && t.isMemberExpression(n.expression.callee)
            && n.expression.callee.object.type === 'ThisExpression'
            && t.isIdentifier(n.expression.callee.property, { name: 'setData' });
        if (isSetData) {
            if (t.isBlockStatement(path.parent)) {
                let body = path.parent.body;
                let properties = n['expression']['arguments'][0].properties;
                for (let i = body.length; i >= 0; i--) {
                    if (body[i] === n) {
                        let statements = properties.map((prop) => {
                            return {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'AssignmentExpression',
                                    operator: '=',
                                    left: {
                                        type: 'MemberExpression',
                                        object: {
                                            type: 'ThisExpression'
                                        },
                                        property: {
                                            type: 'Identifier',
                                            name: prop.key.name
                                        }
                                    },
                                    right: prop.value
                                }
                            };
                        });
                        body.splice(i, 1, ...statements);
                    }
                }
            }
        }
        if (util_1.scriptAstUtil.isMatchMethods(n, unsupprotedWxApis)) {
            let id = n.expression['callee'].object.name;
            let prop = n.expression['callee'].property.name;
            if (id === 'wx') {
                id = 'ui';
            }
            if (t.isBlockStatement(path.parent)) {
                let body = path.parent.body;
                let index = _.findIndex(body, item => item === n);
                const comment = {
                    type: 'CommentBlock',
                    value: `* WX Tip:Touch UI不支持此API \n * ${id}.${prop}()\n `
                };
                let prevNode = body[index - 1];
                let nextNode = body[index + 1];
                if (index === 0) {
                    path.parent.innerComments = path.parent.innerComments || [];
                    path.parent.innerComments.push(comment);
                }
                else if (prevNode && !util_1.scriptAstUtil.isMatchMethods(prevNode, unsupprotedWxApis)) {
                    prevNode.trailingComments = prevNode.trailingComments || [];
                    prevNode.trailingComments.push(comment);
                }
                else if (nextNode && !util_1.scriptAstUtil.isMatchMethods(nextNode, unsupprotedWxApis)) {
                    nextNode.leadingComments = nextNode.leadingComments || [];
                    nextNode.leadingComments.push(comment);
                }
                body.splice(index, 1);
            }
        }
    }
    addOnLaunchToApp() {
        this.node.program.body.unshift({
            type: 'ImportDeclaration',
            specifiers: [{
                    type: 'ImportDefaultSpecifier',
                    local: {
                        type: 'Identifier',
                        name: 'system'
                    }
                }],
            importKind: 'value',
            source: {
                type: 'StringLiteral',
                value: './static/utils/system'
            }
        });
        this.props.push({
            type: 'ObjectMethod',
            method: true,
            key: {
                type: 'Identifier',
                name: 'onLaunch'
            },
            kind: 'method',
            params: [],
            body: {
                type: 'BlockStatement',
                body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: {
                                type: 'MemberExpression',
                                object: {
                                    type: 'Identifier',
                                    name: 'system'
                                },
                                property: {
                                    type: 'Identifier',
                                    name: 'attachInfo'
                                }
                            }
                        }
                    }]
            }
        });
    }
    _tranformData(props, data, i) {
        let newData = {
            type: 'ObjectMethod',
            key: {
                type: 'Identifier',
                name: 'data'
            },
            computed: false,
            kind: 'method',
            method: true,
            generator: false,
            expression: false,
            async: false,
            params: [],
            body: {
                type: 'BlockStatement',
                body: [{
                        type: 'ReturnStatement',
                        argument: data.value
                    }]
            }
        };
        props.splice(i, 1, newData);
    }
    _transformMethods(props, methods, i) {
        methods.value.properties.push(props[i]);
        props.splice(i, 1);
    }
    _transformLifeCycle(lifeCycle, name) {
        if (lifeCycleMap[name]) {
            lifeCycle.key.name = lifeCycleMap[name];
        }
    }
    generateCode() {
        return util_1.scriptAstUtil.transformFromAst(this.node, (code) => {
            return code.replace(/this\.data/g, 'this')
                .replace(/getApp\(\)/g, 'ui.getApp()');
        });
    }
}
exports.WxScript = WxScript;
