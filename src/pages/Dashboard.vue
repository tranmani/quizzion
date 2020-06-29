<template>
  <q-page class="q-pa-md">
    <subheader v-on:sort="sortQuizzes"></subheader>

    <q-dialog v-model="showActiveQuiz">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Quiz is still running</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div v-if="this.activeQuiz != null">Quiz "{{ this.activeQuiz.title }}" is still running...</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="View" color="primary" v-close-popup v-on:click="viewRunningQuiz" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <h5 class="q-pl-md">Created quizzes:</h5>
    <div v-if="!dashboardLoaded" class="row">
      <CreatedQuizSkeleton v-for="index in 6" :key="index" />
    </div>
    <div v-if="dashboardLoaded">
      <div class="row box">
        <CreatedQuiz
          v-for="quiz in quizzesForDisplay"
          :key="quiz.id"
          v-bind="quiz"
          v-on:delete="deleteTemplate"
          v-on:createRoom="createRoom"
        />
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import CreatedQuiz from "../components/dashboard/CreatedQuiz";
import CreatedQuizSkeleton from "../components/dashboard/CreatedQuizSkeleton";
import SubHeader from "../components/SubHeader";
import QuizTemplateRepository from "../remote/quiz/QuizTemplateRepository";
import QuizFormRepository from "../remote/quiz/QuizFormRepository";
import Authenticator from "../remote/user/Authenticator";
import FileRepository from "../remote/files/FileRepository";
import SocketCommunicator from "../remote/socket/socket_communicator";

