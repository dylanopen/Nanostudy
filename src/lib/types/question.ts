import { fetchBasicQuestionById, fetchMultistepQuestionById } from "$lib/api/question.remote";

export abstract class Question {
    public abstract readonly type: string;
    constructor(
        public id: string,
        public prompt: string,
        public answer: Answer | undefined,
        public markingEngine: MarkingEngine | undefined,
    ) {}

    static async load(id: string): Promise<Question | null> {
        let question = await BasicQuestion.load(id);
        if (question) return question;
        question = await MultistepQuestion.load(id);
        if (question) return question;

        return null;
    }

    static async example(): Promise<Question | null> {
        return Question.load("example-question");
    }

    public hideAnswer(): void {
        this.markingEngine = undefined;
        this.answer = undefined;
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
        answer: Answer
    ) {
        super(id, prompt, answer, new ExactMarkingEngine());
    }

    static async load(id: string): Promise<BasicQuestion | null> {
        return await fetchBasicQuestionById({ questionId: id });
    }
}

export class MultistepQuestion extends Question {
    readonly type: string = "multistep";
    public steps: Question[];

    constructor(
        id: string,
        prompt: string,
        steps: Question[],
    ) {
        super(id, prompt, undefined, undefined);
        this.steps = steps;
    }

    static async load(id: string): Promise<MultistepQuestion | null> {
        return await fetchMultistepQuestionById({ questionId: id });
    }
}

export class AnswerSubmissionResult {
    constructor(
        public question: Question,
        public isCorrect: boolean,
        public studentAnswer: string,
    ) {}
}

