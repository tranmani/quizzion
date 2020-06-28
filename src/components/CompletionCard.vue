<template>
  <q-card
    class="completion-card"
    v-bind:class="[!this.chartDisplayed ? 'theme-' + this.theme : 'bg-plain']"
  >
    <q-card-section class="card-header bg-white">
      <div class="card-toolbar">
        <QuizHeader
          :title="label"
          :timer="true"
          :quizDone="leaderboardDisplayed"
          :progression="
            parseFloat(this.position + 1) / parseFloat(this.questions.length)
          "
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
        :key="this.refreshKey+0"
      ></doughnut-chart>
      <mini-leaderboard-component
        v-if="this.chartDisplayed && !this.leaderboardDisplayed"
        :userHash="this.userHash"
        :userData="usrData"
        :colorData="clrData"
        :key="this.refreshKey+1"
      ></mini-leaderboard-component>

      <leaderboard-component
        v-if="this.chartDisplayed && this.leaderboardDisplayed"
        :userHash="this.userHash"
        :userData="usrData"
        :colorData="clrData"
        :key="this.refreshKey+2"
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
        v-if="
          (!lastQuestion || !this.chartDisplayed) && this.selectedAnsr != ''
        "
        v-on:click="next"
      >Next</q-btn>
      <q-btn
        class="button"
        v-show="!loading"
        disabled
        v-if="
          (!lastQuestion || !this.chartDisplayed) && this.selectedAnsr == ''
        "
      >Next</q-btn>
    </q-card-actions>
    <q-inner-loading :showing="loading">
      <q-spinner size="50px" color="secondary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import QuizHeader from "../components/QuizHeader";
import DoughnutChart from "../components/charts/DoughnutChart";
import LeaderboardComponent from "../components/charts/LeaderboardComponent";
import MiniLeaderboardComponent from "../components/charts/MiniLeaderboardComponent";
import CompletionQuestionCard from "../components/CompletionQuestionCard";
import QuestionRepository from "../remote/quiz/QuestionRepository";
import AnswerRepository from "../remote/quiz/AnswerRepository";
import QuizFormRepository from "../remote/quiz/QuizFormRepository";
import SocketCommunicator from "../remote/socket/socket_communicator";

