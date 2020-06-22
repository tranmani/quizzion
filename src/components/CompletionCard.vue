<template>
  <q-card
    class="completion-card"
    v-bind:class="[!this.chartDisplayed ? 'theme-'+this.theme : 'bg-plain']"
  >
    <q-card-section class="card-header bg-white">
      <div class="card-toolbar">
        <QuizHeader
          :title="label"
          :timer="true"
          :progression="parseFloat(this.position+1) / parseFloat(this.questions.length)"
          v-bind:socket="socket"
          v-on:timerFinish="timesUp"
        />
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
      <doughnut-chart
        v-if="this.chartDisplayed && !this.leaderboardDisplayed"
        :questionData="qstnData"
        :answerData="ansrData"
      ></doughnut-chart>
      <mini-leaderboard-component
        v-if="this.chartDisplayed && !this.leaderboardDisplayed"
        :userHash="uh"
        :userData="usrData"
        :colorData="clrData"
      ></mini-leaderboard-component>

      <leaderboard-component
        v-if="this.chartDisplayed && this.leaderboardDisplayed"
        :userHash="uh"
        :userData="usrData"
        :colorData="clrData"
      ></leaderboard-component>
    </q-card-section>
    <q-card-actions class="absolute-bottom" vertical align="center">
      <q-btn
        class="button"
        v-show="!loading"
        v-if="lastQuestion && this.chartDisplayed"
        v-on:click="finish"
      >Finish</q-btn>
      <q-btn
        class="button"
        v-show="!loading"
        v-if="(!lastQuestion || !this.chartDisplayed) && this.selectedAnsr != ''"
        v-on:click="next"
      >Next</q-btn>
      <q-btn
        class="button"
        v-show="!loading"
        disabled
        v-if="(!lastQuestion || !this.chartDisplayed) && this.selectedAnsr == ''"
      >Next</q-btn>
    </q-card-actions>
    <q-inner-loading :showing="loading">
      <q-spinner size="50px" color="secondary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import QuizHeader from "../components/QuizHeader";
import DoughnutChart from "../components/charts/DoughnutChart";
import LeaderboardComponent from "../components/charts/LeaderboardComponent";
import MiniLeaderboardComponent from "../components/charts/MiniLeaderboardComponent";
import CompletionQuestionCard from "../components/CompletionQuestionCard";
import QuestionRepository from "../remote/quiz/QuestionRepository";
import AnswerRepository from "../remote/quiz/AnswerRepository";
import QuizFormRepository from "../remote/quiz/QuizFormRepository";

