<script lang="ts">
    let { question } = $props();

    import BasicQuestionPreview from "$lib/components/BasicQuestionPreview.svelte";
    import MultistepQuestionPreview from "$lib/components/MultistepQuestionPreview.svelte";
</script>

<div class="card question-card">

{#if question.type === "basic"}
<BasicQuestionPreview {question} />
{:else if question.type === "multistep"}
<MultistepQuestionPreview {question} />
{:else}
    <div>Unsupported question type: {question.type}</div>
{/if}

</div>
