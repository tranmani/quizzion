<template>
  <div class="container">
    <span class="headerTitle">{{title}}</span>
    <div class="progress">
      <q-linear-progress rounded size="10px" color="positive" :value="progression" />
    </div>
    <span v-if="timer" class="timeLeft">{{minuteAndSecond}}</span>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  props: ["title", "duration", "progression", "timer", "socket"],
  name: "QuizHeader",
  data() {
    return {
      progress: 0,
      seconds: 0
    };
  },
  created() {
    this.socket.on("quiz_timer_response", response => {
      console.log(response);

      if (response.running) {
        this.seconds = response.tick;
      } else {
        // do something if time running out
      }
    });
  },
  computed: {
    minuteAndSecond() {
      let minutes = Math.floor(this.seconds / 60);
      let seconds = this.seconds - minutes * 60;
      if (seconds < 10) seconds = `0${seconds}`;
      return `${minutes}:${seconds}`;
    }
  },
  methods: {
    setProgress: function(event) {
      if (this.progress >= 1) {
        return;
      }
      console.log(this.progress);
      this.progress += 0.1;
    }
  }
};
</script>

<style lang="scss" scoped>
.headerTitle {
  float: left;
  margin-right: 20px;
  align-self: center;
  font-size: 20px;
}

.timeLeft {
  margin-left: 20px;
  display: inline-block;
  align-self: center;
  font-size: 18px;
}

.progress {
  align-self: center;
  width: 50%;
  display: inline-block;
  justify-content: center;
}

.container {
  display: flex;
  justify-content: center;
}
</style>