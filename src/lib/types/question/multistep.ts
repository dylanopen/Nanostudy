import { fetchMultistepQuestionById } from "$lib/api/question.remote";
import { Question } from ".";

export class MultistepQuestion extends Question {
    readonly type: string = "multistep";
    public steps: Question[];

    constructor(
        id: string,
        prompt: string,
        steps: Question[],
    ) {
        let answer = steps.length > 0 ? steps[steps.length - 1].answer : undefined;
        super(id, prompt, answer);
        this.steps = steps;
    }

    static async load(id: string): Promise<MultistepQuestion | null> {
        return await fetchMultistepQuestionById({ questionId: id });
    }
}
