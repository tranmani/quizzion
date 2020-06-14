<template>
  <q-card class="question-card">
    <q-card-section class="card-header bg-white text-black">
      <div class="text-h6">{{ question.title }}</div>
      <!-- <div class="text-subtitle2">{{question.description}}</div> -->
    </q-card-section>
    <q-separator></q-separator>
    <q-card-actions align="around">
      <div
        class="answer-button"
        v-for="(answer, index) in this.question.answers"
        :key="answer.position"
        v-on:click="selectAnswer(answer.name)"
        flat
      >
        <span :class="{sel: answer.name == selected, pre: answer.name != selected}">
          <p>{{ answerKeys[index] }}</p>
        </span>
        <p>{{ answer.label }}</p>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: "CompletionQuestionCard",
  props: ["question"],
  data() {
    return {
      answerKeys: ["A", "B", "C", "D"],
      selected: undefined
    };
  },
  methods: {
    selectAnswer: function(name) {
        this.selected = name;
        this.$emit('selected', name)
    }
  },
};
</script>
