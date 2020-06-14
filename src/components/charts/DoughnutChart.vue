<template>
    <q-card class="bg-transparent full-width no-shadow">
        <div id="title">{{ questionData.title }}</div>
        <q-card-section id="container">
            <!-- inefficient with two loops but couldn't optimize properly -->
            <div>
              <div id="correct">
                <b>Correct</b>
                <div v-for="answer in this.answerData" :key="answer" style="display: inline">
                  <div v-if="answer.correct">
                    <div v-bind:style="{'backgroundColor': answer.color}" class="circle">{{ answer.letter }}</div>
                  </div>
                </div>
              </div>

              <div id="chosen">
                <b>Chosen</b> 
                <div v-for="answer in this.answerData" :key="answer" style="display: inline">
                  <div v-if="answer.chosen">
                    <div v-bind:style="{'backgroundColor': answer.color}" class="circle">{{ answer.letter }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="container">
              <div id="answer-list">
                <q-item v-for="answer in answerData" :key="answer" class="q-my-sm" clickable v-ripple>
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
                <canvas id="doughnut-chart"></canvas>
              </div>
            </div>          
        </q-card-section>
    </q-card>
</template>

<style scoped>
.card-container {
  height: 100vh;
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
  font-size: 2.5em;
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
  padding-right: 0%;
}
</style>

<script>
import Chart from 'chart.js'
export default {
  data () {
    return {
      chosenAnswers: [],
      correctAnswers: []
    }
  },
  mounted () {
    this.createChart('doughnut-chart')
  },
  props: ['questionData', 'answerData'],
  methods: {
    createChart (chartId) {
      const ctx = document.getElementById(chartId)
      const myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [this.answerData[0].letter, this.answerData[1].letter, this.answerData[2].letter, this.answerData[3].letter],
          datasets: [
            {
              label: 'People answered',
              backgroundColor: [this.answerData[0].color, this.answerData[1].color, this.answerData[2].color, this.answerData[3].color],
              data: [this.answerData[0].results, this.answerData[1].results, this.answerData[2].results, this.answerData[3].results],
              label: [this.answerData[0].results, this.answerData[1].results, this.answerData[2].results, this.answerData[3].results]
            }
          ]
        },
        options: {
            responsive: true,
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
      })
      return myChart
    }
  }
}
</script>
