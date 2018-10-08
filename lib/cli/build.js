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
const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
const class_1 = require("../class");
const declare_1 = require("../declare");
const util_1 = require("../util");
const qa_1 = require("../qa");
class BuildCommand {
    constructor(options = {}) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            util_1.Global.isDebug = false;
            switch (util_1.config.projectType) {
                case declare_1.ProjectType.Application:
                case declare_1.ProjectType.Component:
                    {
                        yield this.buildMinProject();
                    }
                    break;
                default:
                    {
                        yield this.buildNpmDepends();
                    }
                    break;
            }
        });
    }
    buildMinProject() {
        return __awaiter(this, void 0, void 0, function* () {
            let xcx = new class_1.Xcx({
                isClear: true,
                app: {
                    isSFC: true
                },
                traverse: {
                    enter(xcxNode) {
                        xcxNode.compile();
                    },
                    pages(pages) {
                        util_1.Global.saveAppConfig(pages);
                    }
                }
            });
            xcx.compile();
        });
    }
    buildNpmDepends() {
        return __awaiter(this, void 0, void 0, function* () {
            let pkgNames = [];
            let pkgPath = path.join(util_1.config.cwd, 'package.json');
            if (fs.existsSync(pkgPath)) {
                let pkgData = fs.readJsonSync(pkgPath);
                pkgNames = _.keys(_.assign(pkgData.dependencies, pkgData.devDependencies));
            }
            if (pkgNames.length === 0) {
                util_1.log.error(`Tui Build，没有需要编译的组件`);
                return;
            }
            yield qa_1.NpmDest.setAnswer();
            yield qa_1.BabelES6.setAnswer();
            util_1.default.buildNpmWXCs(pkgNames);
        });
    }
}
exports.BuildCommand = BuildCommand;
exports.default = {
    name: 'build',
    alias: '',
    usage: '',
    description: '编译项目',
    options: [],
    on: {
        '--help': () => {
            new class_1.CLIExample('build')
                .group('编译')
                .rule('');
        }
    },
    action(cliOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let buildCommand = new BuildCommand();
            yield buildCommand.run();
        });
    }
};
