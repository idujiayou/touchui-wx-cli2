"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
class CLIExample {
    constructor(command) {
        this.command = command;
        console.log('');
        console.log('  Examples:');
    }
    group(group) {
        console.log(`\n    ${group}\n`);
        return this;
    }
    rule(rule, comment) {
        console.log(`      $ ${util_1.config.cli} ${this.command} ${rule}${comment ? `\t# ${comment}` : ''}`);
        return this;
    }
}
exports.CLIExample = CLIExample;
