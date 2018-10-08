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
const path = require("path");
const glob = require("glob");
const _ = require("lodash");
const changeCase = require("change-case");
const inquirer_1 = require("inquirer");
const memFs = require("mem-fs");
const editor = require("mem-fs-editor");
const class_1 = require("../class");
const declare_1 = require("../declare");
const util_1 = require("../util");
const new_1 = require("./new");
class InitCommand {
    constructor(options) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let { dest, initAfterContinueNewPackage } = this.options;
            yield this.copyScaffold();
            yield this.updateConfig();
            if (initAfterContinueNewPackage) {
                yield this.newPackage();
            }
            yield this.npmInstall();
            yield this.minBuild();
            util_1.log.newline();
            util_1.log.msg(util_1.LogType.TIP, `项目创建成功，已输出小程序源码到${dest}/文件夹中。先用右键启动开发服务，这样每次保存后自动会输出。`);
        });
    }
    copyScaffold() {
        return __awaiter(this, void 0, void 0, function* () {
            const { proName, projectPath, projectType, projectTypeTitle } = this.options;
            const store = memFs.create();
            const fsEditor = editor.create(store);
            fsEditor.copyTpl(util_1.default.getScaffoldPath(declare_1.ScaffoldType.Project, 'common'), projectPath, this.options, null, {
                globOptions: {
                    dot: true
                }
            });
            fsEditor.copyTpl(util_1.default.getScaffoldPath(declare_1.ScaffoldType.Project, projectType), projectPath, this.options);
            return new Promise((resolve, reject) => {
                fsEditor.commit(() => {
                    util_1.log.newline();
                    util_1.log.msg(util_1.LogType.CREATE, `项目 "${proName}" in "${projectPath}"`);
                    let files = glob.sync('**', {
                        cwd: projectPath
                    });
                    files.forEach(file => util_1.log.msg(util_1.LogType.COPY, file));
                    util_1.log.msg(util_1.LogType.COMPLETE, `"${projectTypeTitle}"项目已创建完成`);
                    resolve();
                });
            });
        });
    }
    updateConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            let { options } = this;
            util_1.config.update({
                cwd: options.projectPath,
                projectType: options.projectType,
                prefix: options.prefix,
                title: options.title,
                dest: options.dest,
                npm: {
                    dest: options.npmDest,
                    scope: options.npmScope
                }
            });
        });
    }
    newPackage() {
        return __awaiter(this, void 0, void 0, function* () {
            let { projectType } = this.options;
            if (projectType !== declare_1.ProjectType.Component) {
                return;
            }
            util_1.log.newline();
            util_1.log.msg(util_1.LogType.INFO, '准备为您创建一个新的组件');
            util_1.log.msg(util_1.LogType.RUN, 'tui new');
            let newCommand = new new_1.NewCommand({
                newType: declare_1.NewType.Package
            });
            yield newCommand.run();
        });
    }
    npmInstall() {
        return __awaiter(this, void 0, void 0, function* () {
            let { projectPath } = this.options;
            util_1.log.newline();
            util_1.log.msg(util_1.LogType.RUN, '命令：npm install');
            util_1.log.msg(util_1.LogType.INFO, '安装中, 请耐心等待...');
            yield util_1.exec('npm', ['install'], true, {
                cwd: projectPath
            });
        });
    }
    minBuild() {
        return __awaiter(this, void 0, void 0, function* () {
            let { projectPath } = this.options;
            util_1.log.newline();
            util_1.log.msg(util_1.LogType.RUN, '命令：tui build');
            util_1.log.msg(util_1.LogType.INFO, '编译中, 请耐心等待...');
            yield util_1.exec('tui', ['build'], true, {
                cwd: projectPath
            });
        });
    }
}
exports.InitCommand = InitCommand;
exports.default = {
    name: 'init [name]',
    alias: '',
    usage: '[name]',
    description: '创建项目',
    options: [
        ['-t, --projectType <project type>', '项目类型'],
        ['-p, --projectPath <project path>', '项目路径'],
        ['-c, --isContinue <is continue>', '继续高级设置']
    ],
    on: {
        '--help': () => {
            new class_1.CLIExample('init')
                .group('create project')
                .rule('');
        }
    },
    action(proName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { projectPath, projectType } = options;
                if (!options.proName) {
                    options.proName = proName;
                }
                let answers = yield getAnswers(options);
                projectPath = projectPath || answers.projectPath;
                projectType = projectType || answers.projectType;
                proName = proName || path.basename(projectPath);
                let projectTypeTitle = getProjectTypeTitle(projectType);
                let defaults = {
                    proName,
                    projectPath: projectPath,
                    projectType: projectType,
                    proNameToCamelCase: changeCase.camelCase(proName),
                    title: util_1.defaultConfig.title,
                    appId: 'touristappid',
                    description: `${answers.title || util_1.defaultConfig.title}-${projectTypeTitle}`,
                    prefix: util_1.defaultConfig.prefix,
                    useExample: projectType === declare_1.ProjectType.Component ? true : false,
                    useGlobalStyle: true,
                    useGlobalLayout: projectType === declare_1.ProjectType.Application ? true : false,
                    dest: util_1.defaultConfig.dest,
                    npmScope: '',
                    npmDest: util_1.defaultConfig.npm.dest,
                    gitUrl: '',
                    author: ''
                };
                answers = _.merge(defaults, answers, {
                    prefixStr: util_1.filterPrefix(answers.prefix),
                    npmScopeStr: util_1.filterNpmScope(answers.npmScope),
                    projectTypeTitle,
                    options: {
                        ProjectType: declare_1.ProjectType
                    },
                    initAfterContinueNewPackage: true
                });
                let initCommand = new InitCommand(answers);
                yield initCommand.run();
            }
            catch (err) {
                util_1.log.error(err);
            }
        });
    }
};
function getAnswers(options) {
    let { projectPath, projectType, isContinue } = options;
    const CREATE_QUESTIONS = [
        {
            type: 'input',
            message: '请设置项目目录',
            name: 'projectPath',
            default(answers) {
                return util_1.default.getDestProjectPath(options.proName || '');
            },
            filter(input) {
                return input.trim();
            },
            validate(input, answers) {
                if (input === '') {
                    return '请输入项目目录';
                }
                if (!path.isAbsolute(input)) {
                    return `格式不正确，请更换绝对路径`;
                }
                if (fs.existsSync(input) && glob.sync('**', { cwd: input }).length > 0) {
                    return `不是空目录，请更换`;
                }
                return true;
            },
            when(answers) {
                return !projectPath;
            }
        }, {
            type: 'list',
            message: '请选择项目类型',
            name: 'projectType',
            default: declare_1.ProjectType.Application,
            choices: () => {
                return [{
                        name: '新建小程序',
                        value: declare_1.ProjectType.Application
                    }, {
                        name: '新建组件库',
                        value: declare_1.ProjectType.Component
                    }];
            },
            when(answers) {
                return !projectType;
            }
        }, {
            type: 'confirm',
            message: '是否继续高级设置',
            name: 'isContinue',
            default: true,
            when(answers) {
                return !isContinue;
            }
        }, {
            type: 'input',
            message: '请设置项目标题',
            name: 'title',
            default: util_1.defaultConfig.title,
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
                return !!answers.isContinue;
            }
        }, {
            type: 'input',
            message: '请设置小程序AppId',
            name: 'appId',
            default: 'touristappid',
            filter(input) {
                return input.trim();
            },
            when(answers) {
                return !!answers.isContinue;
            }
        }, {
            type: 'input',
            message: '请设置项目描述',
            name: 'description',
            default(answers) {
                let projectTypeTitle = getProjectTypeTitle(answers.projectType);
                return `${answers.title}-${projectTypeTitle}`;
            },
            when(answers) {
                return !!answers.isContinue;
            }
        }, {
            type: 'input',
            message: '请设置组件名前缀',
            name: 'prefix',
            default(answers) {
                return util_1.defaultConfig.prefix.replace(/[-]+$/, '');
            },
            filter(input) {
                return input.trim();
            },
            validate(input, answers) {
                if (input === '') {
                    return '请输入组件名前缀';
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
                return !!answers.isContinue && answers.projectType === declare_1.ProjectType.Component;
            }
        },
        {
            type: 'confirm',
            message: '是否使用全局变量',
            name: 'useGlobalStyle',
            default: true,
            when(answers) {
                return !!answers.isContinue;
            }
        }, {
            type: 'confirm',
            message: '是否使用全局模板',
            name: 'useGlobalLayout',
            default: true,
            when(answers) {
                return !!answers.isContinue && answers.projectType === declare_1.ProjectType.Application;
            }
        }, {
            type: 'input',
            message: '请设置项目编译后的保存路径',
            name: 'dest',
            default: util_1.defaultConfig.dest,
            filter(input) {
                return input.trim();
            },
            validate(input, answers) {
                if (input === '') {
                    return '请输入路径';
                }
                return true;
            },
            when(answers) {
                return !!answers.isContinue;
            }
        }, {
            type: 'input',
            message: '请设置NPM模块编译后的保存路径，相对于 “项目编译” 后的保存路径',
            name: 'npmDest',
            default(answers) {
                return util_1.defaultConfig.npm.dest.replace(`${util_1.defaultConfig.dest}/`, '');
            },
            filter(input) {
                input = input.trim();
                if (input !== '') {
                    let answers = arguments[1] || {};
                    return `${answers.dest}/${input}`;
                }
                return input;
            },
            validate(input, answers) {
                if (input === '') {
                    return '请输入路径';
                }
                return true;
            },
            when(answers) {
                return !!answers.isContinue && answers.projectType === declare_1.ProjectType.Component;
            }
        }, {
            type: 'input',
            message: '请设置NPM模块的scope名称',
            name: 'npmScope',
            filter(input) {
                return input.trim();
            },
            validate(input, answers) {
                if (input !== '') {
                    if (!input.startsWith('@')) {
                        return `格式不正确，请以"@"符号开始，比如${util_1.defaultConfig.npm.scope}`;
                    }
                    else if (input.endsWith('/')) {
                        return `格式不正确，请勿以"/"结束，比如${util_1.defaultConfig.npm.scope}`;
                    }
                }
                return true;
            },
            when(answers) {
                return !!answers.isContinue && answers.projectType === declare_1.ProjectType.Component;
            }
        }, {
            type: 'input',
            message: '请设置GIT仓库地址',
            name: 'gitUrl',
            when(answers) {
                return !!answers.isContinue;
            }
        }, {
            type: 'input',
            message: '请设置Author',
            name: 'author',
            default: process.env.USER,
            when(answers) {
                return !!answers.isContinue;
            }
        }
    ];
    return inquirer_1.prompt(CREATE_QUESTIONS);
}
function getProjectTypeTitle(projectType) {
    switch (projectType) {
        case declare_1.ProjectType.Component:
            return '组件库';
        case declare_1.ProjectType.Application:
            return '小程序';
        default:
            throw new Error('未知项目类型');
    }
}