export default {
  name: "CompletionCard",
  props: ["label", "questions", "theme"],
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
      selectedAnsrIndex: -1,
      chartDisplayed: false,
      leaderboardDisplayed: false,
      position: 0,
      questionDone: 0,
      loading: true,
      question: null,
      lastQuestion: false,
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
      ansrData: [],
      allAnsrData: [],
      ansrColors: ["#D739BD", "#6FCF97", "#EB5757", "#EBEE47"],
      ansrLetters: ["A", "B", "C", "D"],
      refreshKey: 0,
      SocketCommunicator: null,
      pointsToReceive: 0,
      totalScore: 0,
      correctAnswerCount: 0,
      timerNow: 0
    };
  },
  computed: {
    ...mapGetters("authLogin", ["userHash"])
  },
  created() {
    console.log(this.userHash);
    this.socketCommunicator = new SocketCommunicator(this.userHash);

    this.initiateAllQuestionAnswers();

    window.addEventListener("beforeunload", this.beforeUnload);
  },
  mounted() {
    console.log("TOKEN: ", this.USER_TOKEN);
    console.log("USER HASH ", this.userHash);
    this.loadQuestion();

    this.socketCommunicator.on("update_user_answer_data_response", response => {
      console.log("Response", response);

      console.log("All Data", response.data);
      console.log(
        "Last Data",
        response.data[response.data.length - 1],
        response.data.length - 1
      );
      let receivedData = response.data[response.data.length - 1];
      if (receivedData.userHash != this.userHash) {
        this.allAnsrData[receivedData.answerGroupIndex][
          receivedData.chosenAnswerIndex
        ].results++;
        console.log("This position", this.position);
        console.log("Received hash", receivedData.varHash);
        console.log("Actual hash", this.questions[this.position].vh);
        if (receivedData.answerGroupIndex == this.position)
          //this.questions[this.position].vh == receivedData.varHash)
          this.ansrData[
            receivedData.chosenAnswerIndex
          ].results = this.allAnsrData[receivedData.answerGroupIndex][
            receivedData.chosenAnswerIndex
          ].results;

        this.usrData[this.returnUserIndexByHash(receivedData.userHash)].score =
          receivedData.score;
      }
      console.log(this.allAnsrData);

      this.sortUserDataBasedOnScore();
      this.refreshKey += 1;
    });

    this.socketCommunicator.on("quiz_timer_response", response => {
      if (response.running) {
        this.timerNow = response.tick;
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.beforeUnload);
    this.socketCommunicator.socket.removeAllListeners();
    this.socketCommunicator.socket.close();
    this.socketCommunicator = null;
  },
  methods: {
    beforeUnload() {
      this.socketCommunicator.socket.removeAllListeners();
      this.socketCommunicator.socket.close();
      this.socketCommunicator = null;
    },
    initiateAllQuestionAnswers: function() {
      console.log("FETCHING ALL QUIZ ANSWER GROUPS");
      this.loading = true;
      let localQuestion = null;
      let localQuestionAnswers = null;

      for (let index = 0; index < this.questions.length; index++) {
        localQuestion = this.questions[index];
        localQuestionAnswers = this.orderByPosition(
          localQuestion.answerGroup.answers
        );

        let localIndex = 0;
        let localAnsrData = [];
        localQuestionAnswers.forEach(element => {
          localAnsrData.push({
            letter: this.ansrLetters[localIndex],
            description: element.label,
            results: 0,
            color: this.ansrColors[localIndex],
            correct: element.weight >= 1 || element.value >= 1,
            chosen: false
          });
          localIndex++;
        });
        this.allAnsrData.push(localAnsrData);
      }

      console.log(this.allAnsrData);

      this.loading = false;
    },
    returnUserIndexByHash: function(hash) {
      for (let index = 0; index < this.usrData.length; index++) {
        if (this.usrData[index].userHash == hash) return index;
      }
    },
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
      if (this.leaderboardDisplayed) {
        this.$router.push({ path: "/dashboard" });
      } else {
        let finishData = {
          userHash: this.uh,
          userScore: (this.correctAnswerCount / this.questions.length) * 100,
          formHash: this.formHash
        };
        console.log("OK, passing data to moderator", finishData);
        this.socketCommunicator.emit("finish_quiz_data_request", {
          data: finishData
        });
        this.leaderboardDisplayed = true;
      }
    },
    orderByPosition: function(array) {
      return array.slice().sort(function(a, b) {
        return a.position - b.position;
      });
    },
    loadQuestion: function() {
      this.loading = true;
      let question = this.questions[this.position];
      let questionAnswers = this.orderByPosition(question.answerGroup.answers);
      console.log("!!!!!!!!!!!!!!", question, " ", questionAnswers);
      this.question = {
        id: question.vh,
        title: question.label,
        answers: questionAnswers
      };
      this.checkLastQuestion();
      this.qstnData.title = question.label;

      this.ansrData = this.allAnsrData[this.position];

      this.currentAnswerGroup = questionAnswers;
      this.loading = false;
    },
    submitAnswerToForm: function() {
      //give points to user
      this.modifyUserScore();
      this.sortUserDataBasedOnScore();

      console.log("DO WE SUBMIT");
      // add to results only when we click the submit button
      this.allAnsrData[this.position][this.selectedAnsrIndex].results++;
      this.ansrData[this.selectedAnsrIndex].results = this.allAnsrData[
        this.position
      ][this.selectedAnsrIndex].results;

      let dataToSubmit = {
        userHash: this.uh,
        varHash: this.questions[this.position].vh,
        answerData: [],
        score: this.totalScore,
        chosenAnswerIndex: this.selectedAnsrIndex,
        answerGroupIndex: this.position
      };
      console.log(dataToSubmit);
      this.socketCommunicator.emit("update_answer_data_request", {
        data: dataToSubmit
      });

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
    updateSelectedAnswer: function(chosenAnswerName) {
      let index = 0;
      console.log("CHOSEN ANSWER NAME " + chosenAnswerName + "!");
      this.currentAnswerGroup.forEach(element => {
        if (element.name == chosenAnswerName) {
          //this.allAnsrData[this.position][index].results++;
          this.allAnsrData[this.position][index].chosen = true;
          this.selectedAnsrIndex = index;
          if (this.allAnsrData[this.position][index].correct)
            this.pointsToReceive = 10 + this.timerNow;
          else this.pointsToReceive = 0;
        } else {
          //this.allAnsrData[this.position][index].results = 0;
          this.allAnsrData[this.position][index].chosen = false;
        }

        this.ansrData[index].chosen = this.allAnsrData[this.position][
          index
        ].chosen;
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
        if (this.userHash == this.usrData[userIndex].userHash) {
          console.log(
            this.usrData[userIndex].username,
            " received ",
            this.pointsToReceive,
            " points"
          );
          this.usrData[userIndex].score += this.pointsToReceive;
          this.totalScore = this.usrData[userIndex].score;
          if (this.pointsToReceive > 0) this.correctAnswerCount++;
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
