<script lang="ts">
    let { question, onSubmit } = $props();
</script>

<div class="question-prompt">{question.prompt}</div>

<style>
.question-prompt {
    font-size: 1.25rem;
    padding: 0.75rem;
}
</style>

