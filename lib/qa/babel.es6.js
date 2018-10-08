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
const inquirer_1 = require("inquirer");
const _ = require("lodash");
const util_1 = require("../util");
var BabelES6;
(function (BabelES6_1) {
    function getQuestion(options = {}) {
        return [
            {
                type: 'confirm',
                message: '是否启用 ES6 转 ES5',
                name: 'BabelES6',
                default: true,
                when(answers) {
                    return !util_1.customConfig.compilers || ('babel' in util_1.customConfig.compilers === false);
                }
            }
        ];
    }
    BabelES6_1.getQuestion = getQuestion;
    function setAnswer(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let questions = getQuestion(options);
            let answers = yield inquirer_1.prompt(questions);
            let { BabelES6 } = answers;
            if (_.isUndefined(BabelES6)) {
                return;
            }
            if (!BabelES6) {
                util_1.config.updateCustomFile({
                    compilers: {
                        babel: false
                    }
                });
                return;
            }
            util_1.config.updateCustomFile({
                compilers: {
                    babel: {
                        sourceMaps: 'inline',
                        presets: [
                            'env'
                        ],
                        plugins: [
                            'syntax-export-extensions',
                            'transform-class-properties',
                            'transform-decorators-legacy',
                            'transform-export-extensions'
                        ]
                    }
                }
            });
            let devDependencies = [
                'babel-plugin-syntax-export-extensions',
                'babel-plugin-transform-class-properties',
                'babel-plugin-transform-decorators-legacy',
                'babel-plugin-transform-export-extensions',
                'babel-preset-env'
            ];
            util_1.log.msg(util_1.LogType.RUN, `npm install ${devDependencies.join(',')} --save`);
            util_1.log.newline();
            yield util_1.exec('npm', ['install', ...devDependencies, '--save'], true, {
                cwd: util_1.config.cwd
            });
        });
    }
    BabelES6_1.setAnswer = setAnswer;
})(BabelES6 = exports.BabelES6 || (exports.BabelES6 = {}));
