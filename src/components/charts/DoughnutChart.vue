<template>
    <q-card class="bg-transparent full-width no-shadow">
        <div id="title">{{ questionData.title }}</div>
        <q-card-section id="container">
            <!-- inefficient with two loops but couldn't optimize properly -->
            <div v-if="!overview">
              <div id="correct">
                <b>Correct</b>
                <div v-for="(answer, idx) in this.answerData" :key="idx" style="display: inline">
                  <div v-if="answer.correct">
                    <div v-bind:style="{'backgroundColor': answer.color}" class="circle">{{ answer.letter }}</div>
                  </div>
                </div>
              </div>

              <div id="chosen">
                <b>Chosen</b> 
                <div v-for="(answer, idx) in this.answerData" :key="idx" style="display: inline">
                  <div v-if="answer.chosen">
                    <div v-bind:style="{'backgroundColor': answer.color}" class="circle">{{ answer.letter }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="container">
              <div id="answer-list">
                <q-item v-for="(answer, idx) in answerData" :key="idx" class="q-my-sm" clickable v-ripple>
                  <q-item-section avatar>
                    <q-avatar
                      v-bind:style="[answer.chosen ? {backgroundColor: answer.color} : {backgroundColor: answer.color}]">
                      {{ answer.letter }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label 
                      v-bind:style="[answer.correct ? {color: '#6FCF97'} : {color: '#666666'}]"
                      v-bind:class="[(answer.correct || answer.chosen) ? 'text-bold' : '']">
                      {{ answer.description }}
                    </q-item-label>
                    <q-item-label
                      caption lines="1"
                      v-bind:style="[answer.correct ? {color: '#6FCF97'} : {}]"
                      v-bind:class="[(answer.correct || answer.chosen) ? 'text-bold' : '']">
                      {{ answer.results }} answers
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div id="doughnut">
                <div id="chart-area"></div>
              </div>
            </div>          
        </q-card-section>
    </q-card>
</template>

<style scoped>
.card-container {
  height: 80vh;
}
.circle {
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  font-size: 2.5em;
  line-height: 1.5em;
  text-align: center;
  display: inline-block;
  color: white;
}
#title {
  text-align:center;
  font-size: 1.25em;
}
#correct {
  float: left;
  padding-left: 35%;
  color: #666666;
  padding-bottom: 5%;
}
#chosen {
  float: right;
  padding-right: 35%;
  color: #666666;
  padding-bottom: 5%;
}
#answer-list {
  float: left;
  width: 30%;
  padding-left: 10%;
}
#doughnut {
  float: right;
  width: 70%;
  top: 0;
}

@media only screen and (max-width: 600px) {
  #correct {
    float: left;
    padding-left: 20%;
    color: #666666;
    padding-bottom: 5%;
  }
  #chosen {
    float: right;
    padding-right: 20%;
    color: #666666;
    padding-bottom: 5%;
  }
  #answer-list {
    float: left;
    width: 40%;
    padding-left: 0%;
  }
  #doughnut {
    float: right;
    width: 60%;
    top: 0;
  }
}

</style>

<script>
import Highcharts from 'highcharts'

export default {
  data () {
    return {
      chosenAnswers: [],
      correctAnswers: []
    }
  },
  mounted () {
    this.createNewChart()
  },
  props: ['questionData', 'answerData', 'overview'],
  methods: {
    getTotalAnswerAmount() {
      var sum = 0
      this.answerData.forEach(answer => {
        sum += answer.results
      });
      return sum;
    },
    getFittingAnswerData() {
      var ansrData = []
      this.answerData.forEach(answer => {
        ansrData.push([answer.description, answer.results])
      })
      ansrData.push(
        {
          name: 'Other',
          y: 0,
          dataLabels: {
            enabled: false
          }
        }
      )
      return ansrData
    },
    createNewChart () {     
      window.Highcharts = Highcharts 
      Highcharts.chart('chart-area', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: 'rgba(0,0,0,0)',
          spacingTop: 0,
          spacingRight: 0,
          spacingBottom: 0,
          spacingLeft: 0,
          plotBorderWidth: 0,
          marginRight: 0,//-60, //this does move the chart but you'll need to recompute it
          marginLeft: 0,//-60,  //whenever the page changes width
          marginTop: 0,
          marginBottom: 0
        },
        exporting: {
            enabled: false
        },
        title: {
          text: this.getTotalAnswerAmount() + '<br> total answers',
          align: 'center',
          verticalAlign: 'middle',
          y: 0
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            // this could be coming like [ this.answerData[0].color, this.answerData[1].color, this.answerData[2].color, this.answerData[3].color]
            // but this way we don't handle true/false question and passing a list variable instead doesn't behave properly
            colors: ["#D739BD", "#6FCF97", "#EB5757", "#EBEE47"],
            allowPointSelect: true,
            cursor: 'pointer',
            size: '100%',
            dataLabels: {
              enabled: false,
              distance: -50,
              style: {
              fontWeight: 'bold',
              color: 'white'
              }
            },
            showInLegend: false,
            startAngle: -90,
            endAngle: 90
          }
        },
        series: [{
          type: 'pie',
          name: this.questionData.title,
          innerSize: '70%',
          data: this.getFittingAnswerData()
        }]
      });
    }
  }
}
</script>