export default {
  components: {
    CreatedQuiz,
    CreatedQuizSkeleton,
    subheader: SubHeader
  },
  data() {
    return {
      quizzesForDisplay: [],
      socketCommunicator: null,
      activeQuiz: null,
      showActiveQuiz: false
    };
  },
  computed: {
    ...mapGetters("quizzes", [
      "quizzes",
      "dashboardLoaded",
      "sortState",
      "availableTn"
    ]),
    ...mapGetters("authLogin", ["token", "userHash", "userObject"])
  },
  created() {
    window.addEventListener("beforeunload", this.beforeUnload);

    this.socketCommunicator = new SocketCommunicator(this.userHash);

    if (!this.dashboardLoaded) {
      this.quizzesForDisplay = [];
      this.getAllForms();
    }
    if (Object.keys(this.userObject).length === 0) {
      this.getUser(this.token);
    }
    this.sortQuizzes(this.sortState);
  },
  mounted() {
    this.socketCommunicator.on("create_room_response", response => {
      const activeQuiz = response.activeQuiz;

      console.log("activeQuiz: ", activeQuiz);

      if (activeQuiz != undefined) {
        this.showActiveQuiz = true;
        this.activeQuiz = activeQuiz;
      }

      const code = response.code;

      if (code == undefined) {
        return;
      }

      this.$store.dispatch("waitingRoom/setInvitationCode", {
        invitationCode: code
      });

      this.$router.push({ name: "waitingroom" });
    });
  },
  beforeDestroy() {
    this.socketCommunicator.socket.removeAllListeners();
    this.socketCommunicator.socket.close();
    this.socketCommunicator = null;
    window.removeEventListener("beforeunload", this.beforeUnload);
  },
  methods: {
    ...mapActions("quizzes", [
      "emptyQuizzes",
      "updateQuiz",
      "addQuiz",
      "deleteQuiz",
      "setLoaded"
    ]),
    ...mapActions("authLogin", ["attemptUser", "attemptUserObject"]),
    sortQuizzes(sortType) {
      if (sortType === "playTimesAsc") {
        this.quizzesForDisplay = [...this.quizzes].sort(
          (a, b) => a.playTimes - b.playTimes
        );
      } else if (sortType === "playTimesDes") {
        this.quizzesForDisplay = [...this.quizzes].sort(
          (a, b) => b.playTimes - a.playTimes
        );
      } else if (sortType === "averagePassAsc") {
        this.quizzesForDisplay = [...this.quizzes].sort(
          (a, b) => a.averagePass - b.averagePass
        );
      } else if (sortType === "averagePassDes") {
        this.quizzesForDisplay = [...this.quizzes].sort(
          (a, b) => b.averagePass - a.averagePass
        );
      } else {
        this.quizzesForDisplay = [...this.quizzes].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      }
    },
    getTemplateContent() {
      let contentProcessed = 0;
      this.quizzes.forEach(element => {
        QuizTemplateRepository.getTemplateContent(element.tn, this.token)
          .then(response => {
            // process content of each quiz
            let quizContent = JSON.parse(response.data.content.content);

            let quizData = {
              tn: element.tn,
              id: element.id,
              theme: quizContent.properties.theme,
              playTimes: quizContent.properties.playTimes || 0,
              averagePass: quizContent.properties.averagePass || 0,
              questions: quizContent.questions,
              timeLimit: quizContent.properties.timeLimit || 0,
              thumbnail: quizContent.properties.thumbnail
            };

            if (quizData.thumbnail) {
              FileRepository.getFileLink(quizData.thumbnail, this.token).then(
                res => {
                  quizData.thumbnailUrl = res.data.file[0].link;
                  this.updateQuiz(quizData);
                  contentProcessed++;
                  if (contentProcessed === this.quizzes.length) {
                    this.sortQuizzes(this.sortState);
                    this.setLoaded();
                  }
                }
              );
            } else {
              this.updateQuiz(quizData);
              contentProcessed++;
              if (contentProcessed === this.quizzes.length) {
                this.sortQuizzes(this.sortState);
                this.setLoaded();
              }
            }
          })
          .catch(error => {
            this.$q.notify({
              icon: "error",
              type: "negative",
              message: `Failed to load quiz template contents`
            });
          });
      });
    },
    getAllTemplates() {
      QuizTemplateRepository.getAllTemplates(this.token)
        .then(response => {
          let templateProcessed = 0;
          let template = {};
          response.data.template.forEach(element => {
            if (!this.availableTn.find(key => key === element.tn)) return;
            template = {
              tn: element.tn,
              title: element.label,
              description: element.description,
              date: element.content[0].last_update
            };

            this.updateQuiz(template);
            templateProcessed++;

            if (templateProcessed === this.availableTn.length) {
              this.getTemplateContent();
            }
          });
        })
        .catch(error => {
          this.$q.notify({
            icon: "error",
            type: "negative",
            message: `Failed to load quiz template`
          });
        });
    },
    getAllForms() {
      this.emptyQuizzes();
      QuizFormRepository.getAllQuizForms(this.token)
        .then(response => {
          let formProcessed = 0;
          let form = {};
          response.data.form.forEach(element => {
            if (
              element.tn === "" ||
              this.availableTn.find(key => key === element.tn)
            ) {
              formProcessed++;
              if (formProcessed === response.data.form.length) {
                this.getAllTemplates();
              }
              return;
            }

            form = {
              id: formProcessed,
              fh: element.fh,
              tn: element.tn
            };
            this.addQuiz(form);
            formProcessed++;
            if (formProcessed === response.data.form.length) {
              this.getAllTemplates();
            }
          });
        })
        .catch(error => {
          this.$q.notify({
            icon: "error",
            type: "negative",
            message: `Failed to load quiz forms`
          });
        });
    },
    deleteTemplate(id) {
      this.deleteQuiz(id);
      this.sortQuizzes(this.sortState);
    },
    getUser(token, uh) {
      Authenticator.getUserByToken(token)
        .then(response => {
          this.attemptUserObject(response.data.user);
        })
        .catch(error => {
          this.$q.notify({
            icon: "error",
            color: "negative",
            message: "Failed to get user data"
          });
        });
    },
    createRoom(fh, title, timeLimit, thumbnailUrl) {
      if (fh == undefined || this.userHash == undefined) {
        console.log("form hash or user hash is undefined");
        return;
      }

      if (title == undefined || timeLimit == undefined) {
        console.log("Time limit or title is undefined");
        return;
      }

      this.$store.dispatch("waitingRoom/setTitle", { title: title });
      this.$store.dispatch("waitingRoom/setFormHash", { formHash: fh });
      this.$store.dispatch("waitingRoom/setThumbnailUrl", {
        thumbnailUrl: thumbnailUrl
      });

      this.socketCommunicator.emit("createRoomRequest", {
        title: title,
        userHash: this.userHash,
        formHash: fh,
        duration: timeLimit,
        thumbnailUrl: thumbnailUrl
      });
    },
    viewRunningQuiz() {
      if (this.activeQuiz == undefined) {
        return;
      }

      this.$store.dispatch("waitingRoom/setTitle", {
        title: this.activeQuiz.title
      });
      this.$store.dispatch("waitingRoom/setFormHash", {
        formHash: this.activeQuiz.formHash
      });
      this.$store.dispatch("waitingRoom/setInvitationCode", {
        invitationCode: this.activeQuiz.code
      });
      this.$store.dispatch("waitingRoom/setThumbnailUrl", {
        thumbnailUrl: this.activeQuiz.thumbnailUrl
      });

      this.$router.push({ name: "waitingroom" });
    },
    beforeUnload() {
      this.socketCommunicator.socket.removeAllListeners();
      this.socketCommunicator.socket.close();
      this.socketCommunicator = null;
    }
  }
};
</script>

<style lang="scss" scoped>
h5 {
  color: $primary;
  margin: 70px 0 10px 0;
}
@media only screen and (max-width: 600px) {
  .box {
    justify-content: center;
  }
}
</style>
