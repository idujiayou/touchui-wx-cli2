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
const _ = require("lodash");
const inquirer_1 = require("inquirer");
const class_1 = require("../class");
const util_1 = require("../util");
class PublishCommand {
    constructor(options) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let { pkgName, lernaOptions = {} } = this.options;
            let publishArgs = {
                exact: true,
                message: 'Publish by MinDev'
            };
            if (pkgName) {
                let pkgInfo = getPackages().find((item) => item.name === pkgName);
                if (pkgInfo) {
                    _.merge(publishArgs, {
                        scope: pkgInfo.name
                    });
                }
                else {
                    util_1.log.error(`没有找到组件 ${pkgName}`);
                    return;
                }
            }
            if (_.isObject(lernaOptions)) {
                _.merge(publishArgs, lernaOptions);
            }
            util_1.default.setLernaConfig();
            let { PublishCommand } = require('lerna');
            let publishCommand = new PublishCommand(['publish'], publishArgs, util_1.config.cwd);
            publishCommand
                .run()
                .then();
        });
    }
}
exports.PublishCommand = PublishCommand;
exports.default = {
    name: 'publish [name]',
    alias: 'pub',
    usage: '[name]',
    description: '发布组件',
    options: [],
    on: {
        '--help': () => {
            new class_1.CLIExample('publish')
                .group('发布')
                .rule('');
        }
    },
    action(pkgName, cliOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            util_1.default.overrideNpmLog();
            pkgName = pkgName ? util_1.default.getRealPkgNameWithScope(pkgName) : '';
            let options = yield getOptions(pkgName);
            let defaults = {
                pkgName
            };
            options = _.merge(defaults, options);
            let publishCommand = new PublishCommand(options);
            yield publishCommand.run();
        });
    }
};
function getOptions(pkgName) {
    const CREATE_QUESTIONS = [
        {
            type: 'list',
            message: '请选择发布方式',
            name: 'mode',
            default: '0',
            choices: () => {
                return [{
                        name: '手动选择要发布的组件',
                        value: '0'
                    }, {
                        name: '发布项目里的每个组件',
                        value: '1'
                    }];
            },
            when(answers) {
                return !pkgName;
            }
        }, {
            type: 'list',
            message: '请选择要发布的组件',
            name: 'pkgName',
            choices: () => {
                return getPackages().map((pkg, index) => {
                    return {
                        name: pkg.name + ' @' + pkg.version,
                        value: pkg.name
                    };
                });
            },
            when(answers) {
                return answers.mode === '0';
            }
        }
    ];
    return inquirer_1.prompt(CREATE_QUESTIONS);
}
function getPackages() {
    let PackageUtilities = require('lerna/lib/PackageUtilities');
    return PackageUtilities.getPackages({
        packageConfigs: util_1.default.getLernaPackageConfigs(),
        rootPath: util_1.config.cwd
    });
}
