import { Question } from 'inquirer';
export declare namespace NpmDest {
    interface Options {
    }
    function getQuestion(options?: Options): Question[];
    function setAnswer(options?: Options): Promise<void>;
}
