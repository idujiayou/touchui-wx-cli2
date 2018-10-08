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
const glob = require("glob");
const fs = require("fs-extra");
const path = require("path");
const memFs = require("mem-fs");
const editor = require("mem-fs-editor");
const changeCase = require("change-case");
const _ = require("lodash");
const inquirer_1 = require("inquirer");
const class_1 = require("../class");
const declare_1 = require("../declare");
const util_1 = require("../util");
const dev_1 = require("./dev");
class NewCommand {
    constructor(options) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let { name = '', pagePath, title, newType, newAfterContinueBuild } = this.options;
            let answers = yield getAnswers(this.options);
            let defaults = {
                newType,
                pkgName: util_1.default.getRealPkgName(name),
                pageName: pagePath,
                title
            };
            answers = _.merge({}, defaults, answers);
            yield this.newScaffold(answers);
            yield this.updateHomeMenu(answers);
            if (newAfterContinueBuild) {
                yield this.buildPage(answers);
            }
        });
    }
    newScaffold(answers) {
        return __awaiter(this, void 0, void 0, function* () {
            let { pkgName = '', pageName = '', title = '' } = answers;
            let pkgNameSuffix = util_1.default.getRealPageName(pkgName);
            let date = new Date();
            let newData = {
                npmScopeStr: util_1.filterNpmScope(util_1.config.npm.scope),
                version: '1.0.0',
                pkgName,
                pkgNameToPascalCase: changeCase.pascalCase(pkgName),
                pkgNameSuffix,
                pkgNameSuffixToPascalCase: changeCase.pascalCase(pkgNameSuffix),
                pageName,
                pageNameToPascalCase: changeCase.pascalCase(pageName),
                title,
                description: `${title} - 小程序组件`,
                isPlugin: answers.plugin,
                time: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            };
            switch (util_1.config.projectType) {
                case declare_1.ProjectType.Component:
                    {
                        switch (answers.newType) {
                            case declare_1.NewType.Package:
                                {
                                    yield this.newPackage(newData);
                                }
                                break;
                            case declare_1.NewType.Page:
                                {
                                    yield this.newPage(newData);
                                }
                                break;
                            default:
                                return Promise.reject('Tui New 失败：未知项目类型，无法继续创建');
                        }
                    }
                    break;
                case declare_1.ProjectType.Application:
                    {
                        yield this.newPage(newData);
                    }
                    break;
                default:
                    return Promise.reject('Tui New 失败：未知项目类型，无法继续创建');
            }
        });
    }
    newPackage(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            let { pkgName, pkgNameSuffix } = newData;
            const store = memFs.create();
            const fsEditor = editor.create(store);
            let destPackagePath = util_1.default.getDestPackagePath(pkgName);
            let destPagePath = util_1.default.getDestPagePath(pkgNameSuffix);
            if (fs.existsSync(destPackagePath)) {
                util_1.log.output(util_1.LogType.ERROR, `创建失败，因为组件 "${pkgName}" 已经存在`, destPackagePath);
                return;
            }
            if (fs.existsSync(destPagePath)) {
                util_1.log.output(util_1.LogType.ERROR, `创建失败，因为页面 "${pkgNameSuffix}" 已经存在`, destPagePath);
                return;
            }
            fsEditor.copyTpl(util_1.default.getScaffoldPath(declare_1.ScaffoldType.Package), destPackagePath, newData, null, {
                globOptions: {
                    dot: true
                }
            });
            fsEditor.copyTpl(util_1.default.getScaffoldPath(declare_1.ScaffoldType.Example), destPagePath, newData);
            return new Promise((resolve, reject) => {
                fsEditor.commit(() => {
                    util_1.log.newline();
                    util_1.log.output(util_1.LogType.CREATE, `组件 "${pkgName}"`, destPackagePath);
                    glob.sync('**', {
                        cwd: destPackagePath
                    }).forEach(file => util_1.log.msg(util_1.LogType.COPY, file));
                    util_1.log.msg(util_1.LogType.COMPLETE, `组件 "${pkgName}" 创建完成`);
                    util_1.log.newline();
                    util_1.log.output(util_1.LogType.CREATE, `示例页面 "${pkgNameSuffix}"`, destPagePath);
                    glob.sync('**', {
                        cwd: destPagePath
                    }).forEach(file => util_1.log.msg(util_1.LogType.COPY, file));
                    util_1.log.msg(util_1.LogType.COMPLETE, `示例页面 "${pkgNameSuffix}" 创建完成`);
                    resolve();
                });
            });
        });
    }
    newPage(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            let { pageName } = newData;
            let pagePath = 'pages/' + pageName;
            pagePath = pagePath.replace(/\\/g, '/');
            if (path.extname(pageName) !== util_1.config.ext.wxp) {
                pageName += util_1.config.ext.wxp;
            }
            const store = memFs.create();
            const fsEditor = editor.create(store);
            let destPagePath = util_1.default.getDestPagePath(pageName);
            if (fs.existsSync(destPagePath)) {
                util_1.log.output(util_1.LogType.ERROR, `创建失败，因为页面 "${pageName}" 已经存在`, destPagePath);
                return;
            }
            fsEditor.copyTpl(util_1.default.getScaffoldPath(declare_1.ScaffoldType.Page, 'index.wx'), destPagePath, newData);
            yield this.updateConfigPages(pagePath);
            return new Promise((resolve, reject) => {
                fsEditor.commit(() => {
                    util_1.log.newline();
                    util_1.log.output(util_1.LogType.CREATE, `页面 "${pageName}"`, destPagePath);
                    util_1.log.msg(util_1.LogType.COMPLETE, `页面 "${pageName}" 创建完成`);
                    resolve();
                });
            });
        });
    }
    updateConfigPages(pagePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let dest = path.join(util_1.config.cwd, util_1.config.src, 'app.wxa');
            let source = util_1.default.readFile(dest);
            let { script: { code: scriptCode }, style: { code: styleCode } } = util_1.dom.getSFC(source);
            let node = util_1.scriptAstUtil.transform(scriptCode);
            let pagesNode = util_1.scriptAstUtil.getNodeFromRootByPath(node, 'config.pages');
            pagesNode.value.elements.push({
                type: 'StringLiteral',
                value: pagePath
            });
            scriptCode = util_1.scriptAstUtil.transformFromAst(node);
            let code = util_1.dom.combineCode(`<page></page>`, scriptCode, styleCode);
            util_1.default.writeFile(dest, code);
        });
    }
    updateHomeMenu(answers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (answers.newType !== declare_1.NewType.Package) {
                return;
            }
            let { pkgName = '', title = '' } = answers;
            let homeConfigPath = util_1.config.getPath('pages', 'home', 'config.json');
            if (!fs.existsSync(homeConfigPath)) {
                return;
            }
            let homeConfigData = fs.readJsonSync(homeConfigPath);
            let pages = _.get(homeConfigData, 'menus[0].pages');
            if (_.isArray(pages)) {
                let pageName = util_1.default.getRealPageName(pkgName);
                pages.unshift({
                    id: pageName,
                    name: title,
                    icon: '',
                    code: ''
                });
                util_1.default.writeFile(homeConfigPath, JSON.stringify(homeConfigData, null, 2));
            }
        });
    }
    buildPage(answers) {
        return __awaiter(this, void 0, void 0, function* () {
            util_1.log.newline();
            util_1.log.msg(util_1.LogType.RUN, 'tui build');
            util_1.log.msg(util_1.LogType.INFO, '编译中, 请耐心等待...');
            switch (answers.newType) {
                case declare_1.NewType.Package:
                    break;
                case declare_1.NewType.Page:
                    break;
            }
            let devCommand = new dev_1.DevCommand({});
            yield devCommand.run();
        });
    }
}
exports.NewCommand = NewCommand;
exports.default = {
    name: 'new [name]',
    alias: '',
    usage: '[name] [-t | --title <title>]',
    description: '新建组件或页面',
    options: [
        ['-t, --title <title>', '设置标题'],
        ['-n, --newType <new type>', '设置文件类型'],
        ['-p, --pagePath <page path>', '设置文件路径']
    ],
    on: {
        '--help': () => {
            new class_1.CLIExample('new')
                .group('新建组件')
                .rule('loading');
        }
    },
    action(name = '', options) {
        return __awaiter(this, void 0, void 0, function* () {
            _.merge(options, {
                name,
                newAfterContinueBuild: true
            });
            let newCommand = new NewCommand(options);
            yield newCommand.run();
        });
    }
};
function getAnswers(options) {
    let { name = '', title = '', newType = '', pagePath = '' } = options;
    let { projectType, prefix, prefixStr } = util_1.config;
    const CREATE_QUESTIONS = [
        {
            type: 'list',
            message: '请选择新建类型',
            name: 'newType',
            choices: () => {
                return [{
                        name: '新建组件',
                        value: declare_1.NewType.Package
                    }, {
                        name: '新建页面',
                        value: declare_1.NewType.Page
                    }];
            },
            when(answers) {
                return !newType && projectType === declare_1.ProjectType.Component;
            }
        }, {
            type: 'input',
            message: '请设置新组件的英文名称',
            name: 'pkgName',
            filter(input) {
                input = input.trim();
                return util_1.default.getRealPkgName(input);
            },
            validate(input, answers) {
                if (input === '') {
                    return '请输入名称';
                }
                else if (input === prefixStr) {
                    return `格式不正确，例如输入'loading' 或 '${prefixStr}loading'`;
                }
                else if (/^-/.test(input)) {
                    return '格式不正确，不能以“-”开始';
                }
                else if (/-$/.test(input)) {
                    return '格式不正确，不能以“-”结束';
                }
                else if (/[^a-z-]+/.test(input)) {
                    return `格式不正确，只能是小写字母，支持“-”分隔`;
                }
                return true;
            },
            when(answers) {
                let $newType = answers.newType || newType;
                return $newType === declare_1.NewType.Package && (!name || name === '-' || name === prefix || name === prefixStr);
            }
        }, {
            type: 'input',
            message: '请设置新组件的中文标题',
            name: 'title',
            filter(input) {
                return input.trim();
            },
            validate(input, answers) {
                if (input === '') {
                    return '请输入标题';
                }
                return true;
            },
            when(answers) {
                let $newType = answers.newType || newType;
                return $newType === declare_1.NewType.Package && !title;
            }
        }, {
            type: 'input',
            message: '请设置新页面的英文名称',
            name: 'pageName',
            filter(input) {
                return input.trim();
            },
            validate(input, answers) {
                if (input === '') {
                    return '请输入名称';
                }
                return true;
            },
            when(answers) {
                let $newType = answers.newType || newType;
                return !pagePath && ($newType === declare_1.NewType.Page || projectType === declare_1.ProjectType.Application) && !name;
            }
        }
    ];
    return inquirer_1.prompt(CREATE_QUESTIONS);
}
