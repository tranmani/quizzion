
<template>
  <div class="bar-content">
    <q-form @submit="submit" class="q-gutter-md">
      <q-input
        filled
        v-model="quiz.title"
        label="Title"
        lazy-rules
        :rules="[ val => val.length > 4 || 'Please type something longer than 4 characters']"
      />
      <q-input
        filled
        type="text"
        v-model="quiz.description"
        label="Description"
        lazy-rules
        :rules="[ val => val.length > 0 || 'Please type something']"
      />
      <q-input
        filled
        type="number"
        v-model="quiz.timeLimit"
        label="Time limit"
        :rules="[ val => val > 5 || 'Time limit should be higher than 5']"
      />
      <q-file filled bottom-slots v-model="quiz.thumbnail" label="Thumbnail">
        <template v-slot:before>
          <q-icon name="folder_open" />
        </template>
        <template v-slot:hint>A thumbnail for the quiz.</template>
        <template v-slot:append>
          <q-btn round dense flat icon="add" @click.stop />
        </template>
      </q-file>
      <p>Themes</p>
      <div class="theme-list">
        <div class="theme-1 theme-preview" @click="selectTheme(1)"></div>
        <div class="theme-2 theme-preview" @click="selectTheme(2)"></div>
        <div class="theme-3 theme-preview" @click="selectTheme(3)"></div>
        <div class="theme-4 theme-preview" @click="selectTheme(4)"></div>
        <div class="theme-5 theme-preview" @click="selectTheme(5)"></div>
      </div>
      <div>
        <q-btn label="Save" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "EditorGeneralBar",
  data() {
    return {
      quiz: {
        title: "",
        description: "",
        theme: 1,
        timeLimit: 60
      }
    };
  },
  computed: {
    ...mapGetters("SingleQuizModule", ["getQuiz"])
  },
  mounted() {
    Object.assign(this.quiz, this.getQuiz);
  },
  methods: {
    ...mapActions("SingleQuizModule", ["saveQuiz"]),
    submit() {
      this.saveQuiz(this.quiz);
      this.$emit("submitQuiz");
    },

    selectTheme(theme) {
      this.quiz.theme = theme;
      this.saveQuiz({ theme: theme });
    }
  }
};
</script>
  
