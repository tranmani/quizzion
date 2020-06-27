
<template>
  <div class="bar-content">
    <q-form @submit="submit" class="q-gutter-md">
      <q-input
        filled
        v-model="quiz.title"
        label="Title"
        lazy-rules
        v-on:blur="saveState"
        :rules="[ val => val.length > 4 || 'Please type something longer than 4 characters']"
      />
      <q-input
        filled
        type="text"
        v-model="quiz.description"
        label="Description"
        lazy-rules
        v-on:blur="saveState"
        :rules="[ val => val.length > 0 || 'Please type something']"
      />
      <q-input
        filled
        type="number"
        v-model="quiz.timeLimit"
        label="Time limit"
        v-on:blur="saveState"
        :rules="[ val => val > 5 || 'Time limit should be higher than 5']"
      />

      <img id="thumbnail" />
      <q-file filled bottom-slots v-model="thumbnail" label="Thumbnail">
        <template v-slot:before>
          <q-icon name="folder_open" />
        </template>
        <template v-slot:hint>A thumbnail for the quiz.</template>
        <template v-slot:append>
          <q-btn round dense flat icon="add" @click="saveThumbnail()" />
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
import FileRepository from "../remote/files/FileRepository";
export default {
  name: "EditorGeneralBar",
  data() {
    return {
      quiz: {
        title: "",
        description: "",
        theme: 1,
        timeLimit: 60
      },
      thumbnail: null,
      thumbnailUrl: ""
    };
  },
  computed: {
    ...mapGetters("SingleQuizModule", ["getQuiz"]),
    ...mapGetters("authLogin", ["token", "userHash"])
  },
  created() {
    Object.assign(this.quiz, this.getQuiz);
    if (this.quiz.thumbnail !== "") {
      // get the file!
      FileRepository.getFile(
        this.quiz.thumbnail,
        this.userHash,
        this.token
      ).then(res => {
        const file = res.data.file[0];
        document.getElementById("thumbnail").src =
          "data:image/" + file.extension + ";base64," + file.content;
      });
    }
  },
  mounted() {},
  methods: {
    ...mapActions("SingleQuizModule", ["saveQuiz"]),
    submit() {
      this.saveQuiz(this.quiz);
      this.$emit("submitQuiz");
    },
    selectTheme(theme) {
      this.quiz.theme = theme;
      this.saveQuiz({ theme: theme });
    },
    async saveThumbnail() {
      var response = await FileRepository.createFileInFolder(
        this.thumbnail,
        this.token
      );
      this.quiz.thumbnail = response.data.fih;
      this.saveQuiz(this.quiz);
    },
    loadThumbnail(event) {
      this.thumbnail = event.target.files[0];
    },
    saveState() {
      this.saveQuiz(this.quiz);
    }
  }
};
</script>
  
