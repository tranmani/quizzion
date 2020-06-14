<template>
  <q-page class="flex flex-center">
    <CompletionCard
      v-if="questionHashes != null"
      v-bind:label="label"
      v-bind:questionHashes="questionHashes"
    />
  </q-page>
</template>

<script>
import CompletionCard from "../components/CompletionCard";
import QuizTemplateRepository from "../remote/quiz/QuizTemplateRepository";
export default {
  name: "CompleteQuiz",
  data() {
    return {
      label: "",
      tn: "47m2d7j6j",
      questionHashes: null
    };
  },
  components: {
    CompletionCard
  },
  methods: {
    loadTemplateContent: function() {
      //   if (ten == null) {
      //       return;
      //   }
      QuizTemplateRepository.getTemplate(
        this.tn,
        this.$store.state.authLogin.token
      ).then(response => {
        this.label = response.data.template.label;
      });

      QuizTemplateRepository.getTemplateContent(
        this.tn,
        this.$store.state.authLogin.token
      ).then(response => {
        let data = response.data;
        let content = data.content.content;
        let questionHashes = JSON.parse(content).questions
        this.questionHashes = questionHashes;
        console.log(questionHashes);
      });
    }
  },
  mounted() {
    this.loadTemplateContent();
  }
};
</script>
