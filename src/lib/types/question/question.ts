import type { Answer } from "./answer";

export abstract class Question {
    public abstract readonly type: string;
    constructor(
        public id: string,
        public prompt: string,
        public answer: Answer | undefined,
    ) {}

    static async load(id: string): Promise<Question | null> {
        const { BasicQuestion } = await import("./basic");
        let question = await BasicQuestion.load(id); 
        if (question) return question; 

        const { MultistepQuestion } = await import("./multistep");
        question = await MultistepQuestion.load(id); 
        if (question) return question; 

        return null; 
    }

    static async example(): Promise<Question | null> {
        return Question.load("example-question");
    }

    public hideAnswer(): void {
        this.answer = undefined;
    }
}

