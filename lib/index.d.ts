import { DevType } from './declare';
import { BuildCommand } from './cli/build';
import { InitCommand } from './cli/init';
import { InstallCommand } from './cli/install';
import { NewCommand } from './cli/new';
import { DevCommand } from './cli/dev';
import { PublishCommand } from './cli/publish';
import { UpdateCommand } from './cli/update';
import { TransformCommand } from './cli/transform';
export { BuildCommand, InitCommand, InstallCommand, NewCommand, DevCommand, PublishCommand, UpdateCommand, DevType, TransformCommand };
declare const _default: ({
    name: string;
    alias: string;
    usage: string;
    description: string;
    options: string[][];
    on: {
        '--help': () => void;
    };
    action(proName: string, options: InitCommand.Options): Promise<void>;
} | {
    name: string;
    alias: string;
    usage: string;
    description: string;
    options: string[][];
    on: {
        '--help': () => void;
    };
    action(name: string | undefined, options: NewCommand.Options): Promise<void>;
} | {
    name: string;
    usage: string;
    description: string;
    on: {
        '--help': () => void;
    };
    options: string[][];
    action(name: string, options: TransformCommand.Options): Promise<void>;
    alias?: undefined;
})[];
export default _default;
