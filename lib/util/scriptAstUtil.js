"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babel = require("babel-core");
const babylon = require("babylon");
var t = babel.types;
const util_1 = require("../util");
const Generator = require('babel-generator').CodeGenerator;
exports.scriptAstUtil = {
    transform(source) {
        return babylon.parse(source, {
            sourceType: 'module',
            plugins: [
                'dynamicImport',
                'objectRestSpread'
            ]
        });
    },
    getExportDefaultProperties(node) {
        let body = node.program.body;
        for (let i = 0; i < body.length; i++) {
            if (body[i].type === 'ExportDefaultDeclaration') {
                return body[i].declaration.properties;
            }
        }
    },
    getNodeFromRootByPath(node, path) {
        let rootProperties = this.getExportDefaultProperties(node);
        let paths = path.split('.');
        function recursive(properties, paths) {
            if (paths.length === 0) {
                throw new Error('util.getNodeFromRootByPath异常，path参数为空');
            }
            for (let i = 0; i < properties.length; i++) {
                if ((properties[i].type === 'ObjectProperty' || properties[i].type === 'ObjectMethod') && (properties[i].key.name === paths[0] || properties[i].key.value === paths[0])) {
                    if (paths.length === 1) {
                        return properties[i];
                    }
                    paths.splice(0, 1);
                    return recursive(properties[i].value.properties, paths);
                }
            }
        }
        return recursive(rootProperties, paths);
    },
    getReturnObjectProperties(node) {
        for (let i = 0; i < node.length; i++) {
            if (node[i].type === 'ReturnStatement') {
                return node[i].argument.properties;
            }
        }
    },
    isMatchMethods(n, methods) {
        if (!n) {
            throw new Error(`node can't be null`);
        }
        return t.isCallExpression(n.expression)
            && t.isMemberExpression(n.expression.callee)
            && n.expression.callee.object.type === 'Identifier'
            && t.isIdentifier(n.expression.callee.property)
            && (methods.indexOf(n.expression.callee.property.name) > -1);
    },
    transformFromNode(node) {
        const result = new Generator(node, {
            quotes: 'single'
        }).generate();
        let { code = '' } = result;
        return code;
    },
    transformFromAst(ast, handle) {
        let result = babel.transformFromAst(ast, undefined, {
            ast: false,
            babelrc: false
        });
        let { code = '' } = result;
        if (handle) {
            code = handle(code);
        }
        code = util_1.prettifyJs(code);
        return code;
    }
};
