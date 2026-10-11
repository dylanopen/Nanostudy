import { fetchBasicQuestionById } from "$lib/api/question.remote";

export abstract class Question {
    public abstract readonly type: string;
    constructor(
        public id: string,
        public prompt: string,
        public correctAnswer: Answer | undefined,
        public markingEngine: MarkingEngine | undefined,
    ) {}

    static async load(id: string): Promise<Question | null> {
        // TODO: support more question types
        let question = await BasicQuestion.load(id);
        if (!question) return null;

        return question;
    }

    public hideAnswer(): void {
        this.markingEngine = undefined;
        this.correctAnswer = undefined;
    }
}

export abstract class MarkingEngine {
    public constructor() {}
    public abstract isCorrect(correctAnswer: Answer, studentAnswer: string): boolean;
}

export class ExactMarkingEngine extends MarkingEngine {
    public isCorrect(correctAnswer: Answer, studentAnswer: string): boolean {
        return correctAnswer.answers.includes(studentAnswer);
    }
}

export class Answer {
    constructor(
        public answers: string[],
        public hint: string | null,
        public explanation: string | null,
    ) {}
}

export class BasicQuestion extends Question {
    readonly type: string = "basic";

    constructor(
        id: string,
        prompt: string,
        correctAnswer: Answer
    ) {
        super(id, prompt, correctAnswer, new ExactMarkingEngine());
        this.correctAnswer = correctAnswer;
    }

    static async load(id: string): Promise<BasicQuestion | null> {
        return await fetchBasicQuestionById({ questionId: id });
    }
}

export class QuestionResult {
    constructor(
        public question: Question,
        public isCorrect: boolean,
        public studentAnswer: string,
    ) {}
}

