<script lang="ts">
  import "mathlive";
  import type { MathfieldElement, MathfieldElementAttributes } from "mathlive";
  import { on } from "svelte/events";

  type Props = {
    submit: (value: string) => void;
    value?: string;
  } & Partial<MathfieldElementAttributes>;

  let { submit, value = $bindable(""), ...rest }: Props = $props();

  let mathfield: MathfieldElement | undefined = $state();

  const init = (node: MathfieldElement) => {
    mathfield = node;

    $effect(() => {
      if (value !== undefined && node.value !== value) {
        node.value = value;
      }
    });

    $effect(() => {
      return on(node, "input", () => {
        value = node.value;
      });
    });
  };

  function submitInputBox() {
    const rawValue = mathfield?.value ?? value ?? "";
    submit(rawValue);
  }
</script>

<math-field use:init {...rest}></math-field>
<button class="btn btn-accent" onclick={submitInputBox}>Submit</button>
