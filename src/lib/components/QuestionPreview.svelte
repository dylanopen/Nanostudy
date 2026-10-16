<script lang="ts">
    let { question } = $props();
</script>

<div class="card">
    <h3>{question.prompt}</h3>

    {#if question.type === "basic"}
        <p class="answer">{question.answer.answers[0]}</p>
    {/if}

    {#if question.answer.explanation}
        <details>
            <summary>View explanation</summary>
            <p>{question.answer.explanation}</p>
        </details>
    {/if}
</div>

<style>
    h3 {
        font-size: 1.125rem;
        padding-bottom: 0.375rem;
    }

    .card {
        margin: 0.7rem 0;
    }

    .answer {
        font-weight: 600;
        color: var(--nano-fg-primary-color);
    }

    details {
        margin-top: 0.75rem;
        padding: 0.5rem 0.75rem;
        background-color: var(--nano-bg-secondary-color);
        border: 1px solid var(--nano-border-subtle-color);
        border-radius: 8px;
    }

    summary {
        cursor: pointer;
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--nano-fg-accent-color);
    }

    details p {
        margin-top: 0.375rem;
        font-size: 0.875rem;
    }
</style>
