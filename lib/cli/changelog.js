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
class ChangelogCommand {
    constructor(options = {}) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const standardVersion = require('standard-version');
            standardVersion({
                noVerify: true,
                infile: 'CHANGELOG.md',
                silent: true
            }, function (err) {
                if (err) {
                    util_1.log.error(`changelog failed with message: ${err.message}`);
                }
            });
        });
    }
}
exports.ChangelogCommand = ChangelogCommand;
exports.default = {
    name: 'changelog',
    alias: 'log',
    usage: '',
    description: '更新日志',
    options: [],
    on: {
        '--help': () => {
            new class_1.CLIExample('changelog')
                .group('更新日志')
                .rule('');
        }
    },
    action(cliOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let changelogCommand = new ChangelogCommand();
            yield changelogCommand.run();
        });
    }
};
