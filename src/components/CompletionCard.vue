<template>
  <q-card class="completion-card" v-bind:class="[!this.chartDisplayed ? 'theme-'+this.theme : 'bg-plain']">
    <q-card-section class="card-header bg-white">
      <div class="card-toolbar">
        <QuizHeader v-bind:title="label" :timer="true" :progression="parseFloat(this.position+1) / parseFloat(this.questionHashes.length)"/>
      </div>
    </q-card-section>

    <q-card-section vertical align="center">
      <CompletionQuestionCard
        v-on:selected="getSelectedAnswer"
        v-if="question !== null && !this.chartDisplayed"
        v-show="!loading"
        :question="question"
      />
      <doughnut-chart v-if="this.chartDisplayed && !this.leaderboardDisplayed" :questionData="qstnData" :answerData="ansrData"></doughnut-chart>
      <mini-leaderboard-component v-if="this.chartDisplayed && !this.leaderboardDisplayed" :titleData="ttlData" :userData="usrData" :colorData="clrData"></mini-leaderboard-component>
    
      <leaderboard-component v-if="this.chartDisplayed && this.leaderboardDisplayed" :userId="usrId" :titleData="ttlData" :userData="usrData" :colorData="clrData"></leaderboard-component>
      </q-card-section>
    <q-card-actions class="absolute-bottom" vertical align="center">
      <q-btn
        class="button"
        v-show="!loading"
        v-if="lastQuestion && this.chartDisplayed"
        v-on:click="finish"
        >Finish</q-btn
      >
      <q-btn class="button" v-show="!loading" v-if="(!lastQuestion || !this.chartDisplayed) && this.selectedAnsr != ''" v-on:click="next"
        >Next</q-btn
      >
      <q-btn class="button" v-show="!loading" disabled v-if="(!lastQuestion || !this.chartDisplayed) && this.selectedAnsr == ''"
        >Next</q-btn
      >
    </q-card-actions>
    <q-inner-loading :showing="loading">
      <q-spinner size="50px" color="secondary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import QuizHeader from "../components/QuizHeader";
import DoughnutChart from '../components/charts/DoughnutChart'
import LeaderboardComponent from '../components/charts/LeaderboardComponent'
import MiniLeaderboardComponent from '../components/charts/MiniLeaderboardComponent'
import CompletionQuestionCard from "../components/CompletionQuestionCard";
import QuestionRepository from "../remote/quiz/QuestionRepository";
import AnswerRepository from "../remote/quiz/AnswerRepository";

export default {
  name: "CompletionCard",
  props: ["label", "questionHashes", "theme"],
  methods: {
    getSelectedAnswer: function(value) {
      this.selectedAnsr = value
      this.updateSelectedAnswer(value)
      console.log(value)
    },
    next: function() {
      if (this.position >= this.questionHashes.length - 1 && this.chartDisplayed) {
        return;
      }
      if (this.chartDisplayed) {
        this.position++;
        this.loadQuestion();
        this.selectedAnsr = ''
      }
      this.chartDisplayed = !this.chartDisplayed
      console.log('selected answer')
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
            console.log("TESTIN " + answerResponse.data.varoptiongroup)
            let index = 0
            this.currentAnswerGroup = answerResponse.data.varoptiongroup
            answerResponse.data.varoptiongroup.forEach(element => {
              this.ansrData[index].description = element.label
              this.ansrData[index].correct = (element.weight == 1 || element.value == 1)  
              this.ansrData[index].chosen = false
              this.ansrData[index].results = 0
              index++
            });
          });
        });
      });
    },
    updateSelectedAnswer: function(chosenAnswerName) {
      let index = 0
      console.log("CHOSEN ANSWER NAME " + chosenAnswerName + "!!")
      console.log(chosenAnswerName)
      this.currentAnswerGroup.forEach(element => {
        if (element.name == chosenAnswerName) {
          this.ansrData[index].results++
          this.ansrData[index].chosen = true
        } else {
          this.ansrData[index].results = 0
          this.ansrData[index].chosen = false
        }
        index++
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
    CompletionQuestionCard,
    DoughnutChart,
    LeaderboardComponent,
    MiniLeaderboardComponent
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
      bg: 1,
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
      ttlData: "Quiz Ranking",
      clrData: {
        transparent: "rgb(255,255,255, 0.0)",

        firstPlace: "rgb(241, 244, 58, 0.9)",
        firstPlaceBorder: "rgb(241, 244, 58)",
        firstPlaceText: "rgb(203, 207, 35)",

        secondPlace: "rgb(196, 196, 196, 0.9)",
        secondPlaceBorder: "rgb(196, 196, 196)",
        secondPlaceText: "rgb(153, 153, 153)",

        thirdPlace: "rgb(198, 170, 85, 0.9)",
        thirdPlaceBorder: "rgb(198, 170, 85)",
        thirdPlaceText: "rgb(171, 148, 79)"
      },
      usrData: [
        {
          id: 1,
          username: this.$store.state.authLogin.user.username,//"User 1",
          score: 100
        },
        {
          id: 2,
          username: "User 2",
          score: 80
        },
        {
          id: 3,
          username: "User 3",
          score: 70
        },
        {
          id: 4,
          username: "User 4",
          score: 60
        },
        {
          id: 5,
          username: "User 5",
          score: 50
        },
        {
          id: 6,
          username: "User 6",
          score: 40
        },
        {
          id: 7,
          username: "User 7",
          score: 30
        },
        {
          id: 8,
          username: "User 8",
          score: 20
        },
        {
          id: 9,
          username: "User 9",
          score: 10
        }
      ]
    };
  },
  mounted() {
    this.loadQuestion();
  }
};
</script>
<style lang="scss" scoped>
.completion-card {
  width: 100%;
  min-height: $height-without-header;
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
