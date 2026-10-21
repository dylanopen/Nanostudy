<script>
	import renderMathInElement from 'katex/dist/contrib/auto-render';
	import 'katex/dist/katex.min.css';

	let { children } = $props();
	let container = $state();

	// Helper to build a Kroki SVG URL from raw TikZ code
	function formatTikzSrc(tikzCode) {
		// Clean leading/trailing spaces and encode string safely for URL
		const cleaned = tikzCode.trim();
		const encoded = encodeURIComponent(cleaned);
		return `https://kroki.io/tikz/svg?plain=${encoded}`;
	}

	$effect(() => {
		if (!container) return;

		// 1. Intercept TikZ blocks and replace with rendered SVGs
		const tikzRegex = /\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g;
		const originalHtml = container.innerHTML;

		if (tikzRegex.test(originalHtml)) {
			container.innerHTML = originalHtml.replace(tikzRegex, (match) => {
				const src = formatTikzSrc(match);
				return `<div class="tikz-container" style="text-align:center; margin: 1rem 0;">
					<img src="${src}" alt="TikZ Diagram" loading="lazy" style="max-width: 100%; height: auto;" />
				</div>`;
			});
		}

		// 2. Run KaTeX for standard math delimiters ($...$ and $$...$$)
		renderMathInElement(container, {
			delimiters: [
				{ left: '$$', right: '$$', display: true },
				{ left: '$', right: '$', display: false }
			],
			throwOnError: false
		});
	});
</script>

<div bind:this={container}>
	{@render children()}
</div>
