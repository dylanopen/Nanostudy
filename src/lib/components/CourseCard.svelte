<script lang="ts">
    import Badge from "./Badge.svelte";
    let { course } = $props();
</script>

<a href="/course/{course.id}">
    <div class="card darken-on-hover">
        <Badge color=darkorange text={course.level} />
        <Badge color=lightgreen text={course.examBoard} />
        <br/>
        <div class="course-title">{course.title}</div>
    </div>
</a>

<style>
div {
    display: inline-block;
}

.card {
    margin: 0.5rem;
}

.course-title {
    font-size: 1.2rem;
}
</style>

