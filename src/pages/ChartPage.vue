<template>
  <q-page class="flex flex-center">
    <div>{{ getAnswerGroupAnswers() }}</div>
    <doughnut-chart :questionData="qstnData" :answerData="ansrData"></doughnut-chart>
  </q-page>
</template>

<script>
import DoughnutChart from '../components/charts/DoughnutChart';
import AnswerRepository from '../remote/quiz/AnswerRepository';
import QuestionRepository from '../remote/quiz/QuestionRepository';
import QuizFormRepository from '../remote/quiz/QuizFormRepository';
import QuizTemplateRepository from '../remote/quiz/QuizTemplateRepository';

export default {
  name: 'ChartPage',
  components: {
    DoughnutChart
  },
  data () {
    return {
      qstnData: {
        title: "Is this a question?",
        description: "Is this the detailed description of the question?"
      },
      ansrData: [
        {
          letter: "A",
          description: "Yes",
          results: 2478,
          color: '#D739BD',
          correct: false,
          chosen: false
        },
        {
          letter: "B",
          description: "No",
          results: 5267,
          color: '#6FCF97',
          correct: false,
          chosen: true
        },
        {
          letter: "C",
          description: "???",
          results: 734,
          color: '#EB5757',
          correct: true,
          chosen: false
        },
        {
          letter: "D",
          description: "Maybe",
          results: 784,
          color: '#EBEE47',
          correct: false,
          chosen: false
        }
      ]
    }
  },
  methods: {
    getQuestion: function (event) {
      let var_hash = "4d7bae8f423d87473de20f9026d798e7"
      QuestionRepository.getQuestion(var_hash, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
        console.log(response.data.var[0].label)
        this.qstnData.title = response.data.var[0].label
      });
    },
    getAnswer: function (event) {
      let var_option_group_hash = "0bf4821d453e00dee8e489101aff78d0"
      let var_option_name = "3b49sqyed"
      AnswerRepository.getAnswer(var_option_group_hash, var_option_name, this.$store.state.authLogin.token).then((response) => {
        console.log(response.data)
      });
    },
    getAnswerGroup: function (event) {
      let var_option_group_hash = "0bf4821d453e00dee8e489101aff78d0"
      AnswerRepository.getAnswerGroup(var_option_group_hash, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    getAnswerGroupAnswers: function (event) {
      let var_option_group_hash = "0bf4821d453e00dee8e489101aff78d0"
      AnswerRepository.getAnswerGroupAnswers(var_option_group_hash, this.$store.state.authLogin.token).then((response) => {
        console.log('ANSWERS:' + response)
        for (let index = 0; index < response.data.varoptiongroup.length; index++) {
          const element = response.data.varoptiongroup[index];
          this.ansrData[index].description = element.label
        }
      });
    }
  },
  mounted() {
    // this.getQuestion()
    // this.getAnswer()
    // this.getAnswerGroup()
    this.getAnswerGroupAnswers()
  }
}
</script>