export default {
  name: "CompletionCard",
  props: ["label", "questions", "theme", "socket"], //, "userHash", "userToken", "userName", "userAvatarUrl", "formHash", "participants"],
  methods: {},
  components: {
    QuizHeader,
    CompletionQuestionCard,
    DoughnutChart,
    LeaderboardComponent,
    MiniLeaderboardComponent
  },
  data() {
    return {
      USER_TOKEN:
        typeof this.$route.params.userToken == "undefined"
          ? ""
          : this.$route.params.userToken,
      uh:
        typeof this.$route.params.userHash == "undefined"
          ? ""
          : this.$route.params.userHash,
      formHash:
        typeof this.$route.params.formHash == "undefined"
          ? ""
          : this.$route.params.formHash,
      currentAnswerGroup: [],
      selectedAnsr: "",
      chartDisplayed: false,
      leaderboardDisplayed: false,
      position: 0,
      questionDone: 0,
      loading: true,
      question: null,
      lastQuestion: false,
      pointsToReceive: 0,
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
      usrData:
        typeof this.$route.params.participants == "undefined"
          ? []
          : this.$route.params.participants,
      /*[
        
        {
          id: 1,
          username: typeof this.$route.params.userName == "undefined"
            ? "Hardcoded Name"
            : this.$route.params.userName,//this.$store.state.authLogin.user.username,
          score: 100,
          avatarUrl: typeof this.$route.params.userAvatarUrl == "undefined"
            ? ""
            : this.$route.params.userAvatarUrl,
          userHash: typeof this.$route.params.userHash == "undefined"
            ? ""
            : this.$route.params.userHash
        },
        {
          id: 2,
          username: "HRDNM_1",
          score: 101,
          avatarUrl: "https://api.adorable.io/avatar/2",
          userHash: ""
        },
        {
          id: 3,
          username: "HRDNM_2",
          score: 1098,
          avatarUrl: "https://api.adorable.io/avatar/3",
          userHash: ""
        },
        {
          id: 4,
          username: "HRDNM_3",
          score: 23,
          avatarUrl: "https://api.adorable.io/avatar/4",
          userHash: ""
        },
        {
          id: 5,
          username: "HRDNM_4",
          score: 12312,
          avatarUrl: "https://api.adorable.io/avatar/5",
          userHash: ""
        }
      ]*/ ansrData: [
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
      ansrColors: ["#D739BD", "#6FCF97", "#EB5757", "#EBEE47"],
      ansrLetters: ["A", "B", "C", "D"]
    };
  },
  mounted() {
    this.loadQuestion();
    // TODO should be called after every submittion (an optimized version when it gets inserted prob - insertion sort?)
    this.sortUserDataBasedOnScore();
  },
  methods: {
    sortUserDataBasedOnScore() {
      console.log("before sort ", this.usrData);
      this.usrData.sort((a, b) => (a.score <= b.score ? 1 : -1));
      console.log("after sort ", this.usrData);
    },
    getSelectedAnswer: function(value) {
      this.selectedAnsr = value;
      this.updateSelectedAnswer(value);
      console.log(value);

      console.log("Hash " + this.$route.params.userHash);
      console.log(
        "Token " + this.$route.params.userToken + " -> " + this.USER_TOKEN
      );
      console.log("Name " + this.$route.params.userName);
      console.log("Avatar " + this.$route.params.userAvatarUrl);
      console.log("Form Hash " + this.$route.params.formHash);
      console.log("Participants ", this.$route.params.participants);
    },
    next: function() {
      if (this.position >= this.questions.length - 1 && this.chartDisplayed) {
        return;
      }
      if (this.chartDisplayed) {
        this.getBulkData();
        this.position++;
        this.loadQuestion();
        this.selectedAnsr = "";
      } else {
        this.submitAnswerToForm();
      }
      this.chartDisplayed = !this.chartDisplayed;
      this.questionDone++;
      console.log("selected answer");
      console.log(this.selectedAnsr);
    },
    finish: function() {
      this.getBulkData();
      if (this.leaderboardDisplayed) {
        this.$router.push({ path: "/dashboard" });
      }
      if (!this.leaderboardDisplayed) this.leaderboardDisplayed = true;
    },
    loadQuestion: function() {
      this.loading = true;
      let question = this.questions[this.position];
      let questionAnswers = question.answerGroup.answers;
      console.log("!!!!!!!!!!!!!!", question, " ", questionAnswers);
      this.question = {
        title: question.label,
        answers: questionAnswers
      };
      this.checkLastQuestion();
      this.qstnData.title = question.label;

      let index = 0;
      if (this.ansrData.length == 0) {
        questionAnswers.forEach(element => {
          this.ansrData.push({
            letter: this.ansrLetters[index],
            description: element.label,
            results: 0,
            color: this.ansrColors[index],
            correct: element.weight >= 1 || element.value >= 1,
            chosen: false
          });
          index++;
        });
      }

      this.currentAnswerGroup = questionAnswers;
      this.loading = false;
    },
    submitAnswerToForm: function() {
      //give points to user
      this.modifyUserScore();
      this.sortUserDataBasedOnScore();

      QuizFormRepository.submitAnswer(
        this.questions[this.position].name,
        this.selectedAnsr,
        this.USER_TOKEN
      ).then(response => {
        console.log("selected ANSWER", response);
      });
    },
    submitEmptyAnswerToForm: function() {
      //give points to user
      this.sortUserDataBasedOnScore();

      for (let i = this.questionDone; i < this.questions.length; i++) {
        QuizFormRepository.submitAnswer(
          this.questions[i].name,
          "",
          this.USER_TOKEN
        ).then(response => {
          console.log("selected ANSWER", response);
        });
      }
    },
    getBulkData: function() {
      QuizFormRepository.getQuizFormBulkData(
        this.formHash,
        this.questions[this.position].name,
        this.USER_TOKEN
      ).then(response => {
        console.log("bulk data: ", response);
      });
    },
    updateSelectedAnswer: function(chosenAnswerName) {
      let index = 0;
      console.log("CHOSEN ANSWER NAME " + chosenAnswerName + "!");
      this.currentAnswerGroup.forEach(element => {
        if (element.name == chosenAnswerName) {
          this.ansrData[index].results++;
          this.ansrData[index].chosen = true;
          if (this.ansrData[index].correct) this.pointsToReceive = 10;
          else this.pointsToReceive = 0;
        } else {
          this.ansrData[index].results = 0;
          this.ansrData[index].chosen = false;
        }
        index++;
      });
    },
    checkLastQuestion: function() {
      if (this.position == this.questions.length - 1) {
        this.lastQuestion = true;
      } else {
        this.lastQuestion = false;
      }
    },
    modifyUserScore: function() {
      for (let userIndex = 0; userIndex < this.usrData.length; userIndex++) {
        if (this.uh == this.usrData[userIndex].userHash) {
          console.log(
            this.usrData[userIndex].username,
            " received ",
            this.pointsToReceive,
            " points"
          );
          this.usrData[userIndex].score += this.pointsToReceive;
        }
      }
    },
    timesUp() {
      this.submitEmptyAnswerToForm();

      this.chartDisplayed = true;
      this.leaderboardDisplayed = true;
      this.position = this.questions.length - 1;
      this.lastQuestion = true;
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
