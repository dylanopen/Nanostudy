import { fetchMathsQuestionById } from "$lib/api/question.remote";
import { Question } from "$lib/types/question/question";
import { Answer } from "$lib/types/question/answer";
import { parse, compare } from "@khanacademy/kas";

export type GeneratedVariable = {
    name: string;
    value: string;
};

export class MathsQuestion extends Question<MathsAnswer> {
    readonly type: string = "maths";

    constructor(
        id: string,
        prompt: string,
        answer: MathsAnswer,
    ) {
        super(id, prompt, answer);
    }

    static async load(id: string): Promise<MathsQuestion | null> {
        return await fetchMathsQuestionById({ questionId: id });
    }
}

export class MathsAnswer extends Answer {
    constructor(
        public validAnswers: string[],
        public mathsHint: string | null,
        public mathsExplanation: string | null,
        public markingType: "cas" | "exact" = "cas",
    ) {
        super()
    }

    public display(): string {
        return "$" + this.validAnswers[0] + "$";
    }

    public hint(): string | null {
        return this.mathsHint;
    }

    public explanation(): string | null {
        return this.mathsExplanation;
    }

    public isCorrect(studentAnswer: string): boolean {
        const studentExpr = parse(studentAnswer).expr;
        for (const validAnswer of this.validAnswers) {
            const answerExpr = parse(validAnswer).expr;
            const result = compare(studentExpr, answerExpr, {
                form: true,
            });
            if (result.equal) {
                return true;
            }
        }
        return false;
    }
}

