<template>
  <q-page class="main-page flex flex-center">
    <WaitingQuizCard
      class="title-card"
      v-bind:title="getTitle.title"
      :thumbnail="getThumbnailUrl.thumbnailUrl"
    />

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

    <q-dialog v-model="showNoQuestions">
      <q-card>
        <q-card-section>
          <div class="text-h6">No Questions</div>
        </q-card-section>

        <q-card-section class="q-pt-none">Seems like there is no questions in this quiz...</q-card-section>

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
      <div v-if="this.modPage">
        <q-separator />
        <div class="absolute-bottom">
          <div class="button-holder row justify-center">
            <q-btn
              v-if="startVisible"
              center
              class="button"
              style="color: white"
              label="Start quiz"
              v-on:click="startQuiz"
            />
            <q-btn
              center
              color="red"
              class="button"
              style="color: white"
              label="Stop"
              v-on:click="stopQuiz"
            />
          </div>
        </div>
      </div>

      <div v-if="mobile" class="q-mini-drawer-hide absolute" style="top: 15px; left: -17px">
        <q-btn
          dense
          round
          unelevated
          color="primary"
          icon="chevron_right"
          @click="miniState = true"
        />
      </div>

      <chat-component
        style="z-index: 3001;"
        :messages="messages"
        :sender="sender"
        :scroll="scroll"
        v-on:newChat="sendChat"
        v-on:scrollDone="scroll = false"
      ></chat-component>
    </q-drawer>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import UserCard from "../components/waitingroom/UserCard";
import WaitingQuizCard from "../components/waitingroom/WaitingQuizCard";
import InvitationView from "../components/waitingroom/InvitationView";
import QuestionFetcher from "../remote/quiz/QuestionFetcher";
import io, { Socket } from "socket.io-client";
import UserRepository from "../remote/user/UserRepository";
import ChatComponent from "../components/Chat";
import SocketCommunicator from "../remote/socket/socket_communicator";
import FileRepository from "../remote/files/FileRepository";
import QuizFormRepository from "../remote/quiz/QuizFormRepository";
import QuizTemplateRepository from "../remote/quiz/QuizTemplateRepository";

