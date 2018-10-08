"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = require("./cli/build");
exports.BuildCommand = build_1.BuildCommand;
const init_1 = require("./cli/init");
exports.InitCommand = init_1.InitCommand;
const install_1 = require("./cli/install");
exports.InstallCommand = install_1.InstallCommand;
const new_1 = require("./cli/new");
exports.NewCommand = new_1.NewCommand;
const dev_1 = require("./cli/dev");
exports.DevCommand = dev_1.DevCommand;
const publish_1 = require("./cli/publish");
exports.PublishCommand = publish_1.PublishCommand;
const update_1 = require("./cli/update");
exports.UpdateCommand = update_1.UpdateCommand;
const transform_1 = require("./cli/transform");
exports.TransformCommand = transform_1.TransformCommand;
exports.default = [
    init_1.default,
    new_1.default,
    dev_1.default,
    build_1.default,
    publish_1.default,
    install_1.default,
    update_1.default,
    transform_1.default
];
exports.getUtil = () => {
    return require('./util');
};
exports.getDeclare = () => {
    return require('./declare');
};
