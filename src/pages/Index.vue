<template>
<div>
  <div class="gt-sm">
    <q-page class="flex flex-center">
      {{requestCode}}
      <q-btn @click="createSession()" rounded class="col-12 q-ma-md sign-btn">Create Session</q-btn>
      <q-input outlined dense v-model="code" bg-color="grey-4" placeholder="Code" />
      <q-btn @click="joinRoom()" rounded class="col-12 q-ma-md sign-btn">Connect</q-btn>
    </q-page>
  </div>

  <div class="lt-sm">
    <q-page class="flex flex-center">
      <section class="column items-center">
      {{requestCode}}
      <q-btn @click="createSession()" rounded class="q-ma-md sign-btn">Create Session</q-btn>
      <q-input outlined dense v-model="code" bg-color="grey-4" placeholder="Code" />
      <q-btn @click="joinRoom()" rounded class="q-ma-md sign-btn">Connect</q-btn>
      </section>
    </q-page>
  </div>
</div>
</template>

<script>
import CompletionCard from "../components/CompletionCard";
import io from "socket.io-client";

export default {
  name: "PageIndex",
  data() {
    return {
      socket: {},
      requestCode: "",
      code: ""
    };
  },
  methods: {
    createSession() {
      this.socket.emit("createRoomRequest", {
        userHash: "7c580508c0e26ecac801ee4a42da6204",
        formHash: "81add7968fcc8b1e1eb77621b8fd228b",
        duration: 60
      });
    },
    joinRoom() {
      this.socket.emit("joinRoomRequest", { code: this.code });
    },
    startQuiz() {
      this.socket.emit("start_quiz_request", { code: this.code });
    }
  },
  created() {
    this.socket = io("http://localhost:3000");

    this.socket.on("create_room_response", message => {
      this.requestCode = message.code;
      console.log(message);
      this.$router.push({
        name: "guestwaitingroom",
        params: {
          inviteCode: message.code,
          title: "quiz title",
          formHash: this.formHash,
          code: message.code,
          socket: this.socket
        }
      });
    });

    this.socket.on("join_room_response", response => {
      console.log(response);
    });

    this.socket.on("connection", () => {
      console.log(`Connected`);
    });
    this.socket.on("connect_error", error => {
      console.log(`Error while connecting to socket server: ${error}`);
    });
    this.socket.on("error", error => {
      console.log(`Server error: ${error}`);
    });

    this.socket.on("quiz_timer_response", response => {
      console.log("quiz timer response: ", response);
    });
  }
};
</script>

<style scoped>

</style>
