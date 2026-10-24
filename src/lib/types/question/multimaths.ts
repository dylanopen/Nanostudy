import { fetchMultimathsQuestionById } from "$lib/api/question.remote";
import { MathsQuestion, Question } from ".";

export class MultimathsQuestion extends Question {
    readonly type: string = "multimaths";
    public steps: Question[];

    constructor(
        id: string,
        prompt: string,
        steps: MathsQuestion[],
    ) {
        if (steps.length === 0) {
            throw new Error("MultimathsQuestion must have at least one step.");
        }
        let answer = steps[steps.length - 1].answer;
        super(id, prompt, answer);
        this.steps = steps;
    }

    static async load(id: string): Promise<MultimathsQuestion | null> {
        return await fetchMultimathsQuestionById({ questionId: id });
    }
}
