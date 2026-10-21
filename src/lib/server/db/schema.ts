import { foreignKey, integer, jsonb, pgEnum, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

export const courses = pgTable("courses", {
    id: text().primaryKey(),
    title: text().notNull(),
    level: text(),
    exam_board: text(),
    grade_scale: text(),
}).enableRLS();

export const course_topics = pgTable("course_topics", {
    topic_id: text().notNull(),
    course_id: text().notNull().references(() => courses.id),
    title: text().notNull(),
    index: integer().notNull(),
}, (table) => [
    primaryKey({ columns: [table.topic_id, table.course_id] }),
]).enableRLS();

export const lessons = pgTable("lessons", {
    id: text().primaryKey(),
    title: text().notNull(),
    read_content: text(),
    prerequisites: jsonb("prerequisites").$type<string[]>().notNull().default([]),
}).enableRLS();

export const topic_lessons = pgTable("topic_lessons", {
    lesson_id: text().notNull().references(() => lessons.id),
    course_id: text().notNull(),
    topic_id: text().notNull(),
}, (table) => [
    primaryKey({ columns: [table.course_id, table.topic_id, table.lesson_id] }),
    foreignKey({
        columns: [table.topic_id, table.course_id],
        foreignColumns: [course_topics.topic_id, course_topics.course_id],
    }),
]).enableRLS();

export const lesson_questions = pgTable("lesson_questions", {
    lesson_id: text().notNull(),
    question_id: text().notNull(),
}, (table) => [
    primaryKey({ columns: [table.lesson_id, table.question_id] }),
]).enableRLS();

export const basic_questions = pgTable("basic_questions", {
    id: text().primaryKey(),
    prompt: text().notNull(),
    answers: jsonb("answers").$type<string[]>().notNull().default([]),
    hint: text(),
    explanation: text(),
}).enableRLS();

export const multistep_questions = pgTable("multistep_questions", {
    id: text().primaryKey(),
    prompt: text().notNull(),
}).enableRLS();

export const multistep_question_parts = pgTable("multistep_question_parts", {
    multistep_id: text().notNull(),
    part_question_id: text().notNull(),
    index: integer().notNull(),
}).enableRLS();

