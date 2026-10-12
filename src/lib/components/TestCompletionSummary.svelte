<script lang="ts">
    import { AnswerSubmissionResult } from "$lib/types/question";
    import { Lesson } from "$lib/types/lesson";
    import AnswerFeedback from "$lib/components/AnswerFeedback.svelte";

    interface Props {
        lesson: Lesson;
        results: AnswerSubmissionResult[];
    }
    let { lesson, results }: Props = $props();

    let correctCount = $derived(results.filter(r => r.isCorrect).length);
    let correctPercentage = $derived(Math.round((correctCount / results.length) * 100));
</script>

<h2>Test complete!</h2>

<p>You answered {correctCount} out of {results.length} questions correctly ({correctPercentage}%).</p>
<p>Here's a breakdown of exactly what went well, and the topics you should work on next:</p>

<hr />
{#each results as result}
<AnswerFeedback answerAttempt={result} />
<hr />
{/each}

<div>
    <a href="/home">Return to home</a>
</div>

