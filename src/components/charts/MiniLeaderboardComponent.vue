<template>
    <q-card class="bg-transparent no-shadow full-width">
        <q-card-section>
            <canvas id="mini-bar-chart"></canvas>
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
    this.createChart('mini-bar-chart')
  },
  props: ['titleData', 'userData', 'colorData'],
  methods: {
    createChart (chartId) {
      const ctx = document.getElementById(chartId)
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [this.userData[2].username, this.userData[0].username, this.userData[1].username],
          datasets: [
            {
              backgroundColor: [
                this.colorData.transparent, 
                this.colorData.transparent, 
                this.colorData.transparent
              ],
              borderColor: [
                this.colorData.transparent, 
                this.colorData.transparent, 
                this.colorData.transparent
              ],
              hoverBackgroundColor: [
                this.colorData.transparent, 
                this.colorData.transparent, 
                this.colorData.transparent
              ],
              hoverBorderColor: [
                this.colorData.thirdPlaceText, 
                this.colorData.firstPlaceText, 
                this.colorData.secondPlaceText
              ],
              hoverBorderWidth: 0,
              label: [this.userData[2].username, this.userData[0].username, this.userData[1].username],
              data: [this.userData[2].score, this.userData[0].score, this.userData[1].score],
              borderWidth: 5,
              hoverBorderWidth: 0
            }
          ],
        },
        options: {
            title: {
                display: true,
                text: 'Question Ranking',
                fontSize: 20,
                lineHeight: 7.5
            },
            legend: {
              display: false
            },
            tooltips: {
              enabled: false,
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
                  /*Chart.defaults.global.defaultFontSize*/30, 
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
                    display: false
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
