
<template>
  <div class="bar-content">
    <q-form @submit="submit" class="q-gutter-md">
      <q-input
        filled
        v-model="question.label"
        label="Title"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />
      <!--
        <q-input
            filled
            type="textarea"
            v-model="question.description"
            label="Description"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
      />-->
      <div class="row" v-drag-and-drop="options">
        <q-list class="question-answer-listing" @reordered="reordered($event, question.answers);">
          <q-item
            v-for="item in question.answers"
            v-on:click.native="editAnswer(item)"
            :key="item.position"
            :data-id="item.position"
            class="question-answer-listing-item"
          >
            <div
              class="list-item"
              v-bind:class="{correct: item.isCorrect}"
            >{{item.place}}) {{item.label}}</div>
          </q-item>
        </q-list>
      </div>
      <div class="answer-edit">
        <q-input v-model="toEditAnswer.label" label="Answer" />
        <q-toggle v-model="toEditAnswer.isCorrect" />
        <q-btn label="Save" color="primary" v-on:click="saveAnswer" />
      </div>
      <div>
        <q-btn label="Done" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "EditorGeneralBar",
  computed: {
    ...mapGetters("SingleQuizModule", ["getQuestion"])
  },
  data() {
    return {
      options: {
        multipleDropzonesItemsDraggingEnabled: false,
        dropzoneSelector: ".q-list",
        draggableSelector: ".q-item"
      },
      currentPlace: "A",
      toEditAnswer: {
        place: "",
        description: "",
        isCorrect: false
      },
      editingAnswer: false
    };
  },
  created() {
    this.question = this.getQuestion;
    console.log("question: ", this.getQuestion);
  },
  methods: {
    ...mapActions("SingleQuizModule", ["saveQuestion"]),
    submit() {
      this.saveQuestion(this.question);
      this.$emit("submitQuestion");
    },

    reordered(event, group) {
      const reorderedItems = group.filter(
        item => event.detail.ids.map(String).indexOf(item.place) >= 0
      );

      var originalPosition = this.question.answers.indexOf(reorderedItems[0]);

      const newItems = group.filter(
        item => event.detail.ids.map(String).indexOf(item.place) < 0
      );

      // create temp storaga for the dragged item.
      var temp = reorderedItems[0];
      // create temp storage for the item to be swapped.
      var temp2 = this.question.answers[event.detail.index];
      // create temp storage for temp2's place.
      var place = temp2.place;
      // swap the places.
      temp2.place = temp.place;
      temp.place = place;
      // save stored and swaped items into array.
      this.question.answers[originalPosition] = temp2;
      this.question.answers[event.detail.index] = temp;
    },

    incrementPlace() {
      switch (this.currentPlace) {
        case "A":
          this.currentPlace = "B";
          break;
        case "B":
          this.currentPlace = "C";
          break;
        case "C":
          this.currentPlace = "D";
          break;
        default:
          this.showErrorAlert("Question limit reached!");
      }
    },

    saveAnswer() {
      if (!this.editAnswer) {
        if (
          this.question.answers.length < 4 &&
          this.question.answers.length > 0
        ) {
          this.incrementPlace();
          this.toEditAnswer.place = this.currentPlace;
          this.question.answers.push(this.toEditAnswer);
          this.toEditAnswer = {
            place: "",
            description: "",
            isCorrect: false
          };
        } else if (this.question.answers.length === 0) {
          this.toEditAnswer.place = this.currentPlace;
          this.question.answers.push(this.toEditAnswer);
          this.toEditAnswer = {
            place: "",
            description: "",
            isCorrect: false
          };
        } else if (this.question.answers.length === 4) {
          this.showErrorAlert("Question limit reached!");
        }
      } else {
        this.editingAnswer = false;
        this.toEditAnswer.place = this.currentPlace;
        this.incrementPlace();
        this.question.answers.push(this.toEditAnswer);
        this.toEditAnswer = {
          place: "",
          description: "",
          isCorrect: false
        };
      }
    },

    editAnswer(answer) {
      this.toEditAnswer = answer;
      this.editingAnswer = true;
    },

    cancel() {
      this.$emit("cancel");
    },

    showErrorAlert(message) {
      this.$q.notify({
        type: "negative",
        message: message
      });
    }
  }
};
</script>
  
