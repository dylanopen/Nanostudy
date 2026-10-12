<script lang="ts">
    const { answerAttempt } = $props();

    import QuestionDisplay from "$lib/components/QuestionDisplay.svelte";
    $inspect(answerAttempt);
</script>


<div>
    Question:
    <QuestionDisplay question={answerAttempt.question} />
</div>

{#if answerAttempt.isCorrect}
<div>Perfect!</div>
<div>Answer: {answerAttempt.question.answer.answers[0]}</div>
{:else}
<div>Not quite right.</div>
<div>Correct answer: {answerAttempt.question.answer.answers[0]}</div>
<div>You answered: {answerAttempt.answerAttempt}</div>
{/if}

{#if answerAttempt.question.answer.hint}
<div>Hint: {answerAttempt.question.answer.hint}</div>
{/if}
{#if answerAttempt.question.answer.explanation}
<div>Explanation: {answerAttempt.question.answer.explanation}</div>
{/if}

