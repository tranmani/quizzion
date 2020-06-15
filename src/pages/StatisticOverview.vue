<template>
  <q-page class="flex flex-center">
    <StatisticOverviewCard
      v-if="questionHashes.length > 0"
      v-bind:label="label"
      v-bind:questionHashes="questionHashes"
    />

    <Error v-if="questionHashes.length == 0" errorCode='404' errorText='No questions associated with quiz'/>
  </q-page>
</template>

<script>
import StatisticOverviewCard from "../components/StatisticOverviewCard";
import Error from "../components/helpers/Error";
import QuizTemplateRepository from "../remote/quiz/QuizTemplateRepository";
export default {
  name: "StatisticOverviewQuiz",
  data() {
    return {
      label: "",
      tn: typeof this.$route.params.chosenTemplateHash == 'undefined' ?  "" : this.$route.params.chosenTemplateHash,
      questionHashes: null
    };
  },
  components: {
    StatisticOverviewCard,
    Error
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
        if (questionHashes == null) {
          questionHashes = []
        }
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
