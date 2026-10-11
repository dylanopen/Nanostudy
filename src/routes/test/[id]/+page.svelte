<script lang="ts">
    import RawInput from "$lib/components/RawInput.svelte"
    import { getQuestion, checkAnswer } from "./questions.remote.ts";

    let { data } = $props();
    let currentQuestionNumber = $state(1);
    let currentQuestionId = $derived(data.questionIds[currentQuestionNumber - 1]);
    let currentQuestion = $state({});

    let answerIsCorrect = $state(null);
    let currentCorrectAnswer = $state(null)
    let currentAnswerAttempt = $state(null);

    $effect(async () => {
        currentQuestion = await getQuestion({ questionId: currentQuestionId });
    });

    async function submitAnswer(value) {
        [answerIsCorrect, currentCorrectAnswer] = await checkAnswer({ questionId: currentQuestionId, answerAttempt: value });
        currentAnswerAttempt = value;
    }

    async function advanceQuestion() {
        answerIsCorrect = null;
        currentCorrectAnswer = null;
        currentAnswerAttempt = null;
        currentQuestionNumber++;
    }

    $inspect(currentQuestion);
</script>

<h2>Test: {data.lesson.title}</h2>

<p>Question {currentQuestionNumber} of {data.questionIds.length}</p>

<hr/>

<p>{currentQuestion.prompt}</p>

{#if answerIsCorrect == null}
<RawInput submit={submitAnswer} />
{:else}
<div>Your answer: {currentAnswerAttempt}</div>
{/if}

{#if answerIsCorrect}
<div>Perfect!</div>
{/if}
{#if answerIsCorrect == false}
<div>Not quite right.</div>
{/if}

{#if answerIsCorrect != null}
<div>Explanation: {currentCorrectAnswer.explanation}</div>
<div>Hint: {currentCorrectAnswer.hint}</div>
<div>
<button onclick={advanceQuestion}>Next Question</button>
</div>
{/if}
