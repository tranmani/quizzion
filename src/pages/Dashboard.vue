<template>
  <q-page class="q-pa-md">
    <subheader v-on:sort="sortQuizzes"></subheader>
    <h5 class="q-pl-md">Created quizzes:</h5>
    <q-btn @click="createQuiz">Create new hardcoded Template and Form</q-btn>
    <div v-if="!dashboardLoaded" class="row">
      <CreatedQuizSkeleton v-for="index in 6" :key="index" />
    </div>
    <div v-if="dashboardLoaded">
      <div class="row">
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
import io from "socket.io-client";

export default {
  components: {
    CreatedQuiz,
    CreatedQuizSkeleton,
    subheader: SubHeader
  },
  data() {
    return {
      quizzesForDisplay: [],
      socket: null
    };
  },
  computed: {
    ...mapGetters("quizzes", [
      "quizzes",
      "dashboardLoaded",
      "sortState",
      "availableTn"
    ]),
    ...mapGetters("authLogin", ["token", "user"])
  },
  created() {
    if (!this.dashboardLoaded) {
      this.quizzesForDisplay = [];
      this.getAllForms();
    }
    if (Object.keys(this.user).length === 0) {
      this.getUser(this.token);
    }
    this.sortQuizzes(this.sortState);
    this.socket = io("https://3.212.180.89:3000", {
      autoConnect: false,
      transport: ['websocket']
    });
  },
  mounted() {
    this.socket.on("create_room_response", response => {
      console.log(response);

      const code = response.code;

      if (code == undefined) {
        return;
      }

      this.$store.dispatch("waitingRoom/setInvitationCode", {
        invitationCode: code
      });

      this.$router.push({
        name: "waitingroom",
        params: {
          socket: this.socket
        }
      });
    });
  },
  methods: {
    ...mapActions("quizzes", [
      "emptyQuizzes",
      "updateQuiz",
      "addQuiz",
      "deleteQuiz",
      "setLoaded"
    ]),
    ...mapActions("authLogin", ["attemptUser"]),
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
              theme: quizContent.properties.theme || 1,
              playTimes: quizContent.properties.playTimes || 0,
              averagePass: quizContent.properties.averagePass || 0,
              questions: quizContent.questions,
              timeLimit: quizContent.properties.timeLimit || 0
            };
            this.updateQuiz(quizData);
            contentProcessed++;

            if (contentProcessed === this.quizzes.length) {
              this.sortQuizzes(this.sortState);
              this.setLoaded();
              // console.log(this.quizzes);
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
    createQuiz() {
      // will delete this method in production
      let templateContent = {
        type: "quiz",
        properties: {
          label: "label in content property",
          playTimes: 75,
          averagePass: 62,
          theme: 2,
          timeLimit: 60
        },
        questions: []
      };
      QuizTemplateRepository.postQuizTemplate(
        "form_json",
        "survey",
        "active",
        "New quiz title",
        "Some description",
        "JSON",
        templateContent,
        this.token
      )
        .then(response => {
          QuizFormRepository.postQuizForm(
            "new quiz title",
            "survey",
            response.data.tn,
            this.token
          )
            .then(responseForm => {
              this.getAllForms();
            })
            .catch(error => {
              this.$q.notify({
                icon: "error",
                type: "negative",
                message: `Failed to create new form`
              });
            });
        })
        .catch(error => {
          this.$q.notify({
            icon: "error",
            type: "negative",
            message: `Failed to create new template`
          });
        });
    },
    getUser(token, uh) {
      Authenticator.getUserByToken(token)
        .then(response => {
          this.attemptUser(response.data.user);
        })
        .catch(error => {
          this.$q.notify({
            icon: "error",
            color: "negative",
            message: "Failed to get user data"
          });
        });
    },
    createRoom(fh, title, timeLimit) {
      if (fh == undefined || this.user.uh == undefined) {
        console.log("form hash or user hash is undefined");
        return;
      }

      if (title == undefined || timeLimit == undefined) {
        console.log("Time limit or title is undefined");
        return;
      }
      this.socket.open();

      this.$store.dispatch("waitingRoom/setTitle", { title: title });
      this.$store.dispatch("waitingRoom/setFormHash", { formHash: fh });

      console.log("formHash: ", fh);

      this.socket.emit("createRoomRequest", {
        title: title,
        userHash: this.user.uh,
        formHash: fh,
        duration: timeLimit
      });
    }
  }
};
</script>

<style lang="scss" scoped>
h5 {
  color: $primary;
  margin: 70px 0 10px 0;
}
</style>
