import { Question } from 'inquirer';
export declare namespace BabelES6 {
    interface Options {
    }
    function getQuestion(options?: Options): Question[];
    function setAnswer(options?: Options): Promise<void>;
}
