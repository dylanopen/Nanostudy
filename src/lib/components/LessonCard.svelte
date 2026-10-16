<script lang="ts">
    let { lesson, classes } = $props();
</script>

<a class="btn btn-link {classes}" href="/lesson/{lesson.id}">{lesson.title}</a>

<style>
a {
    text-align: left;
}
</style>
