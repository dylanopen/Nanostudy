<script>
    import renderMathInElement from 'katex/dist/contrib/auto-render';
    import 'katex/dist/katex.min.css';

    let { children } = $props();
    let container = $state();

    function processMathAndTikz(target) {
        if (!target) return;

        const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
        const tikzNodes = [];
        let node;

        while ((node = walker.nextNode())) {
            if (node.nodeValue?.includes('\\begin{tikzpicture}')) {
                tikzNodes.push(node);
            }
        }

        tikzNodes.forEach((textNode) => {
            const parent = textNode.parentNode;
            if (!parent) return;

            const tikzRegex = /\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g;
            const span = document.createElement('span');
            span.innerHTML = textNode.nodeValue.replace(tikzRegex, (match) => {
                const encoded = encodeURIComponent(match.trim());
                const src = `https://kroki.io/tikz/svg?plain=${encoded}`;
                return `<div class="tikz-container" style="text-align:center; margin: 1rem 0;">
                    <img src="${src}" alt="TikZ Diagram" loading="lazy" style="max-width: 100%; height: auto;" />
                </div>`;
            });

            parent.replaceChild(span, textNode);
        });

        renderMathInElement(target, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    }

    $effect(() => {
        if (!container) return;

        // Initial pass
        processMathAndTikz(container);

        const observer = new MutationObserver(() => {
            observer.disconnect();
            processMathAndTikz(container);
            observer.observe(container, { childList: true, subtree: true });
        });

        observer.observe(container, { childList: true, subtree: true });

        return () => observer.disconnect();
    });
</script>

<div bind:this={container}>
    {@render children()}
</div>
