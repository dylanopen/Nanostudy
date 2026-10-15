<script lang="ts">
    let { color, text } = $props();
</script>

<span class="badge" style="--badge-color: {color}">{text}</span>

<style>
    .badge {
        border: 1px solid var(--badge-color);
        background-color: color-mix(in srgb, var(--badge-color) 50%, transparent);
    }
</style>

