<template>
  <div class="container">
    <span class="headerTitle">{{title}}</span>
    <div class="progress">
      <q-linear-progress rounded size="10px" color="positive" :value="progression" />
    </div>
    <span v-if="timer" class="timeLeft">{{timeLeft}}</span>
  </div>
</template>

<script>
export default {
  props: ["title", "duration", "progression", "timer"],
  name: 'QuizHeader',
  data () {
    return {
      progress: 0,
      timeLeft: "01:00"
    }
  },

  methods: {
      setProgress: function (event) {
          if (this.progress >= 1) {
              return;
          }
          console.log(this.progress);
          this.progress += 0.1;
      }
  }
}
</script>

<style lang="scss" scoped>

.headerTitle {
    float:left;
    margin-right: 20px;
    align-self: center;
    font-size: 20px;
}

.timeLeft {
    margin-left: 20px;
    display:inline-block;
    align-self: center;
    font-size: 18px;
}

.progress {
    align-self: center;
    width: 50%;
    display:inline-block;
    justify-content: center;
}

.container {
    display: flex;
    justify-content: center;
}
</style>