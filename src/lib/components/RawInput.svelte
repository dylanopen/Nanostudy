<script lang="ts">
    let { submit } = $props();

    function submitInputBox() {
        let inputBox = document.getElementById("input-box");
        let rawValue = inputBox.value;
        submit(rawValue);
    }
</script>

<input type="text" id="input-box" class="text-input text-input-accent" />
<button class="btn btn-accent" onclick={submitInputBox}>Submit</button>

