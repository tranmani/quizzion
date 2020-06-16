<template>
  <div
    class="box shadow-1 rounded-borders col-auto q-ma-md"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="row icon-center bg-box" :class="bgTheme">
      <transition name="fade">
        <div v-if="hover || this.width < 600" class="q-gutter-sm cursor-pointer">
          <q-icon name="delete_outline" size="35px" @click="deleteConfirm">
            <q-tooltip anchor="top middle" self="top middle" :offset="[10, 30]">Delete {{ title }}</q-tooltip>
          </q-icon>
          <q-icon name="visibility" size="35px" @click="goToQuizz">
            <q-tooltip anchor="top middle" self="top middle" :offset="[10, 30]">View {{ title }}</q-tooltip>
          </q-icon>
          <q-icon name="create" size="35px" @click="goToEditQuizz">
            <q-tooltip anchor="top middle" self="top middle" :offset="[10, 30]">Edit {{ title }}</q-tooltip>
          </q-icon>
        </div>
      </transition>
    </div>
    <div class="info cursor-pointer" @click="createQuizSession">
      <p class="center title q-pt-xs">{{ title | truncate(26, "...") }}</p>
      <p class="float-left q-pl-sm">{{ averagePass }}% Avg.</p>
      <p class="float-right q-pr-sm">{{ formatNumber(playTimes) }} Plays</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import QuizTemplateRepository from "../../remote/quiz/QuizTemplateRepository";
import QuizFormRepository from "../../remote/quiz/QuizFormRepository";

export default {
  name: "Created",
  props: {
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: "",
      required: true
    },
    averagePass: {
      required: true,
      default: 0
    },
    playTimes: {
      required: true,
      default: 0
    },
    tn: {
      required: true
    },
    fh: {
      required: true
    },
    timeLimit: {
      required: true
    },
    inviteCode: {},
    theme: {
      type: Number,
      required: true,
      default: 1
    }
  },
  computed: {
    bgTheme() {
      let theme;
      if (this.theme == 1) theme = "theme-1";
      if (this.theme == 2) theme = "theme-2";
      if (this.theme == 3) theme = "theme-3";
      if (this.theme == 4) theme = "theme-4";
      if (this.theme == 5) theme = "theme-5";
      return theme;
    },
    ...mapGetters("authLogin", ["token"])
  },
  data() {
    return {
      hover: false,
      quizzLink: "quizz/" + this.id,
      width: 0
    };
  },
  filters: {
    truncate(text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    }
  },
  methods: {
    onResize() {
      if (window.innerWidth < 600) {
        this.hover = true;
      } else {
        this.hover = false;
      }
      this.width = window.innerWidth
    },
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    },
    deleteConfirm() {
      this.$q
        .dialog({
          title: "Confirm",
          message: `Would you like to delete ${this.title}?`,
          cancel: true
        })
        .onOk(() => {
          this.deleteTemplate(this.tn, this.fh);
        });
    },
    deleteTemplate(tn, fh) {
      QuizTemplateRepository.deleteTemplate(tn, this.token)
        .then(response => {
          QuizFormRepository.deleteQuizForm(fh, this.token)
            .then(response => {
              this.$emit("delete", this.id);
            })
            .catch(error => {
              this.$q.notify({
                icon: "error",
                type: "negative",
                message: `Failed to delete form ${this.title}`
              });
            });
        })
        .catch(error => {
          this.$q.notify({
            icon: "error",
            type: "negative",
            message: `Failed to delete template ${this.title}`
          });
        });
    },
    goToQuizz() {
      this.$router.push({
        path: "/statisticoverview/" + this.tn + "/" + this.fh,
        props: {
          chosenTemplateHash: this.tn,
          chosenFormHash: this.fh
        }
      });
    },
    goToEditQuizz() {
      this.$router.push({
        path: "/quiz/" + this.tn
      });
    },
    createQuizSession() {
      this.$emit("createRoom", this.fh, this.title, this.timeLimit);
    }
  },
  created() {
    window.addEventListener("resize", this.onResize);
    this.width = window.innerWidth;
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  mounted() {}
};
</script>

<style scoped>
.box {
  max-width: 200px;
  max-height: 100px;
  width: 100%;
  height: 100%;
}
.bg-box {
  width: 100%;
  height: 50px;
}
.info {
  width: 100%;
  height: 50px;
  overflow: hidden;
}
.center {
  text-align: center;
}
.icon-center {
  justify-content: center;
  align-content: center;
}
p {
  margin: 0px;
  color: #4f4f4f;
}
.title {
  font-weight: bold;
  font-size: 1.1em;
  overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
