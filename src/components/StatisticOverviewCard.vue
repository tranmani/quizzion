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
      bg: "bg1",
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
    let random = Math.floor(Math.random() * 7);
    switch (random) {
      case 0:
        return (this.bg = "bg1");
      case 1:
        return (this.bg = "bg2");
      case 2:
        return (this.bg = "bg3");
      case 3:
        return (this.bg = "bg4");
      case 4:
        return (this.bg = "bg5");
      case 5:
        return (this.bg = "bg6");
      case 6:
        return (this.bg = "bg7");
    }
  }
};
</script>
<style scoped>
.completion-card {
  position: fixed;
  background: chocolate;
  width: 100%;
  max-height: calc(100vh - 50px);
  min-height: calc(100vh - 50px);
}
.button {
  background: #6fcf97;
  color: white;
  width: 80%;
  border-radius: 20px;
}

.bg1 {
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}
.bg2 {
  background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
}
.bg3 {
  background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
}
.bg4 {
  background-image: linear-gradient(120deg, #fccb90 0%, #d57eeb 100%);
}
.bg5 {
  background-image: linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%);
}
.bg6 {
  background-image: linear-gradient(to top, #9795f0 0%, #fbc8d4 100%);
}
.bg7 {
  background-image: linear-gradient(to top, #d9afd9 0%, #97d9e1 100%);
}
.bg-plain {
  background-image: linear-gradient(to top, #ffffff 0%, #eeeeee 100%);
}
</style>
