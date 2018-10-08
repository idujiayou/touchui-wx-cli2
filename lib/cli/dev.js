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
class DevCommand {
    constructor(options) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let { pages, watch, clear } = this.options;
            util_1.Global.isDebug = !!pages && pages.length > 0;
            let xcx = new class_1.Xcx({
                isClear: clear,
                app: {
                    isSFC: true
                },
                pages,
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
            if (watch) {
                this.watcher = xcx.watch();
            }
            else {
                this.watcher = null;
            }
            return Promise.resolve();
        });
    }
    closeWatch() {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
    }
}
exports.DevCommand = DevCommand;
exports.default = {
    name: 'dev [name]',
    alias: '',
    usage: '[name]',
    description: '调试页面',
    options: [],
    on: {
        '--help': () => {
            new class_1.CLIExample('dev')
                .group('调试项目')
                .rule('')
                .group('支持英文逗号分隔，来同时调试多个页面')
                .rule('home,loading');
        }
    },
    action(name, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let pages = util_1.default.pageName2Pages(name);
            let devCommand = new DevCommand({
                pages,
                watch: true,
                clear: true
            });
            yield devCommand.run();
        });
    }
};
