"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declare_1 = require("../declare");
const util_1 = require("../util");
const { ext } = util_1.config;
exports.LangTypes = {
    [ext.js]: {
        requestType: declare_1.RequestType.SCRIPT,
        compileType: undefined
    },
    [ext.json]: {
        requestType: declare_1.RequestType.JSON,
        compileType: undefined
    },
    [ext.png]: {
        requestType: declare_1.RequestType.IMAGE,
        compileType: undefined
    },
    [ext.jpg]: {
        requestType: declare_1.RequestType.IMAGE,
        compileType: undefined
    },
    [ext.jpeg]: {
        requestType: declare_1.RequestType.IMAGE,
        compileType: undefined
    },
    [ext.gif]: {
        requestType: declare_1.RequestType.IMAGE,
        compileType: undefined
    },
    [ext.webp]: {
        requestType: declare_1.RequestType.IMAGE,
        compileType: undefined
    },
    [ext.eot]: {
        requestType: declare_1.RequestType.ICONFONT,
        compileType: undefined
    },
    [ext.svg]: {
        requestType: declare_1.RequestType.ICONFONT,
        compileType: undefined
    },
    [ext.ttf]: {
        requestType: declare_1.RequestType.ICONFONT,
        compileType: undefined
    },
    [ext.woff]: {
        requestType: declare_1.RequestType.ICONFONT,
        compileType: undefined
    },
    [ext.wxs]: {
        requestType: declare_1.RequestType.WXS,
        compileType: undefined
    },
    [ext.wxml]: {
        requestType: declare_1.RequestType.TEMPLATE,
        compileType: undefined
    },
    [ext.wxss]: {
        requestType: declare_1.RequestType.STYLE,
        compileType: undefined
    },
    [ext.less]: {
        requestType: declare_1.RequestType.STYLE,
        compileType: declare_1.CompileType.LESS
    },
    [ext.pcss]: {
        requestType: declare_1.RequestType.STYLE,
        compileType: declare_1.CompileType.PCSS
    },
    [ext.wxa]: {
        requestType: declare_1.RequestType.WXA,
        compileType: undefined
    },
    [ext.wxp]: {
        requestType: declare_1.RequestType.WXP,
        compileType: undefined
    },
    [ext.wxc]: {
        requestType: declare_1.RequestType.WXC,
        compileType: undefined
    }
};
