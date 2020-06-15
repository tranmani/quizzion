
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
            >{{item.position}}) {{item.label}}</div>
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
      question: {},
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
    this.question = Object.assign({}, this.question, this.getQuestion);
    this.question.answers.sort((a, b) => (a.position > b.position) ? 1 : -1)
    this.currentPlace = this.getPositionString(this.question.answers.length+1);
    console.log("current place is ", this.currentPlace);
  },
  methods: {
    ...mapActions("SingleQuizModule", ["saveStateQuestion"]),
    submit() {
      this.saveStateQuestion(this.question);
      this.$emit("submitQuestion");
    },

    reordered(event, group) {
      const reorderedItems = group.filter(
        item => event.detail.ids.map(String).indexOf(item.position) >= 0
      );

      var originalPosition = this.question.answers.indexOf(reorderedItems[0]);

      const newItems = group.filter(
        item => event.detail.ids.map(String).indexOf(item.position) < 0
      );

      // create temp storaga for the dragged item.
      var temp = reorderedItems[0];
      // create temp storage for the item to be swapped.
      var temp2 = this.question.answers[event.detail.index];
      // create temp storage for temp2's place.
      var position = temp2.position;
      // swap the places.
      temp2.position = temp.position;
      temp.position = position;
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
      if (!this.editingAnswer) {
        if (this.question.answers.length < 4 
            && this.question.answers.length > 0) {
          this.incrementPlace();
          this.toEditAnswer.position = this.currentPlace;
          this.question.answers.push(this.toEditAnswer);
        } else if (this.question.answers.length === 0) {
          this.toEditAnswer.position = this.currentPlace;
          this.question.answers.push(this.toEditAnswer);
        } else if (this.question.answers.length === 4) {
          this.showErrorAlert("Question limit reached!");
        }
      } else {
        this.editingAnswer = false;
        this.question.answers.forEach(element => {
          if(element.position === this.editAnswer.position) {
            const index = this.question.answers.indexOf(element)
            this.question.answers[index] = this.toEditAnswer;
          }
        });
      }
      this.toEditAnswer = {
        position: "",
        description: "",
        isCorrect: false
      };
    },

    getPositionString(position) {
      switch (position) {
        case 1:
          return "A";
          break;
        case 2:
          return "B";
          break;
        case 3:
          return "C";
          break;
        case 4:
          return "D";
          break;
        default:
          break;
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
  
