import type { ConstrainedVariable, DerivedVariable } from './schema';

export type QuestionType = 'basic' | 'maths' | 'multistep' | 'multimaths';

export interface BasicQuestionDef {
  type: 'basic';
  id: string;
  prompt: string;
  answers?: string[];
  hint?: string | null;
  explanation?: string | null;
}

export interface MathsQuestionDef {
  type: 'maths';
  id: string;
  prompt: string;
  constrained?: ConstrainedVariable[];
  derived?: DerivedVariable[];
  answers: string[];
  hint?: string | null;
  explanation?: string | null;
}

export interface MultistepPartDef {
  index: number;
  question: string | BasicQuestionDef | MathsQuestionDef;
}

export interface MultistepQuestionDef {
  type: 'multistep';
  id: string;
  prompt: string;
  parts: MultistepPartDef[];
}

export interface MultimathsPartDef {
  index: number;
  variable_mapping?: Record<string, string>;
  question: string | MathsQuestionDef;
}

export interface MultimathsQuestionDef {
  type: 'multimaths';
  id: string;
  prompt: string;
  constrained?: ConstrainedVariable[];
  derived?: DerivedVariable[];
  parts: MultimathsPartDef[];
}

export type QuestionDef =
  | BasicQuestionDef
  | MathsQuestionDef
  | MultistepQuestionDef
  | MultimathsQuestionDef;

export interface LessonDef {
  id: string;
  title: string;
  read_content?: string | null;
  prerequisites?: string[];
  questions?: (string | QuestionDef)[];
}

export interface TopicDef {
  topic_id: string;
  title: string;
  index: number;
  lessons?: (string | LessonDef)[];
}

export interface CourseDef {
  id: string;
  title: string;
  level?: string | null;
  exam_board?: string | null;
  grade_scale?: string | null;
  topics?: TopicDef[];
}

export interface ContentPayload {
  courses?: CourseDef[];
  lessons?: LessonDef[];
  questions?: QuestionDef[];
}
