import type { Question } from "./question";

export abstract class Answer {
    public abstract display(): string;
    public abstract hint(): string | null;
    public abstract explanation(): string | null;
    public abstract isCorrect(studentAnswer: string): boolean;
}

export class AnswerSubmissionResult {
    constructor(
        public question: Question,
        public isCorrect: boolean,
        public studentAnswer: string | undefined,
        public steps: AnswerSubmissionResult[] | undefined = undefined,
    ) {}
}

