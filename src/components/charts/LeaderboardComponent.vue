<template>
    <q-card class="bg-transparent no-shadow full-width">
        <q-card-section>
            <canvas id="bar-chart"></canvas>
            <q-separator color="grey" inset />
            <q-list dense padding class="rounded-borders">
            
            <q-scroll-area style="height: 200px;">
              <q-item clickable v-ripple v-for="(usrData, index) in userData.slice(3)" :key="index">
                <q-item-section style="display: inline" v-bind:style="[usrData.id == userId ? {'color': 'blue'} : {}]">
                  <b>{{ index + 4 }}</b>{{ ordinalSuffixOf(index+4) }}: <b>{{ usrData.id == userId ? 'You' : usrData.username }}</b> with a score of <b>{{ usrData.score }}</b> points
                </q-item-section>
              </q-item>
            </q-scroll-area>
          </q-list>

        </q-card-section>
    </q-card>
</template>

<script>
import Chart from 'chart.js'
export default {
  data () {
    return {
    }
  },
  mounted () {
    this.createChart('bar-chart')
  },
  props: ['titleData', 'userData', 'colorData', 'userId'],
  methods: {
    ordinalSuffixOf (i) {
      var j = i % 10,
          k = i % 100;
      if (j == 1 && k != 11) {
          return "st";
      }
      if (j == 2 && k != 12) {
          return "nd";
      }
      if (j == 3 && k != 13) {
          return "rd";
      }
      return "th";
    },
    createChart (chartId) {
      const ctx = document.getElementById(chartId)
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [this.userData[2].score, this.userData[0].score, this.userData[1].score],
          datasets: [
            {
              backgroundColor: [
                this.colorData.thirdPlace, 
                this.colorData.firstPlace, 
                this.colorData.secondPlace
              ],
              borderColor: [
                this.colorData.thirdPlaceBorder, 
                this.colorData.firstPlaceBorder, 
                this.colorData.secondPlaceBorder
              ],
              hoverBorderColor: [
                this.colorData.thirdPlaceText, 
                this.colorData.firstPlaceText, 
                this.colorData.secondPlaceText
              ],
              label: [this.userData[2].username, this.userData[0].username, this.userData[1].username],
              data: [this.userData[2].score, this.userData[0].score, this.userData[1].score],
              borderWidth: 5,
              hoverBorderWidth: 0,
              borderSkipped: 'none'
            }
          ],
        },
        options: {
            title: {
                display: true,
                text: this.titleData,
                fontSize: 30,
                lineHeight: 4
            },
            legend: {
              display: false,
            },
            hover: {
              animationDuration: 0
            },
            responsive: true,
            animation: {
              duration: 1,
              onComplete: function() {
                var chartInstance = this,
                ctx = this.ctx;

                ctx.font = Chart.helpers.fontString(
                  /*Chart.defaults.global.defaultFontSize*/20, 
                  Chart.defaults.global.defaultFontStyle, 
                  Chart.defaults.global.defaultFontFamily
                );
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                this.data.datasets.forEach(function(dataset, i) {
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function(bar, index) {
                    ctx.fillStyle =  dataset.hoverBorderColor[index];
                    var data = dataset.label[index];
                    ctx.fillText(data, bar._model.x, bar._model.y - 5);
                  });
                });
              }
            },
            tooltips: {
              enabled: false
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    display: false
                  },
                  gridLines: {
                    display: false
                  },
                }
              ],
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    display: true,
                    fontSize: 15,
                    callback: function(value, index, values) {
                      return value + ' score';
                    }
                  },
                  gridLines: {
                    display: false
                  },
                }
              ]
            }
        }
      })
      return myChart
    }
  }
}
</script>
