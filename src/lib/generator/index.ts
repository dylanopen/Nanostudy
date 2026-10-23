import type { ConstrainedVariable, DerivedVariable } from "$lib/server/db/schema";
import { MathsQuestion } from "$lib/types/question";
import { MathsAnswer, type GeneratedVariable } from "$lib/types/question/maths";
import { evaluate, parse } from "mathjs";

export class MathsQuestionTemplate {
    constructor(
        public id: string,
        public prompt: string,
        public constrained: ConstrainedVariable[],
        public derived: DerivedVariable[],
        public answers: string[],
        public hint: string | null,
        public explanation: string | null,
    ) {}

    public generate(): MathsQuestion {
        const variables: GeneratedVariable[] = [];
        for (const constrainedVariable of this.constrained) {
            const generatedValue = this.generateVariableValue(constrainedVariable);
            variables.push({
                name: constrainedVariable.name,
                value: generatedValue,
            });
        }
        for (const derivedVariable of this.derived) {
            this.evaluateDerivedVariable(derivedVariable, variables);
        }
        // TODO: support for variables being derived from other derived variables.

        let question = new MathsQuestion(
            this.id,
            this.prompt,
            new MathsAnswer(
                this.answers,
                this.hint,
                this.explanation,
            )
        );
        question.prompt = this.insertVariablesIntoExpression(question.prompt, variables);
        for (let i = 0; i < question.answer.validAnswers.length; i++) {
            question.answer.validAnswers[i] = this.insertVariablesIntoExpression(question.answer.validAnswers[i], variables);
        }

        return question;
    }

    private insertVariablesIntoExpression(expression: string, variables: GeneratedVariable[]): string {
        let expressionWithValues = expression;
        for (const variable of variables) {
            expressionWithValues = expressionWithValues.replaceAll(`[[${variable.name}]]`, variable.value);
        }
        return expressionWithValues;
    }

    private evaluateDerivedVariable(derivedVariable: DerivedVariable, variables: GeneratedVariable[]): void {
        const expressionWithValues = this.insertVariablesIntoExpression(derivedVariable.expression, variables);
        const parsedExpression = parse(expressionWithValues);
        const evaluatedValue = parsedExpression.evaluate();
        variables.push({
            name: derivedVariable.name,
            value: evaluatedValue.toString(),
        });
    }

    private generateVariableValue(variable: ConstrainedVariable): string {
        let min = variable.min;
        let max = variable.max;
        let step = variable.step || 1;

        let generatedValue: number;
        do {
            const range = Math.floor((max - min) / step);
            const randomStep = Math.floor(Math.random() * (range + 1));
            generatedValue = min + randomStep * step;
        } while (variable.exclude && variable.exclude.includes(generatedValue));

        return generatedValue.toString();
    }
}
