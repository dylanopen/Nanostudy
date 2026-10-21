<script lang="ts">
    import './layout.css';
    import Header from "../lib/components/Header.svelte";
    import favicon from '$lib/assets/favicon.svg';

    let { children } = $props();

    $effect(() => {
        const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        //const theme = isLight ? 'light-mode' : 'dark-mode';
        //document.documentElement.classList.add(theme);
    });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Header/>

<div class="content">
    {@render children()}
</div>

