<script lang="ts">
    let { question, submit } = $props();

    import BasicQuestionDisplay from "$lib/components/BasicQuestionDisplay.svelte";
    import MathsInput from "$lib/components/MathsInput.svelte";
</script>

<MathsInput submit={submit} />
