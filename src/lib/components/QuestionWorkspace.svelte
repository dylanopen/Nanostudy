<script lang="ts">
    import { Question, AnswerSubmissionResult } from "$lib/types/question";
    import { checkAnswer } from "$lib/api/question.remote.ts";
    import QuestionDisplay from "$lib/components/QuestionDisplay.svelte";
    import BasicQuestionWorkspace from "$lib/components/BasicQuestionWorkspace.svelte";
    import MultistepQuestionWorkspace from "$lib/components/MultistepQuestionWorkspace.svelte";

    interface Props {
        question: Question;
        submit: (value: string) => void;
    }

    let { question, submit }: Props = $props();

    async function submitAnswer(value) {
        console.log(value, "value");
        let result: AnswerSubmissionResult;
        if (value instanceof AnswerSubmissionResult) {
            console.log("Value is already an AnswerSubmissionResult:", value);
            result = value;
        } else {
            result = await checkAnswer({ questionId: question.id, answerAttempt: value });
        }
        submitCheckedAnswer(result);
    }

    async function submitCheckedAnswer(answer) {
        submit(answer);
    }
</script>

<div class="card">

<QuestionDisplay {question} />

{#if question.type === "basic"}
<BasicQuestionWorkspace {question} submit={submitAnswer} />
{:else if question.type === "multistep"}
<MultistepQuestionWorkspace {question} submit={submitAnswer} />
{:else if question}
    <div>Loading question...</div>
{:else}
    <div>Unsupported question type: {question.type}</div>
{/if}

</div>
