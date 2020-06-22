<template>
  <q-page class="main-page flex flex-center">
    <WaitingQuizCard class="title-card" v-bind:title="getTitle.title" />

    <q-dialog v-model="showNoParticipants">
      <q-card>
        <q-card-section>
          <div class="text-h6">No Participants</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          At least one participant is required to start quiz. Invite
          participants using invitation code.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-drawer
      v-model="drawer"
      show-if-above
      side="right"
      :mini="miniState"
      @click.capture="drawerClick"
      :breakpoint="200"
      bordered
      :mini-to-overlay="mobile"
      elevated
    >
      <template v-slot:mini>
        <div class="q-py-md">
          <div class="column flex flex-center">
            <q-icon v-if="modPage" name="code" color="primary" size="35px" />
            <q-icon class="q-pt-md" name="people" color="secondary" size="35px" />
          </div>
        </div>
      </template>

      <InvitationView v-if="modPage" v-bind:code="getInvitationCode.invitationCode" />
      <div class="title text-h8">Participants</div>
      <q-separator />
      <q-scroll-area class="user-list">
        <q-list v-if="participants.length != 0">
          <UserCard
            class="user-card"
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

      <div v-if="mobile" class="absolute" style="top: 15px; left: -17px">
        <q-btn
          dense
          round
          unelevated
          color="primary"
          icon="chevron_right"
          @click="miniState = true"
        />
      </div>
    </q-drawer>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import UserCard from "../components/waitingroom/UserCard";
import WaitingQuizCard from "../components/waitingroom/WaitingQuizCard";
import InvitationView from "../components/waitingroom/InvitationView";
import QuestionFetcher from "../remote/quiz/QuestionFetcher";
import io from "socket.io-client";

export default {
  components: {
    UserCard,
    WaitingQuizCard,
    InvitationView
  },
  computed: {
    ...mapGetters("waitingRoom", [
      "getTitle",
      "getInvitationCode",
      "getFormHash"
    ]),
    ...mapGetters("authLogin", ["token"])
  },
  props: ["socket"],//, "hash", "tkn", "usrname", "avatarUrl", "frmHash", "participants"],
  data() {
    return {
      modPage: false,
      participants: [],
      showNoParticipants: false,
      questions: null,
      miniState: false,
      drawer: false,
      width: 0,
      mobile: false
    };
  },
  methods: {
    async startQuiz() {
      if (this.participants.length == 0) {
        this.showNoParticipants = true;
        return;
      }

      if (this.questions.length == 0) {
        console.log("Can't start quiz no questions loaded");
        return;
      }

      this.socket.emit("start_quiz_request", { questions: this.questions });
    },
    navigateToCompleteQuiz(questionsResponse) {
      console.log("last pass", this.$route.params);
      // add a 0 score to everyone
      this.participants.forEach(function (element) {
        element.score = 0;
      });
      this.$router.push({
        name: "completequiz",
        params: {
          title: this.getTitle.title,
          questions: questionsResponse,
          userHash: this.$route.params.hash,
          userToken: this.$route.params.tkn,
          userName: this.$route.params.usrname,
          userAvatarUrl: this.$route.params.avatarUrl,
          formHash: this.$route.params.frmHash,
          socket: this.socket,
          participants: this.participants
        }
      });
    },
    drawerClick(e) {
      if (this.miniState) {
        this.miniState = false;
        e.stopPropagation();
      }
    },
    onResize() {
      if (window.innerWidth <= 600) {
        this.miniState = true;
        this.mobile = true;
      } else {
        this.miniState = false;
        this.mobile = false;
      }
      this.width = window.innerWidth;
    }
  },
  async mounted() {
    this.modPage = this.getInvitationCode.invitationCode != undefined;

    if (this.modPage) {
      this.questions = await QuestionFetcher.loadQuestions(
        this.getFormHash.formHash,
        this.token
      );

      console.log("Questions in waitingRoom: ", this.questions);
    }

    this.socket.on("quiz_start_response", response => {
      console.log("QUIZ START RESPONSE: ", response);

      if (response.questions == undefined) {
        console.log("No Questions");
        return;
      }

      if (this.modPage) {
        console.log("Mod page so nothing happens");
      } else {
        this.navigateToCompleteQuiz(response.questions);
      }
    });
  },
  created() {
    if (this.socket == undefined) return;

    this.socket.on("user_data_response", response => {
      let users = response.users;
      this.participants = users;
      console.log(users);
    });

    window.addEventListener("resize", this.onResize);
    if (window.innerWidth <= 600) {
      this.miniState = true;
      this.mobile = true;
    } else {
      this.miniState = false;
      this.mobile = false;
    }
    this.width = window.innerWidth;
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }
};
</script>
<style lang="scss" scoped>
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
.user-card {
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

.title-card {
  width: 60%;
}

@media only screen and (max-width: 1000px) {
  .title-card {
    width: 80%;
  }
}

@media only screen and (max-width: 800px) {
  .title-card {
    width: 90%;
  }
}

@media only screen and (max-width: 600px) {
  .title-card {
    width: 85%;
  }
}
</style>
