import { fetchMathsQuestionById } from "$lib/api/question.remote";
import { Question } from "$lib/types/question/question";
import { Answer } from "$lib/types/question/answer";
import { parse, compare } from "@khanacademy/kas";
import { evaluate, number, round } from "mathjs";

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
        public markingType: string,
    ) {
        super()
    }

    public display(): string {
        let displayAnswer = this.validAnswers[0];
        if (this.markingType === "approx") {
            displayAnswer = round(evaluate(displayAnswer), 2)
                .toString().replace(/\.0+$/, '') // remove trailing zeros;
        }
        return "$" + displayAnswer + "$";
    }

    public hint(): string | null {
        return this.mathsHint;
    }

    public explanation(): string | null {
        return this.mathsExplanation;
    }

    public isCorrect(studentAnswer: string): boolean {
        console.log(this.markingType);
        if (this.markingType == "cas") {
            return this.isCorrectCas(studentAnswer);
        } else if (this.markingType == "approx") {
            console.log(`\n--- STARTING isCorrect APPROX CHECK ---`);
            return this.isValidApprox(studentAnswer);
        }
        throw new Error(`Unknown marking type: ${this.markingType}`);
    }

    public isCorrectCas(studentAnswer: string): boolean {
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

/**
 * Validates a student's answer against a list of acceptable correct answer keys.
 * Allows any length of precision, but enforces correct mathematical rounding.
 * 
 * @param studentAnswer - The raw string from the input field (e.g., "0.23")
 * @returns boolean - True if the student's answer is correctly rounded against any valid answer.
 */
    public isValidApprox(studentAnswer: string): boolean {                                 
        console.log('--- STARTING APPROXIMATION VALIDATION ---');
        console.log(`Raw studentAnswer input: "${studentAnswer}"`);
        console.log(`Available validAnswers to check against:`, this.validAnswers);

        for (let exactAnswer of this.validAnswers) {                                       
            console.log(`\nChecking against exactAnswer target: "${exactAnswer}"`);

            // Clean and parse all the inputs values I'm taking to nice clean exact numbers
            const studentStr = String(studentAnswer).trim();                               
            if (!studentStr) {
                console.log('↳ Loop Step Failed: studentStr is empty after trimming.');
                return false;                                                 
            }

            let studentNum: number;
            let exactNum: number;

            try {
                studentNum = number(evaluate(studentStr)) as number;                               
                exactNum = number(evaluate(String(exactAnswer))) as number;                        
                console.log(`↳ MathJS Parse: studentNum = ${studentNum}, exactNum = ${exactNum}`);
            } catch (error) {
                console.error(`↳ MathJS Parse Error for target "${exactAnswer}":`, error);
                continue; // Skip to next answer key if parsing fails
            }

            // Determine the decimal precision provided by the student                     
            // Split by decimal point to see how many decimal places they wrote            
            const decimalPart = studentStr.split('.')[1];                                  
            const precision = decimalPart ? decimalPart.length : 0;                        
            console.log(`↳ Precision Scan: "${studentStr}" -> decimal part: "${decimalPart || ''}" -> precision level: ${precision}`);

            // Dynamically round the exact answer to the student's precision level         
            // math.round(0.23456, 2) -> 0.23                                              
            // math.round(0.23456, 3) -> 0.235                                             
            const dynamicallyRoundedExact = round(exactNum, precision);                    
            console.log(`↳ Rounding Action: round(${exactNum}, ${precision}) produced: ${dynamicallyRoundedExact}`);

            // Check for a strict match against the rounded target                         
            const isMatch = studentNum === dynamicallyRoundedExact;
            console.log(`↳ Final Match Check: ${studentNum} === ${dynamicallyRoundedExact} -> Result: ${isMatch}`);

            if (isMatch) {                                  
                console.log('🎉 SUCCESS: Valid match found! Stopping loop.');
                console.log('--- ENDING APPROXIMATION VALIDATION ---');
                return true;                                                               
            }                                                                              
        }                                                                                  

        console.log('❌ FAILURE: Checked all valid answers, no matches succeeded.');
        console.log('--- ENDING APPROXIMATION VALIDATION ---');
        return false;                                                                      
    }

}

