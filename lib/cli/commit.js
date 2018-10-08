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
const class_1 = require("../class");
const child_process_1 = require("child_process");
class CommitCommand {
    constructor(options = {}) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            child_process_1.execFileSync(path.join(__dirname, '../../node_modules/.bin/git-cz'), {
                stdio: ['inherit', 'inherit', 'inherit']
            });
        });
    }
}
exports.CommitCommand = CommitCommand;
exports.default = {
    name: 'commit',
    alias: 'ci',
    usage: '',
    description: '提交 MinUI 组件库',
    options: [],
    on: {
        '--help': () => {
            new class_1.CLIExample('commit')
                .group('提交')
                .rule('');
        }
    },
    action(cliOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let commitCommand = new CommitCommand();
            yield commitCommand.run();
        });
    }
};
