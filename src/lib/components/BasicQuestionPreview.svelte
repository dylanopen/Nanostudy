<script lang="ts">
    let { question } = $props();
</script>

<h3>{question.prompt}</h3>

{#if question.type === "basic"}
<p class="answer-text">{question.answer.answers[0]}</p>
{/if}

{#if question.answer.explanation}
<details>
    <summary>View explanation</summary>
    <p>{question.answer.explanation}</p>
</details>
{/if}
