<template>
  <q-card
    class="completion-card"
    v-bind:class="[!this.chartDisplayed ? 'theme-'+this.theme : 'bg-plain']"
  >
    <q-card-section class="card-header bg-white">
      <div class="card-toolbar">
        <QuizHeader :title="label" :timer="true" :progression="parseFloat(this.position+1) / parseFloat(this.questions.length)" v-bind:socket="socket" />
      </div>
    </q-card-section>
    <!--
    {{ questions }}
    ----
    {{ this.qstnData}}
    ----
    {{ this.ansrData }}
    ----
    {{ this.$store.state.authLogin.token }}
    -->
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
  props: ["label", "questions", "theme", "socket"],//, "userHash", "userToken", "userName", "userAvatarUrl"],
  methods: {
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
      USER_TOKEN: typeof this.$route.params.userToken == "undefined"
        ? "1122bce5787fb1169d53399797ebd40136c2b11badc0b2c70eb1506540438ef40d1328bf7c11e6cc0e0f07757c9506485b16b4cc0124e40c2c07b0aacaff2d90"
        : this.$route.params.userToken,
      uh: typeof this.$route.params.userHash == "undefined"
        ? ""
        : this.$route.params.userHash,
      currentAnswerGroup: [],
      selectedAnsr: '',
      chartDisplayed: false,
      leaderboardDisplayed: false,
      position: 0,
      loading: true,
      question: null,
      lastQuestion: false,
      usrId: 1,
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
      qstnData: {
        title: ""
      },
      usrData: [
        {
          id: 1,
          username: typeof this.$route.params.userName == "undefined"
            ? "Hardcoded Name"
            : this.$route.params.userName,//this.$store.state.authLogin.user.username,
          score: 100,
          avatarUrl: typeof this.$route.params.userAvatarUrl == "undefined"
            ? ""
            : this.$route.params.userAvatarUrl
        }
      ],
      ansrData: [
        /*
        {
          letter: "A",
          description: "Yes",
          results: 0,
          color: '#D739BD',
          correct: false,
          chosen: false
        }
        */
      ],
      ansrColors: ['#D739BD','#6FCF97','#EB5757','#EBEE47'],
      ansrLetters: ['A','B','C','D']
    };
  },
  mounted() {
    this.loadQuestion();
  },
  methods: {
    getSelectedAnswer: function(value) {
      this.selectedAnsr = value
      this.updateSelectedAnswer(value)
      console.log(value)
      console.log("Hash " + this.$route.params.userHash)
      console.log("Token " + this.$route.params.userToken + " -> " + this.USER_TOKEN)
      console.log("Name " + this.$route.params.userName)
      console.log("Avatar " + this.$route.params.userAvatarUrl)
    },
    next: function() {
      if (this.position >= this.questions.length - 1 && this.chartDisplayed) {
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
      let question = this.questions[this.position]
      let questionAnswers = question.answerGroup.answers
      console.log('!!!!!!!!!!!!!!', question, " ", questionAnswers)
      this.question = {
        title: question.label,
        answers: questionAnswers
      };
      this.checkLastQuestion();
      this.qstnData.title = question.label


      let index = 0
      if (this.ansrData.length == 0) {
        questionAnswers.forEach(element => {
          this.ansrData.push(
            {
              'letter': this.ansrLetters[index],
              'description': element.label,
              'results': 0,
              'color': this.ansrColors[index],
              'correct': (element.weight >= 1 || element.value >= 1),
              'chosen': false
            }
          )
          index++
        });
      }
      
      this.currentAnswerGroup = questionAnswers
      this.loading = false;
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
      if (this.position == this.questions.length - 1) {
        this.lastQuestion = true;
      } else {
        this.lastQuestion = false;
      }
    }
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
