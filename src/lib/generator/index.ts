import type { ConstrainedVariable, DerivedVariable } from "$lib/server/db/schema";
import { MathsQuestion } from "$lib/types/question";
import { MathsAnswer, type GeneratedVariable } from "$lib/types/question/maths";
import { evaluate, parse } from "mathjs";

export class MathsQuestionTemplate {
    readonly type: string = "maths-template";

    constructor(
        public id: string,
        public prompt: string,
        public constrained: ConstrainedVariable[],
        public derived: DerivedVariable[],
        public answers: string[],
        public hint: string | null = null,
        public explanation: string | null = null,
        public markingEngine: string | null = null,
    ) {}

    public generateVariables(): GeneratedVariable[] {
        let variables: GeneratedVariable[] = [];
        for (const constrainedVariable of this.constrained) {
            const generatedValue = this.generateVariableValue(constrainedVariable);
            variables.push({
                name: constrainedVariable.name,
                value: generatedValue,
            });
        }
        let derivedVariables = this.generateDerivedVariables(variables);
        variables.push(...derivedVariables);
        return variables;
    }

    public generateDerivedVariables(variables: GeneratedVariable[]): GeneratedVariable[] {
        let derivedVariables: GeneratedVariable[] = [];
        for (const derivedVariable of this.derived) {
            derivedVariables.push(this.evaluateDerivedVariable(derivedVariable, variables));
        }
        return derivedVariables;
    }

    public generate(variables?: GeneratedVariable[]): MathsQuestion {
        if (!variables || variables.length === 0) {
            variables = this.generateVariables();
        }
        variables = variables.concat(this.generateDerivedVariables(variables));

        let question = new MathsQuestion(
            this.id,
            this.prompt,
            new MathsAnswer(
                this.answers,
                this.hint,
                this.explanation,
                this.markingEngine || "cas",
            )
        );
        question.prompt = this.insertVariablesIntoExpression(question.prompt, variables);
        for (let i = 0; i < question.answer.validAnswers.length; i++) {
            question.answer.validAnswers[i] = this.insertVariablesIntoExpression(question.answer.validAnswers[i], variables);
        }
        if (question.answer.mathsHint) {
            question.answer.mathsHint = this.insertVariablesIntoExpression(question.answer.mathsHint, variables);
        }
        if (question.answer.mathsExplanation) {
            question.answer.mathsExplanation = this.insertVariablesIntoExpression(question.answer.mathsExplanation, variables);
        }

        return question;
    }

    private insertVariablesIntoExpression(expression: string, variables: GeneratedVariable[]): string {
        let expressionWithValues = expression;
        for (const variable of variables) {
            expressionWithValues = expressionWithValues.replaceAll(`[[${variable.name}]]`, variable.value);
        }
        return this.simplifyAbnormalities(expressionWithValues);
    }

    private simplifyAbnormalities(expression: string): string {
        // I'm using regex to ignore any whitespace when matching.
        // TODO: We only want to do this if we're inside a LaTeX block ($...$)
        
        return expression
        // Remove unnecessary +0, -0 (I need to be ABSOLUTELY sure 0 isn't part of 0.5 or 00)
        .replace(/(\+|\-)\s*0(?!\d|\.)/g, '')                                                                     
        
        // Match *1 or /1 ONLY if not followed by another digit (e.g. keeps *10 intact)
        .replace(/\*\s*1(?!\d)/g, '')                                                                         
        .replace(/\/\s*1(?!\d)/g, '')                                                                         
                                                                                                    
        .replace(/\+\s*-\s*/g, '-') // +- -> -                                                     
        .replace(/-\s*-\s*/g, '+')  // -- -> +                                                     
        .replace(/\b1([a-zA-Z])\b/g, '$1') // 1x -> x
        .replace(/^\+\s*/g, '');    // Leading +}
    }

    private evaluateDerivedVariable(derivedVariable: DerivedVariable, variables: GeneratedVariable[]): GeneratedVariable {
        const expressionWithValues = this.insertVariablesIntoExpression(derivedVariable.expression, variables);
        const parsedExpression = parse(expressionWithValues);
        const evaluatedValue = parsedExpression.evaluate();
        return {
            name: derivedVariable.name,
            value: evaluatedValue.toString(),
        };
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
