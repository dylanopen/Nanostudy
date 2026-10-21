<script lang="ts">
    let { question } = $props();

    let finalAnswer = $derived(question.steps[question.steps.length - 1].answer.answers[0]);
    import QuestionPreview from "$lib/components/QuestionPreview.svelte";
</script>

<h3>{question.prompt}</h3>
<p class="answer-text">{finalAnswer}</p>

<details>
    <summary>View steps</summary>
    {#each question.steps as step, index}
        <div class="step">
            <QuestionPreview question={step} />
        </div>
    {/each}
</details>
