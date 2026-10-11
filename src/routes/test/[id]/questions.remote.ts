import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import { query } from '$app/server';
import { Answer, Question } from '$lib/types/question';

export const getQuestion = query(
    v.object({
        questionId: v.string(),
    }),
    async ({ questionId }): Promise<Question> => {
        const question = await Question.load(questionId);

        if (!question) { throw error(404, 'Question not found'); }

        question.hideAnswer();
        return question;
    }
);

export const checkAnswer = query(
    v.object({
        questionId: v.string(),
        answerAttempt: v.string(),
    }),
    async ({ questionId, answerAttempt }): Promise<[boolean, Answer]> => {
        const question: Question | null = await Question.load(questionId);
        console.log(questionId, question);
        if (!question || !question.correctAnswer || !question.markingEngine) { throw error(404, 'Question not found'); }

        const correctAnswer: Answer = question.correctAnswer;
        const isCorrect: boolean = question.markingEngine.isCorrect(correctAnswer, answerAttempt);
        return [isCorrect, correctAnswer];
    }
)

