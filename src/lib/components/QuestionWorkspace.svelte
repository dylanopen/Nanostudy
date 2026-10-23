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

    $inspect(question, "question");

    async function submitAnswer(value) {
        let result: AnswerSubmissionResult;
        if (value instanceof AnswerSubmissionResult) {
            result = value;
        } else {
            let isCorrect = question.answer.isCorrect(value);
            result = new AnswerSubmissionResult(question, isCorrect, value);
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
{:else}
    <div>Loading question workspace...</div>
{/if}

</div>
