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
const inquirer_1 = require("inquirer");
const util_1 = require("../util");
var NpmDest;
(function (NpmDest) {
    function getQuestion(options = {}) {
        return [
            {
                type: 'input',
                message: '请设置安装路径',
                name: 'npmDest',
                default: util_1.config.npm.dest,
                validate(input, answers) {
                    if (!input || !input.trim()) {
                        return '路径不能为空';
                    }
                    else if (path.isAbsolute(input) || input.charAt(0) === '.') {
                        return '路径格式错误，相对于项目根目录下，例如：components 或 dist/packages';
                    }
                    return true;
                },
                filter(input) {
                    return input.split(path.sep).join('/');
                },
                when(answers) {
                    return !util_1.customConfig.npm || !util_1.customConfig.npm.dest;
                }
            }
        ];
    }
    NpmDest.getQuestion = getQuestion;
    function setAnswer(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let questions = getQuestion(options);
            let answers = yield inquirer_1.prompt(questions);
            if (answers.npmDest) {
                util_1.config.updateCustomFile({
                    npm: {
                        dest: answers.npmDest
                    }
                });
            }
        });
    }
    NpmDest.setAnswer = setAnswer;
})(NpmDest = exports.NpmDest || (exports.NpmDest = {}));
