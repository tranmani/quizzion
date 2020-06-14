<template>
  <div
    class="box shadow-1 rounded-borders col-auto q-ma-md"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="hover = !hover"
  >
    <div class="row icon-center bg-box" :class="bgTheme">
      <transition name="fade">
        <div v-if="hover" class="q-gutter-sm cursor-pointer">
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
    <div class="info">
      <p class="center title q-pt-xs">{{ title | truncate(26, '...') }}</p>
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
    inviteCode: {},
    theme: {
      type: Number,
      required: true,
      default: 1
    }
  },
  mounted() {},
  computed: {
    bgTheme: function() {
      let theme;
      if (this.theme == 1) theme = "bg1";
      if (this.theme == 2) theme = "bg2";
      if (this.theme == 3) theme = "bg3";
      if (this.theme == 4) theme = "bg4";
      if (this.theme == 5) theme = "bg5";
      return theme;
    },
    ...mapGetters("authLogin", ["token"])
  },
  data() {
    return {
      hover: false,
      quizzLink: "quizz/" + this.id
    };
  },
  filters: {
    truncate: function(text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    }
  },
  methods: {
    onResize(){
      if(window.innerWidth < 600){
        this.hover = true
      } else {
        this.hover = false
      }
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
      this.$router.push({ path: "/quiz/" + this.inviteCode });
    },
    goToEditQuizz() {
      this.$router.push({
        path: "/quiz/" + this.tn,
        props: { chosenTemplateHash: this.tn }
      });
    }
  },
  created() {
    window.addEventListener('resize', this.onResize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
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
.bg1 {
  background-image: linear-gradient(0deg, #08aeea 0%, #2af598 100%);
}
.bg2 {
  background-image: linear-gradient(147deg, #ffe53b 0%, #ff2525 74%);
}
.bg3 {
  background-image: linear-gradient(19deg, #21d4fd 0%, #b721ff 100%);
}
.bg4 {
  background-image: linear-gradient(19deg, #faaca8 0%, #ddd6f3 100%);
}
.bg5 {
  background-image: linear-gradient(90deg, #fee140 0%, #fa709a 100%);
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
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
a,
a:hover,
a:visited {
  color: black;
}
</style>
