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
const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");
const class_1 = require("../class");
const util_1 = require("../util");
const qa_1 = require("../qa");
class UpdateCommand {
    constructor(options) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let { pkgNames = [] } = this.options;
            yield this.update(pkgNames);
            util_1.default.buildNpmWXCs(pkgNames);
        });
    }
    update(pkgNames) {
        return __awaiter(this, void 0, void 0, function* () {
            pkgNames.forEach(pkgName => {
                util_1.log.msg(util_1.LogType.RUN, `npm update ${pkgName}`);
            });
            util_1.log.newline();
            yield util_1.exec('npm', ['update', ...pkgNames], true, {
                cwd: util_1.config.cwd
            });
            util_1.log.newline();
        });
    }
}
exports.UpdateCommand = UpdateCommand;
exports.default = {
    name: 'update [name]',
    alias: 'u',
    usage: '[name]',
    description: '更新组件',
    options: [],
    on: {
        '--help': () => {
            new class_1.CLIExample('update')
                .group('更新已安装的组件')
                .rule('')
                .group('更新loading组件')
                .rule('@minui/wxc-loading')
                .group('支持英文逗号分隔，来同时更新多个组件')
                .rule('@minui/wxc-loading,@minui/wxc-loading');
        }
    },
    action(name, cliOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let pkgNames = getPkgNames(name);
            if (pkgNames.length === 0) {
                util_1.log.warn('没有找到需要更新的组件');
                return;
            }
            try {
                yield qa_1.NpmDest.setAnswer();
                yield qa_1.BabelES6.setAnswer();
                let updateCommand = new UpdateCommand({
                    pkgNames
                });
                yield updateCommand.run();
            }
            catch (err) {
                util_1.log.error(err);
            }
        });
    }
};
function getPkgNames(name) {
    let pkgNames = [];
    if (name && name.trim()) {
        pkgNames = name.trim().split(',');
    }
    else {
        let pkgPath = path.join(util_1.config.cwd, 'package.json');
        if (fs.existsSync(pkgPath)) {
            let pkgData = fs.readJsonSync(pkgPath);
            pkgNames = _.keys(_.assign(pkgData.dependencies, pkgData.devDependencies));
        }
    }
    return pkgNames;
}
