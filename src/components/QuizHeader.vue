<template>
  <div class="container">
    <span class="headerTitle">{{ title }}</span>
    <div class="progress">
      <q-linear-progress
        rounded
        size="10px"
        color="positive"
        :value="progression"
      />
    </div>
    <span v-if="timer" class="timeLeft">{{ minuteAndSecond }}</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SocketCommunicator from "../remote/socket/socket_communicator";

export default {
  props: ["title", "duration", "progression", "timer"],
  name: "QuizHeader",
  computed: {
    minuteAndSecond() {
      let minutes = Math.floor(this.seconds / 60);
      let seconds = this.seconds - minutes * 60;
      if (seconds < 10) seconds = `0${seconds}`;
      return `${minutes}:${seconds}`;
    },
    ...mapGetters("authLogin", ["userHash"])
  },
  data() {
    return {
      SocketCommunicator: null,
      seconds: 0
    };
  },
  created() {
    this.socketCommunicator = new SocketCommunicator(this.userHash);

    window.addEventListener("beforeunload", this.beforeUnload);
  },
  mounted() {
    this.socketCommunicator.on("quiz_timer_response", response => {
      if (response.running) {
        this.seconds = response.tick;
      } else {
        this.$emit("timerFinish");
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
