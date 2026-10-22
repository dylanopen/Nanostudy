<script lang="ts">
    let { question, submit } = $props();

    import { AnswerSubmissionResult } from "$lib/types/question.ts";

    import QuestionWorkspace from "$lib/components/QuestionWorkspace.svelte";
    import RawInput from "$lib/components/RawInput.svelte";
    import AnswerFeedback from "$lib/components/AnswerFeedback.svelte";
    import QuestionPreview from "$lib/components/QuestionPreview.svelte";

    var currentStepIndex = $state(1);
    var currentStep = $derived(question.steps[currentStepIndex-1]);
    $inspect(currentStep, "currentStep");
    $inspect(question);
    var answers = []
    var currentAnswerAttempt = $state(null);

    async function submitAnswer(attempt) {
        currentAnswerAttempt = attempt;
        answers.push(attempt);
        if (currentStepIndex >= question.steps.length) {
            finishQuestion();
        }
    }

    async function advanceStep() {
        currentAnswerAttempt = null;
        currentStepIndex++;
    }

async function finishQuestion() {
    let result = new AnswerSubmissionResult(
        $state.snapshot(question),
        answers.every(a => a.isCorrect),
        undefined,
        $state.snapshot(answers)
    );
    submit(result);
}
</script>

{#each question.steps.slice(0, currentStepIndex-1) as step, stepIndex}
<QuestionPreview question={step} />
{/each}

{#if currentAnswerAttempt === null}
<div class="card">
    <p>Step {currentStepIndex}</p>
    <QuestionWorkspace question={currentStep} submit={submitAnswer} />
</div>
{:else}
<div class="card">
    <AnswerFeedback answerAttempt={currentAnswerAttempt} />
    <div>
        {#if currentStepIndex < question.steps.length}
        <button class="btn" onclick={advanceStep}>Next Step</button>
        {/if}
    </div>
</div>
{/if}

