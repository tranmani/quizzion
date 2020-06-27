
<template>
    <q-card class="question-card">
        <q-card-section class="card-header bg-white text-black">
            <div class="text-h6">{{question.label}}</div>
            <div class="text-subtitle2">{{question.description}}</div>
            <div class="card-toolbar">
                <i class="fa fa-trash" v-on:click="remove(question.id)"></i>
                <i class="fa fa-edit" v-on:click="edit(question.id)"></i>
                <i class="fa fa-arrows"></i>
            </div>
        </q-card-section>
        <q-separator ></q-separator>
        <!-- Edit mode body section -->
        <q-card-actions align="around" v-if="editMode">
            <div class="answer-button" v-for="answer in question.answers" :key="answer.place" flat>
                <span class="pre">
                <p>{{answer.position}}</p>
                </span>
                <p>{{answer.label}}</p>
            </div>
        </q-card-actions>
        <!-- Regular body section, this will be rendered during a quiz.-->
        <q-card-actions align="around" v-else>
            <div class="answer-button" v-for="answer in question.answers" :key="answer.place" v-on:click="selectAnswer(answer)" flat>
                <span class="pre">
                <p>{{answer.position}}</p>
                </span>
                <p>{{answer.label}}</p>
            </div>
        </q-card-actions>
    </q-card>
</template>

<script>
export default {
  name: 'QuestionCard',
  props: ["question", "editMode"], // Should be set via two-way binding in parent component.
  created() {
    this.question.answers.sort((a, b) => (a.position > b.position) ? 1 : -1)
  },
  methods: {
      selectAnswer:function(answer) {
          this.$emit("selected", answer);
      },
      edit:function(questionId) {
          this.$emit("edit", this.question.name);
      },
      remove:function(questionId) {
          this.$emit("remove", this.question.position);
      }
  }
}
</script>

