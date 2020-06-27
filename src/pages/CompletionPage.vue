<template>
  <q-page class="flex flex-center">
    <CompletionCard
      v-if="questions != null"
      v-bind:label="title"
      v-bind:questions="questions"
      v-bind:theme="theme"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CompletionCard from "../components/CompletionCard";
import QuizTemplateRepository from "../remote/quiz/QuizTemplateRepository";
import QuizFormRepository from "../remote/quiz/QuizFormRepository";

export default {
  name: "CompleteQuiz",
  props: ["title", "questions"],
  data() {
    return {
      questionHashes: null,
      theme: 1
    };
  },
  components: {
    CompletionCard
  }
};
</script>
