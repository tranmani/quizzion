<template>
  <q-page class="main-page flex flex-center">
    <WaitingQuizCard v-bind:title="title" />

    <q-drawer show-if-above side="right" bordered>
      <InvitationView v-if="modPage" v-bind:code="inviteCode" />
      <div class="title text-h8">Participants</div>
      <q-separator />
      <q-scroll-area class="user-list">
        <q-list v-if="participants.length != 0">
          <UserCard
            class="usercard"
            v-for="item in participants"
            v-bind:key="item.userHash"
            v-bind:avatarUrl="item.avatarUrl"
            v-bind:username="item.username"
          />
        </q-list>
      </q-scroll-area>
      <div v-if="modPage">
        <q-separator />
        <div class="absolute-bottom">
          <div class="button-holder row justify-center">
            <q-btn
              center
              class="button"
              style="color: white"
              label="Start quiz"
              v-on:click="startQuiz"
            />
          </div>
        </div>
      </div>
    </q-drawer>
  </q-page>
</template>

<script>
import UserCard from "../components/waitingroom/UserCard";
import WaitingQuizCard from "../components/waitingroom/WaitingQuizCard";
import InvitationView from "../components/waitingroom/InvitationView";
import io from "socket.io-client";

export default {
  components: {
    UserCard,
    WaitingQuizCard,
    InvitationView
  },
  props: ["title", "formHash", "inviteCode", "socket"],
  data() {
    return {
      modPage: false,
      participants: []
    };
  },
  methods: {
    startQuiz() {
      if (participants.length == 0) {
        return;
      }
    }
  },
  mounted() {
    this.title = this.$route.params.title;
    this.formHash = this.$route.params.formHash;
    this.inviteCode = this.$route.params.inviteCode;
    this.socket = this.$route.params.socket;
    this.modPage = this.inviteCode != undefined;
  },
  created() {
    if (this.socket == undefined) return;

    this.socket.on("user_data_response", response => {
      let users = response.users;
      this.participants = users;
      console.log(users);
    });
  }
};
</script>
<style scoped>
.main-page {
  background-image: linear-gradient(90deg, #fee140 0%, #fa709a 100%);
}
.user-list {
  height: calc(98% - 150px);
  border-right: 1px solid #ddd;
}
.title {
  margin-left: 20px;
  margin-top: 24px;
  margin-bottom: 24px;
  font-weight: bold;
  color: gray;
}
.usercard {
  margin-top: 8px;
  margin-bottom: 8px;
  margin-left: 16px;
  margin-right: 16px;
}
.button-holder {
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.button {
  width: 100%;
  background: #6fcf97;
  margin-left: 24px;
  margin-right: 24px;
  border-radius: 20px;
  margin-bottom: 24px;
}
</style>
