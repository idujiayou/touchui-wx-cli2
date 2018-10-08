"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
const declare_1 = require("../declare");
const util_1 = require("../util");
const packageMainCache = Object.create(null);
const requestPathCache = Object.create(null);
const compatibleTypes = {
    'IMAGE': '.svg'
};
function getStat(requestPath) {
    let isFile = util_1.default.isFile(requestPath);
    let isDir = isFile ? false : util_1.default.isDir(requestPath);
    return {
        isFile,
        isDir
    };
}
function readPackageMain(requestPath) {
    let pkgMain = '';
    let entry = packageMainCache[requestPath];
    if (entry) {
        return entry;
    }
    let jsonPath = path.resolve(requestPath, 'package.json');
    if (!fs.existsSync(jsonPath)) {
        return false;
    }
    try {
        let json = fs.readJsonSync(jsonPath);
        pkgMain = packageMainCache[requestPath] = json.main;
    }
    catch (err) {
        err.path = jsonPath;
        err.message = 'Error parsing ' + jsonPath + ': ' + err.message;
        throw err;
    }
    return pkgMain;
}
function tryPackage(requestPath, exts) {
    let pkgMain = readPackageMain(requestPath);
    if (!pkgMain) {
        return false;
    }
    let filename = path.resolve(requestPath, pkgMain);
    return tryFile(filename) ||
        tryExtensions(filename, exts) ||
        tryExtensions(path.resolve(filename, 'index'), exts);
}
function tryFile(requestPath) {
    return getStat(requestPath).isFile && requestPath;
}
function tryExtensions(requestPath, exts) {
    for (let i = 0; i < exts.length; i++) {
        let filename = tryFile(requestPath + exts[i]);
        if (filename) {
            return filename;
        }
    }
    return false;
}
function inAlias(request) {
    return getAlias(request) !== null;
}
function getAlias(request) {
    let spes = request.split('/');
    for (let key in util_1.config.alias) {
        if (spes[0] === key) {
            return {
                name: key,
                value: util_1.config.alias[key]
            };
        }
    }
    return null;
}
function inScope(request) {
    let spes = request.split('/');
    return spes[0] === util_1.config.npm.scope;
}
function isWxcPackage(request, requestType) {
    if (requestType !== declare_1.RequestType.WXC) {
        return false;
    }
    if (request.charAt(0) === '.') {
        return false;
    }
    if (request.split('/')[0] === util_1.config.src) {
        return false;
    }
    if (request.split('/')[0] === util_1.config.packages) {
        return false;
    }
    if (!inScope(request) && inAlias(request)) {
        return false;
    }
    return true;
}
function src2destRelative(srcRelative, isPublish) {
    let destRelative = srcRelative;
    if (!isPublish) {
        if (util_1.config.src === '') {
            if (destRelative.startsWith('node_modules')) {
                if (destRelative.indexOf('touchui-wx-components') > -1 && destRelative.indexOf('index.wxc') > -1) {
                    destRelative = destRelative.replace('src/index.wxc', 'dist/index.wxc');
                    destRelative = destRelative.replace('src\\index.wxc', 'dist\\index.wxc');
                }
            }
            else {
                destRelative = util_1.config.dest + '/' + destRelative;
            }
        }
        else {
            destRelative = destRelative.replace(new RegExp(`^${util_1.config.src}`), util_1.config.dest);
        }
    }
    destRelative = destRelative.replace(new RegExp(`^${util_1.config.packages}`), (match) => {
        return util_1.config.npm.dest;
    });
    destRelative = destRelative.replace(new RegExp(`(^|\\${path.sep})${util_1.config.npm.src}`, 'ig'), (match, $1) => {
        let npmDest = util_1.config.npm.dest;
        if ($1 === '') {
            return npmDest;
        }
        else if ($1 === path.sep) {
            return npmDest.split(path.sep).slice(1).join(path.sep);
        }
        else {
            return match;
        }
    });
    destRelative = destRelative.replace(new RegExp(`(\\${path.sep}${util_1.config.prefixStr}[a-z-]+\\${path.sep})([a-z]+)`), (match, $1, $2) => {
        if ($2 === util_1.config.package.src) {
            return `${$1}${util_1.config.package.dest}`;
        }
        return match;
    });
    return destRelative;
}
function getRequestType(ext) {
    let { requestType = undefined } = declare_1.LangTypes[ext] || {};
    return requestType;
}
function getRequestLookupExts(requestType) {
    let exts = [];
    _.forIn(declare_1.LangTypes, (value, key) => {
        if (requestType === value.requestType) {
            exts.push(key);
        }
    });
    return exts;
}
function getMatchRequest(request, requestType) {
    let ext = path.extname(request);
    let exts = [];
    if (ext) {
        ext = _.findKey(util_1.config.ext, value => value === ext) ? ext : '';
    }
    if (!ext && !requestType) {
        throw new Error(`Ext 和 RequestType 不能同时为空`);
    }
    if (ext && requestType) {
        if (getRequestType(ext) !== requestType && !compatibleTypes[requestType]) {
            throw new Error(`Ext 和 RequestType 同时存在，但通过 Ext 找到的 RequestType 与实际的不符合`);
        }
    }
    else if (!ext && requestType) {
        exts = [
            ...exts,
            ...getRequestLookupExts(requestType)
        ];
    }
    else if (ext && !requestType) {
        requestType = getRequestType(ext);
    }
    if (!requestType) {
        throw new Error('没有找到匹配的 RequestType，请确认是否将 Ext 与 RequestType 进行关联');
    }
    return {
        lookupExts: exts,
        requestType
    };
}
function supExtName(filePath, defExtName = util_1.config.ext.js) {
    if (path.extname(filePath) === '') {
        return `${filePath}${defExtName}`;
    }
    return filePath;
}
function findPath(request, requestType, paths, exts) {
    if (!paths || paths.length === 0) {
        return false;
    }
    let cacheKey = request + '\x00' + (paths.length === 1 ? paths[0] : paths.join('\x00'));
    let entry = requestPathCache[cacheKey];
    if (entry) {
        if (util_1.default.isFile(entry)) {
            return entry;
        }
        else {
            delete requestPathCache[cacheKey];
        }
    }
    let trailingSlash = request.length > 0 &&
        request.charCodeAt(request.length - 1) === 47;
    for (let i = 0; i < paths.length; i++) {
        let curPath = paths[i];
        let curRequest = request;
        if (!curPath || !getStat(curPath).isDir) {
            continue;
        }
        if (isWxcPackage(curRequest, requestType)) {
            let seps = curRequest.split('/');
            let scope = '';
            if (seps.length > 0 && seps[0].startsWith('@')) {
                if (seps.length === 1) {
                    throw new Error(`引用路径错误${curRequest}`);
                }
                scope = seps[0];
                seps.shift();
            }
            if (seps.length === 1) {
                seps = seps.concat([util_1.config.package.src, util_1.config.package.default]);
            }
            else if (seps[0] === 'touchui-wx-components') {
                seps.push('src');
            }
            else if (seps.length > 1 && seps[1] !== 'src') {
                seps.splice(1, 0, util_1.config.package.src);
            }
            if (scope) {
                seps.unshift(scope);
            }
            curRequest = seps.join('/');
        }
        if (curPath === util_1.config.cwd) {
            let alias = getAlias(curRequest);
            if (alias) {
                let spes = curRequest.split('/');
                spes.shift();
                spes.unshift(alias.value);
                curRequest = spes.join('/');
            }
        }
        let curPathPkgPath = path.join(curPath, 'package.json');
        if (/node_modules\//.test(curPath) && fs.existsSync(curPathPkgPath)) {
            let { browser = {} } = fs.readJSONSync(curPathPkgPath);
            for (const key in browser) {
                let aPath = supExtName(path.join(curPath, key));
                let bPath = supExtName(path.join(curPath, curRequest));
                if (aPath === bPath) {
                    curRequest = browser[key];
                }
            }
        }
        let basePath = path.resolve(curPath, curRequest);
        let filename;
        let stat = getStat(basePath);
        if (!trailingSlash) {
            if (stat.isFile) {
                filename = basePath;
            }
            else if (stat.isDir) {
                filename = tryPackage(basePath, exts);
            }
            if (!filename) {
                filename = tryExtensions(basePath, exts);
            }
        }
        if (!filename && stat.isDir) {
            filename = tryPackage(basePath, exts);
        }
        if (!filename && stat.isDir) {
            filename = tryExtensions(path.resolve(basePath, 'index'), exts);
        }
        if (filename) {
            requestPathCache[cacheKey] = filename;
            return filename;
        }
    }
    return false;
}
function resolveLookupNpmPaths(parent) {
    let paths = [path.join(util_1.config.cwd, 'node_modules')];
    let relPath = path.relative(util_1.config.cwd, parent);
    if (!new RegExp(`^(node_modules|${util_1.config.packages})\\${path.sep}`).test(relPath)) {
        return paths;
    }
    let spes = relPath.split(path.sep);
    for (let i = 0; i < spes.length; i++) {
        let name = spes[i];
        if (name === 'node_modules' || name === util_1.config.npm.scope) {
            continue;
        }
        let lookup = spes.slice(0, i + 1).join(path.sep);
        if (lookup === util_1.config.src || lookup === util_1.config.packages) {
            continue;
        }
        paths.unshift(path.join(util_1.config.cwd, lookup, 'node_modules'));
    }
    return paths;
}
function resolveLookupPaths(request, parent) {
    if (parent) {
        parent = path.isAbsolute(parent) ? parent : path.join(util_1.config.cwd, parent);
        parent = util_1.default.isFile(parent) ? path.dirname(parent) : parent;
    }
    if (inAlias(request)) {
        let paths = [
            util_1.config.cwd
        ];
        if (inScope(request)) {
            paths = [
                ...paths,
                ...resolveLookupNpmPaths(parent || util_1.config.cwd)
            ];
        }
        return paths;
    }
    let defRelPath = parent || util_1.config.getPath('src');
    if (request.charAt(0) === '.') {
        return [defRelPath];
    }
    if (request.charAt(0) !== '@' && path.extname(request).length > 1) {
        if (fs.existsSync(path.join(defRelPath, request))) {
            return [defRelPath];
        }
    }
    return [
        util_1.config.getPath('packages'),
        ...resolveLookupNpmPaths(parent || util_1.config.cwd)
    ];
}
function resolveDep(requestOptions) {
    let { request, requestType: type, parent, isMain, isPublish, isThreeNpm = false } = requestOptions;
    if (!request && !parent) {
        throw new Error('依赖分析错误，request 和 parent 不能同时为空');
    }
    if (request && path.isAbsolute(request)) {
        if (isMain) {
            parent = path.dirname(request);
            request = `./${path.basename(request)}`;
        }
        else {
            throw new Error(`依赖分析错误，非入口文件 request 不能为绝对路径`);
        }
    }
    if (!request && parent) {
        if (isMain) {
            parent = path.dirname(parent);
            request = `./${path.basename(parent)}`;
        }
        else {
            throw new Error(`依赖分析错误，非入口文件 request 不能为空`);
        }
    }
    let rawRequest = url.parse(request).pathname || '';
    let { requestType, lookupExts } = getMatchRequest(rawRequest, type);
    let lookupPaths = resolveLookupPaths(rawRequest, parent);
    let srcRelative = '';
    let ext = '';
    let dest = '';
    let destRelative = '';
    let $isThreeNpm = false;
    let src = findPath(rawRequest, requestType, lookupPaths, lookupExts) || '';
    if (src) {
        srcRelative = path.relative(util_1.config.cwd, src);
        ext = path.extname(src);
        destRelative = src2destRelative(srcRelative, isPublish);
        dest = path.join(util_1.config.cwd, destRelative);
        if (srcRelative.split('/')[0] === 'node_modules') {
            if (rawRequest.charAt(0) === '.') {
                $isThreeNpm = isThreeNpm;
            }
            else if (ext !== util_1.config.ext.wxc) {
                $isThreeNpm = true;
            }
        }
    }
    return {
        request,
        requestType,
        src,
        srcRelative,
        ext,
        dest,
        destRelative,
        isThreeNpm: $isThreeNpm
    };
}
exports.resolveDep = resolveDep;
