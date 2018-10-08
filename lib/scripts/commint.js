"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const bootstrap = require('commitizen/dist/cli/git-cz').bootstrap;
bootstrap({
    cliPath: path.join(__dirname, '../../node_modules/commitizen'),
    config: {
        path: 'cz-conventional-changelog'
    }
});
