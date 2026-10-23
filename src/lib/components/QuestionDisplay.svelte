<script lang="ts">
    let { question } = $props();

    import BasicQuestionDisplay from "$lib/components/BasicQuestionDisplay.svelte";
    import MultistepQuestionDisplay from "$lib/components/MultistepQuestionDisplay.svelte";
</script>

<div class="question-prompt">

{#if question.type === "basic"}
    <BasicQuestionDisplay {question} />
{:else if question.type === "multistep"}
    <MultistepQuestionDisplay {question} />
{:else}
    <div>Loading question display...</div>
{/if}

</div>
