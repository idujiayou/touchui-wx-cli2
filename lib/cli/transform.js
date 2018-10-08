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
const transform_1 = require("../transform");
const util_1 = require("../util");
class TransformCommand {
    constructor(options) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let { type, src, dest } = this.options;
            if (type === 'ui2wx') {
                this.transformer = new transform_1.Ui2Wx(src, dest);
            }
            else if (type === 'wx2ui') {
                this.transformer = new transform_1.Wx2Ui(src, dest);
            }
            else {
                util_1.log.error('未知的转换类型');
            }
            if (this.transformer) {
                yield this.transformer.transform();
            }
        });
    }
}
exports.TransformCommand = TransformCommand;
exports.default = {
    name: 'transform [name]',
    usage: '[name]',
    description: '转换项目',
    on: {
        '--help': () => {
            new class_1.CLIExample('transfrom')
                .group('转换项目')
                .rule('');
        }
    },
    options: [
        ['-t, --type <transform type>', '转换类型'],
        ['-i, --src <src path>', '输入路径'],
        ['-o, --dest <dest path>', '输出路径']
    ],
    action(name, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let transformCommand = new TransformCommand(options);
            yield transformCommand.run();
        });
    }
};
