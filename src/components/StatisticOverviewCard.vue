<template>
  <q-card class="completion-card bg-plain">
    <q-card-section class="card-header bg-white">
      <div class="card-toolbar">
        <QuizHeader v-bind:title="label" :timer="false" :progression="parseFloat(this.position+1) / parseFloat(this.questionHashes.length)"/>
      </div>
    </q-card-section>
    <q-card-section vertical align="center">
      <doughnut-chart v-if="loaded" :overview="true" :questionData="qstnData" :answerData="ansrData"></doughnut-chart>
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
import QuizFormRepository from "../remote/quiz/QuizFormRepository";

export default {
  name: "CompletionCard",
  
  data() {
    return {
      loaded: false,
      currentAnswerGroup: [],
      selectedAnsr: '',
      chartDisplayed: false,
      leaderboardDisplayed: false,
      position: 0,
      loading: true,
      question: null,
      lastQuestion: false,
      bulkParticipationData: [],
      answerResults: [],
      comingFromPrevious: false,
      visitedPositions: [],
      qstnData: {
        title: "Is this a question?",
        description: "Is this the detailed description of the question?"
      },
      ansrData: [
        /*{
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
        }*/
      ],
      ansrColors: ["#D739BD", "#6FCF97", "#EB5757", "#EBEE47"],
      ansrLetters: ["A", "B", "C", "D"],
      usrId: 6,
      ttlData: "Quiz Ranking"
    };
  },
  props: ["label", "questionHashes", "formHash"],
  methods: {
    next: function() {
      if (this.position >= this.questionHashes.length - 1) {
        return;
      }
      
      this.position++;
      this.loaded = false;
      if (this.visitedPositions[this.position-1]) {
        this.reloadQuestion();
        this.comingFromPrevious = false;
      } else { 
        this.loadQuestion();
        this.visitedPositions[this.position-1] = true
      }
      console.log(this.selectedAnsr)
    },
    previous: function() {
      if (this.position > 1) {
        return;
      }
      
      this.loaded = false;
      this.position--;
      this.reloadQuestion();
      
      console.log(this.selectedAnsr)
    },
    finish: function() {
      this.$router.push({ path: '/dashboard' })
    },
    reloadQuestion: function() {
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
            this.ansrData = []
            answerResponse.data.varoptiongroup.forEach(element => {
              this.ansrData.push({
                description: element.label,
                correct: element.weight > 1 || element.value > 1,
                chosen: false,
                results: this.getAnswerResultCount(element.name),
                letter: this.ansrLetters[index],
                color: this.ansrColors[index]
              })
              /*
              this.ansrData[index].description = element.label
              this.ansrData[index].correct = (element.weight == 1)  
              this.ansrData[index].chosen = false
              this.ansrData[index].results = this.getAnswerResultCount(element.name)
              */
              index++
            });
            this.loaded = true;
          });
        });
      });
    },
    loadQuestion: function() {
      this.loading = true;
      QuestionRepository.getQuestion(
        this.questionHashes[this.position],
        this.$store.state.authLogin.token
      ).then(response => {
        let data = response.data.var[0];

        
        // bulk data
        QuizFormRepository.getQuizFormBulkData(
          this.formHash,
          response.data.var[0].name,
          this.$store.state.authLogin.token
        ).then(bulkResponse => {
          this.bulkParticipationData = bulkResponse.data.list;
          console.log("BULK DATA: ", this.bulkParticipationData)

          this.bulkParticipationData.forEach(dataEntry => {
            console.log(dataEntry.row)

            if (typeof dataEntry.row[response.data.var[0].name][0] != 'undefined')
              this.answerResults.push(dataEntry.row[response.data.var[0].name][0].name)
          });
          console.log(this.answerResults)
        
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
              this.ansrData = []
              answerResponse.data.varoptiongroup.forEach(element => {
                this.ansrData.push({
                  description: element.label,
                  correct: element.weight > 1 || element.value > 1,
                  chosen: false,
                  results: this.getAnswerResultCount(element.name),
                  letter: this.ansrLetters[index],
                  color: this.ansrColors[index]
                })
                /*
                this.ansrData[index].description = element.label
                this.ansrData[index].correct = (element.weight == 1)  
                this.ansrData[index].chosen = false
                this.ansrData[index].results = this.getAnswerResultCount(element.name)
                this.ansrData[index].letter = this.ansrLetters[index]
                this.ansrData[index].color = this.ansrColors[index]
                */
                index++
              });
              this.loaded = true;
            });
          });
        });
      });
    },
    getAnswerResultCount: function(answerName) {
      var counter = 0; 
      for (var j = 0; j < this.answerResults.length; j++) 
        if (answerName == this.answerResults[j]) 
          counter++; 
      return counter; 
    },
    checkLastQuestion: function() {
      if (this.position == this.questionHashes.length - 1) {
        this.lastQuestion = true;
      } else {
        this.lastQuestion = false;
      }
    },
    initiateVisitedPositionArray: function() {
      for (let pos = 0; pos < this.questionHashes.length; pos++) {
        this.visitedPositions.push(false);
      }
    }
  },
  components: {
    QuizHeader,
    DoughnutChart
  },
  mounted() {
    this.loadQuestion();
    this.initiateVisitedPositionArray();
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
