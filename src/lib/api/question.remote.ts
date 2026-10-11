import { query } from '$app/server';
import { db } from '$lib/server/db';
import { basic_questions } from '$lib/server/db/schema';
import { Answer, BasicQuestion, Question, AnswerSubmissionResult } from '$lib/types/question';
import { sql } from 'drizzle-orm';
import * as v from 'valibot';
import { error } from '@sveltejs/kit';

export const fetchBasicQuestionById = query(
    v.object({
        questionId: v.string(),
    }),
    async ({ questionId }): Promise<BasicQuestion | null> => {
        const basicQuestionData = await db.execute<typeof basic_questions.$inferSelect>(sql`
            SELECT *
            FROM ${basic_questions}
            WHERE ${basic_questions.id} = ${questionId}
        `);
        const bq = basicQuestionData[0];
        if (!bq) {
            return null;
        }

        return new BasicQuestion(
            bq.id,
            bq.prompt,
            new Answer(bq.answers, bq.hint, bq.explanation),
        );
    }
)

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
    async ({ questionId, answerAttempt }): Promise<AnswerSubmissionResult> => {
        const question: Question | null = await Question.load(questionId);
        if (!question || !question.correctAnswer || !question.markingEngine) { throw error(404, 'Question not found'); }

        const correctAnswer: Answer = question.correctAnswer;
        const isCorrect: boolean = question.markingEngine.isCorrect(correctAnswer, answerAttempt);

        return new AnswerSubmissionResult(question, isCorrect, answerAttempt);
    }
)

