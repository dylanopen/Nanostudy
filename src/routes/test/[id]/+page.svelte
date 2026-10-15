<script lang="ts">
    let { data } = $props();

    import TestWorkspace from "$lib/components/TestWorkspace.svelte";
</script>

<h2>Test: {data.lesson.title}</h2>

<TestWorkspace lesson={data.lesson} questionIds={data.questionIds} />

