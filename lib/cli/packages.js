'use strict';
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
const class_1 = require("../class");
const util_1 = require("../util");
class PackagesCommand {
    constructor(options) {
        this.options = options;
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let { name } = this.options;
            if (!name) {
                util_1.log.error('[name] 名称不能为空');
                return;
            }
            let pkgName = util_1.default.getRealPkgName(name);
            let pageName = util_1.default.getRealPageName(name);
            let pkgPath = util_1.config.getPath('packages', pkgName);
            let pagePath = util_1.config.getPath('pages', pageName);
            fs.removeSync(pkgPath);
            fs.removeSync(pagePath);
            util_1.log.output(util_1.LogType.DELETE, `组件 "${pkgName}"`, pkgPath);
            util_1.log.output(util_1.LogType.DELETE, `页面 "${pageName}"`, pagePath);
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            util_1.default.setLernaConfig();
            let { LsCommand } = require('lerna');
            let lsCommand = new LsCommand(['ls'], {}, util_1.config.cwd);
            lsCommand
                .run()
                .then();
        });
    }
}
exports.PackagesCommand = PackagesCommand;
exports.default = {
    name: 'packages [name]',
    alias: 'pkgs',
    usage: '[name] [-l | --list] [-d | --delete]',
    description: '管理 MinUI 组件库',
    options: [
        ['-l, --list', '查看组件列表'],
        ['-d, --delete', '删除组件']
    ],
    on: {
        '--help': () => {
            new class_1.CLIExample('packages')
                .group('列表')
                .rule('--list')
                .group('删除')
                .rule('--delete loading');
        }
    },
    action(name, cliOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            util_1.default.overrideNpmLog();
            let packagesCommand = new PackagesCommand({
                name
            });
            if (cliOptions.delete) {
                yield packagesCommand.delete();
            }
            else {
                yield packagesCommand.list();
            }
        });
    }
};
