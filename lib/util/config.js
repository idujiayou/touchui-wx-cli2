"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");
const config_1 = require("../config");
const util_1 = require("../util");
const CUSTOM_CONFIG_MEMBER = [
    'style',
    'compilers',
    'src',
    'packages',
    'dest',
    'alias',
    'prefix',
    'npm.scope',
    'npm.dest',
    'projectType'
];
function getCustomConfigFilePath(cwd = config_1.default.cwd) {
    return path.join(cwd, config_1.default.filename);
}
function getProjectPackagePath(cwd = config_1.default.cwd) {
    return path.join(cwd, 'package.json');
}
function getCustomConfig(cwd = config_1.default.cwd) {
    const pkgPath = getProjectPackagePath(cwd);
    const filePath = getCustomConfigFilePath(cwd);
    let customConfigFromPkg = {};
    let customConfigFromFile = {};
    if (fs.existsSync(pkgPath)) {
        customConfigFromPkg = _.pick(fs.readJsonSync(pkgPath)['minConfig'] || {}, CUSTOM_CONFIG_MEMBER);
    }
    if (fs.existsSync(filePath)) {
        customConfigFromFile = _.pick(fs.readJsonSync(filePath), CUSTOM_CONFIG_MEMBER);
    }
    let customConfig = _.merge({}, customConfigFromPkg, customConfigFromFile);
    return {
        customConfig,
        customConfigFromPkg,
        customConfigFromFile
    };
}
let scopeAliasMap = {};
function convertConfig(defaultConfig, customConfig = {}) {
    let config = _.merge({}, defaultConfig, customConfig);
    function engine(rootConfig, childConfig = rootConfig) {
        _.forIn(childConfig, (value, key) => {
            if (_.isObject(value)) {
                engine(rootConfig, value);
            }
            else if (_.isArray(value)) {
                value.forEach((item) => {
                    engine(rootConfig, item);
                });
            }
            else if (_.isString(value)) {
                childConfig[key] = value.replace(/\{\{([a-z0-9]+)\}\}/g, (match, $1) => {
                    if (_.isUndefined(rootConfig[$1]) || !_.isString(rootConfig[$1])) {
                        throw new Error(`找不到变量 ${$1}`);
                    }
                    return rootConfig[$1];
                });
            }
        });
    }
    engine(config);
    _.forIn(scopeAliasMap, (value, key) => {
        delete config.alias[key];
    });
    if (config.npm.scope && !config.alias[config.npm.scope]) {
        scopeAliasMap[config.npm.scope] = true;
        config.alias[config.npm.scope] = config.packages;
    }
    return config;
}
let defaultConfig = convertConfig(config_1.default);
exports.defaultConfig = defaultConfig;
let { customConfig, customConfigFromPkg, customConfigFromFile } = getCustomConfig();
exports.customConfig = customConfig;
exports.customConfigFromPkg = customConfigFromPkg;
exports.customConfigFromFile = customConfigFromFile;
exports.config = Object.assign({ get prefixStr() {
        return util_1.filterPrefix(this.prefix);
    } }, convertConfig(defaultConfig, customConfig), { getPath(name, ...paths) {
        let names = name.split('.');
        let value = names.reduce((previousValue, currentValue) => {
            return previousValue[currentValue];
        }, this);
        return path.join(this.cwd, value, ...paths);
    },
    reload(cwd = config_1.default.cwd) {
        let { customConfig: $customConfig, customConfigFromPkg: $customConfigFromPkg, customConfigFromFile: $customConfigFromFile } = getCustomConfig(cwd);
        exports.customConfig = $customConfig;
        exports.customConfigFromPkg = $customConfigFromPkg;
        exports.customConfigFromFile = $customConfigFromFile;
        _.assign(this, convertConfig(defaultConfig, $customConfig), {
            cwd
        });
    },
    update(newConfig) {
        _.merge(this, newConfig);
    },
    updateCustomFile(newConfig) {
        _.merge(customConfigFromFile, newConfig || {});
        _.merge(customConfig, customConfigFromPkg, customConfigFromFile);
        _.merge(this, convertConfig(defaultConfig, customConfig));
        let filePath = getCustomConfigFilePath();
        fs.writeFileSync(filePath, JSON.stringify(customConfigFromFile, null, 2));
    } });
