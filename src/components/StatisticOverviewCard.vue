<template>
  <q-card class="completion-card bg-plain">
    <q-card-section class="card-header bg-white">
      <div class="card-toolbar">
        <QuizHeader v-bind:title="label" :timer="false" :progression="parseFloat(this.position+1) / parseFloat(this.questionHashes.length)"/>
      </div>
    </q-card-section>
    <q-card-section vertical align="center">
      <doughnut-chart :overview="true" :questionData="qstnData" :answerData="ansrData"></doughnut-chart>
    </q-card-section>
    <q-card-actions class="absolute-bottom" vertical align="center">
      <div class="q-pa-md q-gutter-sm" style="display: inline-flex;" v-if="lastQuestion">
        <q-btn class="button" v-show="!loading" v-if="this.position >= 1" v-on:click="previous"
          >Previous</q-btn
        >
        <q-btn class="button" v-show="!loading" disable v-if="this.position < 1" v-on:click="previous"
          >Previous</q-btn
        >
        <q-btn
          class="button"
          v-show="!loading"
          v-on:click="finish"
          >Finish</q-btn
        >
      </div>
      <div class="q-pa-md q-gutter-sm" style="display: inline-flex;" v-else>
        <q-btn class="button" v-show="!loading" v-if="this.position >= 1" v-on:click="previous"
          >Previous</q-btn
        >
        <q-btn class="button" v-show="!loading" disable v-if="this.position < 1" v-on:click="previous"
          >Previous</q-btn
        >
        <q-btn class="button" v-show="!loading" v-on:click="next"
          >Next</q-btn
        >
      </div>
    </q-card-actions>
    <q-inner-loading :showing="loading">
      <q-spinner size="50px" color="secondary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import QuizHeader from "../components/QuizHeader";
import DoughnutChart from '../components/charts/DoughnutChart'
import QuestionRepository from "../remote/quiz/QuestionRepository";
import AnswerRepository from "../remote/quiz/AnswerRepository";

export default {
  name: "CompletionCard",
  props: ["label", "questionHashes"],
  methods: {
    next: function() {
      if (this.position >= this.questionHashes.length - 1) {
        return;
      }
      
      this.position++;
      this.loadQuestion();
      
      console.log(this.selectedAnsr)
    },
    previous: function() {
      if (this.position > 1) {
        return;
      }
      
      this.position--;
      this.loadQuestion();
      
      console.log(this.selectedAnsr)
    },
    finish: function() {
      if (this.leaderboardDisplayed) {  
        this.$router.push({ path: '/dashboard' })
      }
      this.leaderboardDisplayed = !this.leaderboardDisplayed
    },
    loadQuestion: function() {
      this.loading = true;
      QuestionRepository.getQuestion(
        this.questionHashes[this.position],
        this.$store.state.authLogin.token
      ).then(response => {
        let data = response.data.var[0];
        AnswerRepository.getAnswerGroup(
          data.vogh,
          this.$store.state.authLogin.token
        ).then(answerGroupResponse => {
          let answerGroupData = answerGroupResponse.data;
          AnswerRepository.getAnswerGroupAnswers(
            answerGroupData.varoptiongroup[0].vogh,
            this.$store.state.authLogin.token
          ).then(answerResponse => {
            this.loading = false;
            console.log(answerResponse.data.varoptiongroup);
            this.question = {
              title: data.label,
              answers: answerResponse.data.varoptiongroup
            };
            this.checkLastQuestion();

            // Doughnut chart data
            this.qstnData.title = data.label
            console.log(answerResponse.data.varoptiongroup)
            let index = 0
            this.currentAnswerGroup = answerResponse.data.varoptiongroup
            answerResponse.data.varoptiongroup.forEach(element => {
              this.ansrData[index].description = element.label
              this.ansrData[index].correct = (element.weight == 1)  
              this.ansrData[index].chosen = false
              this.ansrData[index].results = 0
              index++
            });
          });
        });
      });
    },
    checkLastQuestion: function() {
      if (this.position == this.questionHashes.length - 1) {
        this.lastQuestion = true;
      } else {
        this.lastQuestion = false;
      }
    }
  },
  components: {
    QuizHeader,
    DoughnutChart
  },
  data() {
    return {
      currentAnswerGroup: [],
      selectedAnsr: '',
      chartDisplayed: false,
      leaderboardDisplayed: false,
      position: 0,
      loading: true,
      question: null,
      lastQuestion: false,
      qstnData: {
        title: "Is this a question?",
        description: "Is this the detailed description of the question?"
      },
      ansrData: [
        {
          letter: "A",
          description: "Yes",
          results: 0,
          color: '#D739BD',
          correct: false,
          chosen: false
        },
        {
          letter: "B",
          description: "No",
          results: 0,
          color: '#6FCF97',
          correct: false,
          chosen: false
        },
        {
          letter: "C",
          description: "???",
          results: 0,
          color: '#EB5757',
          correct: false,
          chosen: false
        },
        {
          letter: "D",
          description: "Maybe",
          results: 0,
          color: '#EBEE47',
          correct: false,
          chosen: false
        }
      ],
      usrId: 6,
      ttlData: "Quiz Ranking"
    };
  },
  mounted() {
    this.loadQuestion();
  }
};
</script>
<style lang="scss" scoped>
.completion-card {
  position: fixed;
  background: chocolate;
  width: 100%;
  min-height: calc(100vh - 3rem);
}

@media only screen and (max-width: 600px) {
  .completion-card {
    min-height: $height-without-header-mobile;
  }
}

.button {
  background: #6fcf97;
  color: white;
  width: 80%;
  border-radius: 20px;
}

.bg-plain {
  background-image: linear-gradient(to top, #ffffff 0%, #eeeeee 100%);
}
</style>
