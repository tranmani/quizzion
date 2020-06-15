<template>
  <q-page class="flex flex-center">
    <StatisticOverviewCard
      v-if="questionHashes != null && questionHashes.length > 0"
      v-bind:label="label"
      v-bind:questionHashes="questionHashes"
      v-bind:formHash="formHash"
    />

    <Error v-if="questionHashes != null && questionHashes.length == 0" errorCode='404' errorText='No questions associated with quiz'/>

  </q-page>
</template>

<script>
import StatisticOverviewCard from "../components/StatisticOverviewCard";
import Error from "../components/helpers/Error";
import QuizTemplateRepository from "../remote/quiz/QuizTemplateRepository";
import QuizFormRepository from "../remote/quiz/QuizFormRepository";
import QuestionRepository from "../remote/quiz/QuestionRepository";
import Highcharts from 'highcharts'


export default {
  name: "StatisticOverviewQuiz",
  data() {
    return {
      label: "",
      tn: typeof this.$route.params.chosenTemplateHash == 'undefined' ?  "" : this.$route.params.chosenTemplateHash,
      formHash: typeof this.$route.params.chosenFormHash == 'undefined' ?  "" : this.$route.params.chosenFormHash,
      questionHashes: null,
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
      });
    }
  },
  mounted() {
    this.loadTemplateContent();
  }
};
</script>
