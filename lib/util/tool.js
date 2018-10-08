"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
const updateNotifier = require("update-notifier");
const class_1 = require("../class");
const util_1 = require("../util");
const declare_1 = require("../declare");
const chalk = require('chalk');
const tasklist = require('tasklist');
function getModifiedTime(mpath) {
    let spath = pathToString(mpath);
    return isFile(spath) ? +fs.statSync(spath).mtime : 0;
}
exports.getModifiedTime = getModifiedTime;
function pathToString(mpath) {
    if (!_.isString(mpath)) {
        return path.join(mpath.dir, mpath.base);
    }
    return mpath;
}
exports.pathToString = pathToString;
function pathToParse(mpath) {
    if (_.isString(mpath)) {
        return path.parse(mpath);
    }
    return mpath;
}
exports.pathToParse = pathToParse;
function isFile(mpath) {
    let spath = pathToString(mpath);
    if (!fs.existsSync(spath))
        return false;
    return fs.statSync(spath).isFile();
}
exports.isFile = isFile;
function isDir(mpath) {
    let spath = pathToString(mpath);
    if (!fs.existsSync(spath))
        return false;
    return fs.statSync(spath).isDirectory();
}
exports.isDir = isDir;
function unlink(mpath) {
    let spath = pathToString(mpath);
    try {
        fs.unlinkSync(spath);
        return true;
    }
    catch (e) {
        return e;
    }
}
exports.unlink = unlink;
function readFile(mpath) {
    let spath = pathToString(mpath);
    let rst = '';
    try {
        rst = fs.readFileSync(spath, 'utf-8');
    }
    catch (e) {
        rst = '';
    }
    return rst;
}
exports.readFile = readFile;
function writeFile(mpath, data) {
    let ppath = pathToParse(mpath);
    let spath = pathToString(mpath);
    if (!this.isDir(ppath.dir)) {
        fs.ensureDirSync(ppath.dir);
    }
    fs.writeFileSync(spath, data);
}
exports.writeFile = writeFile;
function copyFile(srcFilePath, destFilePath) {
    let destDirPath = path.dirname(destFilePath);
    if (!this.isDir(destDirPath)) {
        fs.ensureDirSync(destDirPath);
    }
    fs.copySync(srcFilePath, destFilePath);
}
exports.copyFile = copyFile;
function overrideNpmLog() {
    let log = require('npmlog');
    ['info'].forEach((name) => {
        let _log = log[name];
        log[name] = function (...args) {
            this.heading = '';
            if (args[0] === 'version' || args[0] === 'versioning') {
                return;
            }
            _log.apply(this, args);
        };
    });
}
exports.overrideNpmLog = overrideNpmLog;
function setLernaConfig(version = 'independent') {
    let Repository = require('lerna/lib/Repository');
    if (_.isFunction(Repository)) {
        Repository.prototype._lernaJson = {
            lerna: '2.4.0',
            packages: getLernaPackageConfigs(),
            version
        };
    }
    else {
    }
}
exports.setLernaConfig = setLernaConfig;
function getLernaPackageConfigs() {
    return [
        `${util_1.config.packages}/*`
    ];
}
exports.getLernaPackageConfigs = getLernaPackageConfigs;
function getRealPkgName(name) {
    if (name && !new RegExp(`^${util_1.config.prefixStr}`).test(name)) {
        name = `${util_1.config.prefixStr}${name}`;
    }
    return name;
}
exports.getRealPkgName = getRealPkgName;
function getRealPkgNameWithScope(name) {
    if (name) {
        name = getRealPkgName(name);
        if (util_1.config.npm.scope && !new RegExp(`^${util_1.config.npm.scope}`).test(name)) {
            name = `${util_1.config.npm.scope}/${name}`;
        }
    }
    return name;
}
exports.getRealPkgNameWithScope = getRealPkgNameWithScope;
function getRealPageName(name) {
    return name.replace(new RegExp(`^${util_1.config.prefixStr}`), '');
}
exports.getRealPageName = getRealPageName;
function getScaffoldPath(scaffoldType, filePath = '') {
    return path.join(__dirname, `../../scaffold/${scaffoldType}`, filePath);
}
exports.getScaffoldPath = getScaffoldPath;
function getDestPackagePath(pkgName, filePath = '') {
    return util_1.config.getPath('packages', pkgName, filePath);
}
exports.getDestPackagePath = getDestPackagePath;
function getDestPagePath(pkgNameSuffix, filePath = '') {
    return util_1.config.getPath('pages', pkgNameSuffix, filePath);
}
exports.getDestPagePath = getDestPagePath;
function getDestProjectPath(projectName, filePath = '') {
    return path.join(util_1.config.cwd, projectName, filePath);
}
exports.getDestProjectPath = getDestProjectPath;
function buildNpmWXCs(pkgNames) {
    let entries = [];
    let requests = pkgNames.filter(pkgName => {
        let pkgPath = util_1.config.getPath('npm.src', pkgName, 'package.json');
        if (!fs.existsSync(pkgPath)) {
            return false;
        }
        let pkgData = fs.readJsonSync(pkgPath);
        if (!_.get(pkgData, 'minConfig.component') && !_.get(pkgData, 'config.min.component')) {
            return false;
        }
        let entryConfig = _.get(pkgData, 'minConfig.entry');
        if (_.isArray(entryConfig) && entryConfig.length) {
            entryConfig.forEach(entry => {
                entries.push(pkgName + '/' + entry);
            });
            return false;
        }
        return true;
    });
    requests = _.uniq(requests.concat(entries));
    let xcxNodes = [];
    requests.forEach(request => {
        let xcxNode = class_1.XcxNode.create({
            request,
            requestType: declare_1.RequestType.WXC,
            isMain: true,
            parent: util_1.config.cwd
        });
        if (xcxNode !== null) {
            xcxNodes.push(xcxNode);
        }
    });
    class_1.XcxTraverse.traverse(xcxNodes, {
        enter(xcxNode) {
            xcxNode.compile();
        }
    });
}
exports.buildNpmWXCs = buildNpmWXCs;
function pageName2Pages(name = []) {
    let names = [];
    if (_.isArray(name)) {
        names = name;
    }
    else if (name && name.trim()) {
        names = name.trim().split(',').map(value => value.trim());
    }
    let pages = names.map(name => {
        return `pages/${name}/index`;
    });
    return pages;
}
exports.pageName2Pages = pageName2Pages;
function checkLocalImgUrl(url) {
    if (url.indexOf(';base64,') !== -1) {
        return false;
    }
    if (/^(https?\:|\:\/\/)/.test(url)) {
        return false;
    }
    return true;
}
exports.checkLocalImgUrl = checkLocalImgUrl;
function camelCase2Dash(str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}
exports.camelCase2Dash = camelCase2Dash;
function dash2CamelCase(str) {
    return str.replace(/\-([a-z])/gi, function (m, w) {
        return w.toUpperCase();
    });
}
exports.dash2CamelCase = dash2CamelCase;
function isMustcacheValue(value) {
    return /\{\{/.test(value);
}
exports.isMustcacheValue = isMustcacheValue;
function getMustcacheValue(value) {
    return isMustcacheValue(value) ? value : `{{ ${value} }}`;
}
exports.getMustcacheValue = getMustcacheValue;
function checkWechatdevtoolsRunningOnWindows() {
    if (process.platform === 'win32') {
        return new Promise((resolve, reject) => {
            tasklist().then((tasks) => {
                let wdtTasks = tasks.filter((task) => task.imageName.indexOf('wechatdevtools') > -1);
                resolve(wdtTasks.length > 0);
            });
        });
    }
    return Promise.resolve(false);
}
exports.checkWechatdevtoolsRunningOnWindows = checkWechatdevtoolsRunningOnWindows;
function notifyPackageUpdate(data) {
    if (fs.existsSync(data.packagePath)) {
        const pkg = require(data.packagePath);
        const notifier = updateNotifier({
            pkg,
            updateCheckInterval: 0
        });
        if (notifier.update) {
            console.log(`${chalk.yellow(data.packageName)} update available ` + chalk.dim(notifier.update.current) + chalk.reset(' → ') +
                chalk.green(notifier.update.latest) + ' \nRun ' + chalk.cyan(`npm i ${data.isGlobal ? '-g ' : ''}${data.packageName}`) + ' to update');
        }
    }
}
exports.notifyPackageUpdate = notifyPackageUpdate;
