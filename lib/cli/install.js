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
const class_1 = require("../class");
const util_1 = require("../util");
const qa_1 = require("../qa");
class InstallCommand {
    constructor(options) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let { pkgNames } = this.options;
            yield this.install(pkgNames);
            util_1.default.buildNpmWXCs(pkgNames);
        });
    }
    install(pkgNames) {
        return __awaiter(this, void 0, void 0, function* () {
            pkgNames.forEach(pkgName => {
                util_1.log.msg(util_1.LogType.RUN, `npm install ${pkgName} --save`);
            });
            util_1.log.newline();
            yield util_1.exec('npm', ['install', ...pkgNames, '--save'], true, {
                cwd: util_1.config.cwd
            });
            util_1.log.newline();
        });
    }
}
exports.InstallCommand = InstallCommand;
exports.default = {
    name: 'install <name>',
    alias: 'i',
    usage: '<name>',
    description: '安装组件',
    options: [],
    on: {
        '--help': () => {
            new class_1.CLIExample('install')
                .group('安装loading组件')
                .rule('@minui/wxc-loading')
                .group('支持英文逗号分隔，来同时安装多个组件')
                .rule('@minui/wxc-loading,@minui/wxc-loading');
        }
    },
    action(name, cliOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let pkgNames = name ? name.trim().split(',') : [];
            try {
                yield qa_1.NpmDest.setAnswer();
                yield qa_1.BabelES6.setAnswer();
                let installCommand = new InstallCommand({
                    pkgNames
                });
                yield installCommand.run();
            }
            catch (err) {
                util_1.log.error(err);
            }
        });
    }
};
