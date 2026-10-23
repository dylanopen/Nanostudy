<script lang="ts">
    let { question } = $props();
</script>

<h3>{question.prompt}</h3>

<p class="answer-text">{question.answer.display()}</p>

{#if question.answer.explanation()}
<details>
    <summary>View explanation</summary>
    <p>{question.answer.explanation()}</p>
</details>
{/if}

