<script lang="ts">
    import BrandIcon from "$lib/components/BrandIcon.svelte";
</script>

<header class="header">
    <a href="/" class="btn btn-link brand nanostudy-icon"><img src="/nanostudy.svg" /></a>
    <a href="/courses" class="btn btn-link">Discover topics</a>
    <a href="/statistics" class="btn btn-link">My progress</a>
</header>

<style>
    .header {
        padding: 0 1.5rem;
        border-bottom: 1px solid var(--nano-border-subtle-color);
        background: var(--nano-bg-primary-color);
    }

    .nanostudy-icon {
        width: 170px;
        padding: 0;
    }
</style>