export default {
  components: {
    UserCard,
    WaitingQuizCard,
    InvitationView,
    ChatComponent
  },
  computed: {
    ...mapGetters("waitingRoom", [
      "getTitle",
      "getInvitationCode",
      "getFormHash",
      "getThumbnailUrl",
      "getUserHash",
      "getUsername",
      "getAvatarUrl",
      "getDuration"
    ]),
    ...mapGetters("authLogin", ["token", "userHash", "userObject", "avatar"])
  },
  data() {
    return {
      socketCommunicator: null,
      modPage: false,
      startVisible: false,
      runningVisible: false,
      participants: [],
      showNoParticipants: false,
      showNoQuestions: false,
      questions: null,
      miniState: false,
      drawer: false,
      mobile: false,
      sender: {
        uh: "",
        username: "",
        associatedAvatar: "",
        isModerator: false,
        isUs: true
      },
      scroll: false,
      messages: []
    };
  },
  created() {
    this.socketCommunicator = new SocketCommunicator(this.userHash);

    this.modPage = this.getInvitationCode.invitationCode != undefined;
    this.startVisible = this.modPage;

    window.addEventListener("resize", this.onResize);
    window.addEventListener("beforeunload", this.beforeUnload);

    if (window.innerWidth <= 600) {
      this.miniState = true;
      this.mobile = true;
    } else {
      this.miniState = false;
      this.mobile = false;
    }

    if (this.socketCommunicator == undefined) return;

    this.socketCommunicator.on("user_data_response", response => {
      let users = response.users;
      this.participants = users;
      console.log(users);
    });
  },
  async mounted() {
    this.modPage = this.getInvitationCode.invitationCode != undefined;

    this.sender.isModerator = this.modPage;

    if (this.modPage) {
      this.questions = await QuestionFetcher.loadQuestions(
        this.getFormHash.formHash,
        this.token
      );
      this.sender.username = this.userObject.username;
      this.sender.uh = this.userHash;
      this.sender.associatedAvatar = this.avatar;

      console.log("Questions in waitingRoom: ", this.questions);
    } else {
      this.sender.username = this.getUsername;
      this.sender.uh = this.getUserHash;
      this.sender.associatedAvatar = this.getAvatarUrl;
    }
    this.socketCommunicator.emit("chat_history_request");

    this.socketCommunicator.on("quiz_status", response => {
      if (!this.modPage) {
        return;
      }

      if (response.running) {
        this.startVisible = false;
        this.runningVisible = true;
      } else {
        this.startVisible = true;
        this.runningVisible = false;
      }
    });

    this.socketCommunicator.on("quiz_start_response", response => {
      if (response.questions == undefined) {
        console.log("No Questions");
        return;
      }

      if (this.modPage) {
        console.log("Mod page so nothing happens");
        this.socketCommunicator.emit("check_status", {});

        this.socketCommunicator.on("finish_quiz_data_response", response => {
          console.log("RECEIVED FINISH DATA", response);
          this.updateTemplateContent(
            response.data[response.data.length - 1].data.userScore,
            response.data[response.data.length - 1].data.formHash
          );
        });
      } else {
        this.navigateToCompleteQuiz(response.questions);
      }
    });

    this.socketCommunicator.on("user_data_response", response => {
      let users = response.users;
      this.participants = users;
    });

    this.socketCommunicator.on("quiz_stopped", response => {
      if (this.token == undefined) {
        this.$router.push({
          name: "join"
        });
      } else {
        this.$router.push({
          name: "dashboard"
        });
      }
    });

    this.socketCommunicator.on("update_chat_response", response => {
      if (
        this.getUserHash == response.sender.uh ||
        this.userHash == response.sender.uh
      ) {
        this.scroll = true;
        return;
      }
      this.messages.push({
        sender: response.sender,
        text: response.text
      });
      this.scroll = true;
    });

    this.socketCommunicator.on("chat_history_response", response => {
      response.forEach(value => {
        if (value.sender.uh == this.userHash) value.sender.isUs = true;
        else value.sender.isUs = false;
      });

      this.messages = [...response];
      this.scroll = true;
    });

    this.socketCommunicator.emit("check_status", {});
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("beforeunload", this.beforeUnload);
    this.socketCommunicator.socket.removeAllListeners();
    this.socketCommunicator.socket.close();
    this.socketCommunicator = null;
  },
  methods: {
    async startQuiz() {
      if (this.participants.length == 0) {
        this.showNoParticipants = true;
        return;
      }

      if (this.questions == undefined || this.questions.length == 0) {
        this.showNoQuestions = true;
        return;
      }

      this.socketCommunicator.emit("start_quiz_request", {
        questions: this.questions
      });
    },
    stopQuiz() {
      this.socketCommunicator.emit("stop_quiz_request", {
        userHash: this.userHash
      });
    },
    navigateToCompleteQuiz(questionsResponse) {
      console.log("last pass", this.$route.params);
      // add a 0 score to everyone
      this.participants.forEach(function(element) {
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
          participants: this.participants,
          duration: this.getDuration
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
        this.miniState = false;
        this.mobile = true;
      } else {
        this.miniState = false;
        this.mobile = false;
      }
    },
    beforeUnload() {
      this.socketCommunicator.socket.removeAllListeners();
      this.socketCommunicator.socket.close();
      this.socketCommunicator = null;
    },
    sendChat(request) {
      this.socketCommunicator.emit("update_chat_request", {
        sender: request.sender,
        text: request.text
      });
      this.messages.push({
        sender: request.sender,
        text: request.text
      });
    },
    updateTemplateContent(score, fh) {
      let tn = "";
      console.log("DO WE GET IT HERE", fh);
      QuizFormRepository.getQuizForm(fh, this.token).then(response => {
        tn = response.data.form[0].tn;

        QuizTemplateRepository.getTemplateContent(tn, this.token).then(
          response => {
            console.log("template content: ", response.data.content.content);

            let content = JSON.parse(response.data.content.content);
            content.properties.playTimes += 1;
            let userScore = score;
            content.properties.averagePass =
              (content.properties.averagePass *
                (content.properties.playTimes - 1) +
                userScore) /
              content.properties.playTimes;

            console.log("after edit template content: ", content);

            QuizTemplateRepository.updateTemplateContent(
              tn,
              "json",
              content,
              this.token
            ).then(response => {
              console.log("template content: ", response);
            });
          }
        );
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.main-page {
  background-image: linear-gradient(90deg, #fee140 0%, #fa709a 100%);
}
.user-list {
  // was - 150px before changed since the bar was constantly showing and it was not the one we needed
  // 112px comes from the chat and lifted start quiz buttons
  height: calc(98% - 205px - 112px);
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
  margin-bottom: 48px;
}
.button {
  width: 100%;
  background: #6fcf97;
  margin-left: 24px;
  margin-right: 24px;
  border-radius: 20px;
  margin-bottom: 10px;
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
