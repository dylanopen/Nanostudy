<script lang="ts">
    import RawInput from "$lib/components/RawInput.svelte"
    import QuestionWorkspace from "$lib/components/QuestionWorkspace.svelte";
    import AnswerFeedback from "$lib/components/AnswerFeedback.svelte";
    import TestCompletionSummary from "$lib/components/TestCompletionSummary.svelte";
    import { getQuestion } from "$lib/api/question.remote.ts";

    let { data } = $props();
    let currentQuestionNumber = $state(1);
    let currentQuestionId = $derived(data.questionIds[currentQuestionNumber - 1]);
    let currentQuestion = $state({});

    let questionAttempts = $state([]);

    let currentAnswerAttempt = $state(null);

    $effect(async () => {
        currentQuestion = await getQuestion({ questionId: currentQuestionId });
    });

    async function submitAnswer(value) {
        currentAnswerAttempt = value;
        questionAttempts.push(currentAnswerAttempt);
    }

    async function advanceQuestion() {
        currentAnswerAttempt = null;
        currentQuestionNumber++;
    }
</script>

<h2>Test: {data.lesson.title}</h2>

{#if currentQuestionNumber <= data.questionIds.length}

<p>Question {currentQuestionNumber} of {data.questionIds.length}</p>
<hr/>

{#if currentAnswerAttempt === null}
<QuestionWorkspace question={currentQuestion} onSubmit={submitAnswer} />
{:else}
<AnswerFeedback answerAttempt={currentAnswerAttempt} />
<div>
<button onclick={advanceQuestion}>Next Question</button>
</div>
{/if}

{:else}
<TestCompletionSummary lesson={data.lesson} results={questionAttempts} />
{/if}

