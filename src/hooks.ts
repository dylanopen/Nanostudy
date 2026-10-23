import type { Transport } from '@sveltejs/kit';
import { Course, CourseTopic } from '$lib/types/curriculum';
import { Lesson } from '$lib/types/lesson';
import { Question, Answer, BasicQuestion, BasicAnswer, MultistepQuestion, AnswerSubmissionResult, MathsQuestion } from '$lib/types/question';
import { MathsQuestionTemplate } from '$lib/generator';
import { MathsAnswer } from '$lib/types/question/maths';

const models: Record<string, any> = {
    Course,
    CourseTopic,
    Lesson,
    Question,
    Answer,
    BasicAnswer,
    BasicQuestion,
    MultistepQuestion,
    MathsQuestion,
    MathsQuestionTemplate,
    MathsAnswer,
    AnswerSubmissionResult,
};

export const transport: Transport = {
    Model: {
        encode: (v: any) => v?.constructor?.name in models && [v.constructor.name, { ...v }],
        decode: ([name, data]: [string, any]) => {
            const Cls = models[name];
            return Cls ? Object.assign(Object.create(Cls.prototype), data) : data;
        }
    }
};
