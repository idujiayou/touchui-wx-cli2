"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function filterPrefix(prefix = '') {
    prefix = (prefix || '').trim();
    if (/[-]+$/.test(prefix)) {
        return prefix;
    }
    else if (prefix !== '') {
        return `${prefix}-`;
    }
    return prefix;
}
exports.filterPrefix = filterPrefix;
function filterNpmScope(scope = '') {
    scope = (scope || '').trim();
    if (scope === '') {
        return '';
    }
    if (!scope.startsWith('@')) {
        scope = `@${scope}`;
    }
    if (!scope.endsWith('/')) {
        scope = `${scope}/`;
    }
    return scope;
}
exports.filterNpmScope = filterNpmScope;
