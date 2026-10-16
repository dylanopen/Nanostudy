<script lang="ts">
    import { Question, AnswerSubmissionResult } from "$lib/types/question";
    import { checkAnswer } from "$lib/api/question.remote.ts";
    import QuestionDisplay from "$lib/components/QuestionDisplay.svelte";
    import RawInput from "$lib/components/RawInput.svelte";

    interface Props {
        question: Question;
        onSubmit: (value: string) => void;
    }

    let { question, onSubmit }: Props = $props();

    async function submitAnswer(value) {
        let result: AnswerSubmissionResult = await checkAnswer({ questionId: question.id, answerAttempt: value });
        onSubmit(result);
    }
</script>

<div class="card">
<QuestionDisplay {question} />
<RawInput submit={submitAnswer} />
</div>

