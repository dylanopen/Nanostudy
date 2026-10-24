import { query } from '$app/server';
import { db } from '$lib/server/db';
import { basic_questions, multistep_questions, multistep_question_parts, maths_questions, multimaths_questions, multimaths_question_parts } from '$lib/server/db/schema';
import { BasicQuestion, Question, AnswerSubmissionResult, MultistepQuestion, MathsQuestion } from '$lib/types/question';
import { sql } from 'drizzle-orm';
import * as v from 'valibot';
import { error } from '@sveltejs/kit';
import { BasicAnswer } from '$lib/types/question';
import { MathsQuestionTemplate } from '$lib/generator';
import { MultimathsQuestion } from '$lib/types/question/multimaths';
import type { GeneratedVariable } from '$lib/types/question/maths';

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

export const fetchMathsQuestionTemplateById = query(
    v.object({
        questionId: v.string(),
    }),
    async ({ questionId }): Promise<MathsQuestionTemplate | null> => {
        const [data] = await db.execute<typeof maths_questions.$inferSelect>(sql`
            SELECT *
            FROM ${maths_questions}
            WHERE ${maths_questions.id} = ${questionId}
        `);
        if (!data) {
            return null;
        }

        return new MathsQuestionTemplate(
            data.id,
            data.prompt,
            data.constrained,
            data.derived,
            data.answers,
            data.hint,
            data.explanation
        );
    }
);

export const fetchMathsQuestionById = query(
    v.object({
        questionId: v.string(),
    }),
    async ({ questionId }): Promise<MathsQuestion | null> => {
        let template = await fetchMathsQuestionTemplateById({ questionId });
        if (!template) {
            return null;
        }
        return template.generate();
    }
);

export const fetchMultimathsQuestionById = query(
    v.object({
        questionId: v.string(),
    }),
    async ({ questionId }): Promise<MultimathsQuestion | null> => {
        const [multimathsData] = await db.execute<typeof multimaths_questions.$inferSelect>(sql` 
              SELECT *
              FROM ${multimaths_questions}
              WHERE ${multimaths_questions.id} = ${questionId}
        `);
        if (!multimathsData) {
            return null;
        }
        let rootTemplate = new MathsQuestionTemplate(
            multimathsData.id,
            multimathsData.prompt,
            multimathsData.constrained,
            multimathsData.derived,
            [], null, null,
        );
        let variables = rootTemplate.generateVariables();
        let rootQuestion = rootTemplate.generate(variables);

        const partsData = await db.execute<typeof multimaths_question_parts.$inferSelect>(sql`
            SELECT *
            FROM ${multimaths_question_parts}
            WHERE ${multimaths_question_parts.multimaths_id} = ${questionId}
            ORDER BY ${multimaths_question_parts.index} ASC
        `);

        const stepQuestions = await Promise.all(
            partsData.map(async (part) => {
                let template = await fetchMathsQuestionTemplateById({ questionId: part.part_question_id });
                if (!template) {
                    throw error(404, `Part question with ID ${part.part_question_id} not found`);
                }
                let stepVariables: GeneratedVariable[] = [];
                for (let globalVariable of variables) {
                    let mappedVariableName = part.variable_mapping[globalVariable.name];
                    if (!mappedVariableName) {
                        mappedVariableName = globalVariable.name;
                    }
                    stepVariables = stepVariables.filter(v => v.name !== mappedVariableName);
                    stepVariables.push({
                        name: mappedVariableName,
                        value: globalVariable.value,
                    });
                }
                let question = template.generate(stepVariables);
                console.log(`Generated question for part ${part.part_question_id}:`, question);
                console.log(`Variable mapping for part ${part.part_question_id}:`, part.variable_mapping);
                console.log(`Variables for part ${part.part_question_id}:`, stepVariables);
                return question;
            })
        );

        return new MultimathsQuestion(rootQuestion.id, rootQuestion.prompt, stepQuestions);
    }
);
                                                                                

export const getQuestion = query(
    v.object({
        questionId: v.string(),
    }),
    async ({ questionId }): Promise<Question> => {
        const question = await Question.load(questionId);

        if (!question) { throw error(404, 'Question not found'); }

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
