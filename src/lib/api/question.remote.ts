import { query } from '$app/server';
import { db } from '$lib/server/db';
import { basic_questions, multistep_questions, multistep_question_parts } from '$lib/server/db/schema';
import { Answer, BasicQuestion, Question, AnswerSubmissionResult, MultistepQuestion } from '$lib/types/question';
import { sql } from 'drizzle-orm';
import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import { BasicAnswer } from '$lib/types/question';

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
            new BasicAnswer(bq.answers, bq.hint, bq.explanation),
        );
    }
);

export const fetchMultistepQuestionById = query(
    v.object({
        questionId: v.string(),
    }),
    async ({ questionId }): Promise<MultistepQuestion | null> => {
        const multiStepData = await db.execute<typeof multistep_questions.$inferSelect>(sql`
            SELECT *
            FROM ${multistep_questions}
            WHERE ${multistep_questions.id} = ${questionId}
        `);
        const ms = multiStepData[0];
        if (!ms) {
            return null;
        }

        const partsData = await db.execute<typeof multistep_question_parts.$inferSelect>(sql`
            SELECT *
            FROM ${multistep_question_parts}
            WHERE ${multistep_question_parts.multistep_id} = ${questionId}
            ORDER BY ${multistep_question_parts.index} ASC
        `);

        const stepQuestions = await Promise.all(
            partsData.map((part) => Question.load(part.part_question_id))
        );

        const steps = stepQuestions.filter((q): q is Question => q !== null);

        return new MultistepQuestion(ms.id, ms.prompt, steps);
    }
);

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
        if (!question) { throw error(404, 'Question not found'); }
        if (!question.answer) { throw error(404, 'Question does not have an answer'); }

        const isCorrect: boolean = question.answer.isCorrect(answerAttempt);

        return new AnswerSubmissionResult(question, isCorrect, answerAttempt);
    }
);
