<template>
  <!--t-->
  <q-page v-if="loaded" class="quiz-editor flex">
    <div class="question-listing" :class="`theme-${this.getQuiz.theme}`">
      <div class="question-listing-add">
        <q-btn class="q-mb-lg" color="white" text-color="black" style="float:left" @click="back">
          <i class="fa fa-arrow-left" />
        </q-btn>
        <q-btn
          class="q-mb-lg"
          style="background: green; color: white; float:right"
          @click="addQuestion"
        >
          <i class="fa fa-plus" />
        </q-btn>

        <div style="clear:both"></div>
        <div v-drag-and-drop="options">
          <q-list @reordered="reordered($event, questions);">
            <QuestionCard
              v-for="question in questions"
              :key="question.position"
              :data-id="question.position"
              :question="question"
              :editMode="true"
              @edit="loadQuestion"
              @remove="removeQuestion"
            ></QuestionCard>
          </q-list>
        </div>
      </div>
    </div>
    <div class="editor-sidebar">
      <div class="editor-title">
        <h3>{{editorTitle}}</h3>
        <EditorGeneralBar v-if="editorTitle === 'General'" @submitQuiz="submitQuiz"></EditorGeneralBar>
        <EditorQuestionBar
          v-if="editorTitle === 'Question'"
          @cancel="backToGeneral"
          @submitQuestion="editQuestion2"
        ></EditorQuestionBar>
      </div>
    </div>
  </q-page>
</template>

<script>
import QuestionCard from "../components/QuestionCard";
import EditorGeneralBar from "../components/EditorGeneralBar";
import EditorQuestionBar from "../components/EditorQuestionBar";
import QuizTemplateRepository from "../remote/quiz/QuizTemplateRepository";
import QuizFormRepository from "../remote/quiz/QuizFormRepository";
import AnswerRepository from "../remote/quiz/AnswerRepository";
import QuestionRepository from "../remote/quiz/QuestionRepository";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    QuestionCard,
    EditorGeneralBar,
    EditorQuestionBar
  },
  data() {
    return {
      count: 1,
      editorTitle: "General",
      newQuiz: true,
      newQuestion: true,
      quiz: {
        tn: "",
        title: "",
        description: "",
        timeLimit: 60,
        theme: 1,
        playTimes: 0,
        averagePass: 0,
        thumbnail: ""
      },
      options: {
        multipleDropzonesItemsDraggingEnabled: false,
        dropzoneSelector: ".q-list",
        draggableSelector: ".question-card"
      },
      loadedTemplateHash: "",
      currentPosition: 1,
      questions: [],
      loaded: false
    };
  },
  computed: {
    ...mapGetters("SingleQuizModule", ["getQuiz", "getQuestion"]),
    ...mapGetters("authLogin", ["token"])
  },
  created() {
    this.$q.loading.show();
    this.loadedTemplateHash =
      typeof this.$route.params.chosenTemplateHash == "undefined"
        ? ""
        : this.$route.params.chosenTemplateHash;

    if (this.loadedTemplateHash != "") {
      QuizTemplateRepository.getTemplate(
        this.loadedTemplateHash,
        this.token
      ).then(res => {
        this.quiz = {
          tn: res.data.template.tn,
          title: res.data.template.label,
          description: res.data.template.description
        };
        QuizTemplateRepository.getTemplateContent(
          this.quiz.tn,
          this.token
        ).then(res => {
          const templateContent = JSON.parse(res.data.content.content);
          var questions = templateContent.questions;
          this.quiz.theme = templateContent.properties.theme;
          this.quiz.timeLimit = templateContent.properties.timeLimit;
          this.quiz.averagePass = templateContent.properties.averagePass;
          this.quiz.playTimes = templateContent.properties.playTimes;
          this.quiz.thumbnail = templateContent.properties.thumbnail;
          this.quiz.questions = questions;

          this.saveQuiz(this.quiz);

          if (!questions) return;
          questions.forEach(question => {
            QuestionRepository.getQuestion(question, this.token).then(
              resQuest => {
                var vogh = resQuest.data.var[0].vogh;
                var questionName = resQuest.data.var[0].name;

                AnswerRepository.getAnswerGroupAnswers(vogh, this.token).then(
                  resAnswer => {
                    var quest = {
                      name: resQuest.data.var[0].name,
                      vh: resQuest.data.var[0].vh,
                      vogh: resQuest.data.var[0].vogh,
                      label: resQuest.data.var[0].label,
                      position: resQuest.data.var[0].position,
                      description: "",
                      answers: []
                    };
                    resAnswer.data.varoptiongroup.forEach(answer => {
                      answer.position = this.getPositionString(answer.position);

                      if (answer.value > 0) answer.isCorrect = true;
                      else answer.isCorrect = false;

                      quest.answers.push(answer);
                    });

                    this.questions.push(quest);
                    this.currentPosition++;
                  }
                );
              }
            );
          });
          this.questions.sort((a, b) => (a.position > b.position ? 1 : -1));
          this.loaded = true;
          this.$q.loading.hide();
        });
      });
    } else {
      this.saveQuiz(this.quiz);
      this.loaded = true;
      this.$q.loading.hide();
    }
  },
  methods: {
    ...mapActions("SingleQuizModule", [
      "saveQuiz",
      "addQuestionToQuiz",
      "saveStateQuestion",
      "emptyQuizAndQuestions"
    ]),
    ...mapActions("quizzes", ["setLoaded"]),

    loadQuestion(name) {
      this.questions.forEach(question => {
        if (question.name === name) {
          this.saveStateQuestion(question);
          this.editorTitle = "Question";
        }
      });
    },

    /**
     * Add a question to the quiz.
     */
    addQuestion() {
      var num = this.currentPosition++;
      var q = {
        label: "Add text",
        position: num,
        vartype: "item",
        datatype: "varoption",
        answers: []
      };
      this.saveStateQuestion(q);
      this.questions.push(q);
    },

    /**
     * Close the question editor and go back to the quiz editor.
     */
    backToGeneral() {
      this.editorTitle = "General";
    },

    removeQuestion(position) {
      var index;
      var index2;
      this.questions.forEach(question => {
        if (question.position === position) {
          this.$store.state.question = null;
          index = this.questions.indexOf(question);
          if (question.vh) {
            index2 = this.quiz.questions.indexOf(question.vh);
            this.quiz.questions.splice(index2, 1);
            QuestionRepository.deleteQuestion(question.vh, this.token).then(
              res => {
                this.editQuiz();
              }
            );
          }

          this.questions.splice(index, 1);
          this.currentPosition = this.quiz.questions.length;
          this.editorTitle = "General";
        }
      });
    },

    reordered(event, group) {
      const reorderedItems = group.filter(
        item => event.detail.ids.map(Number).indexOf(item.position) >= 0
      );

      var originPos = this.questions.indexOf(reorderedItems[0]);

      const newItems = group.filter(
        item => event.detail.ids.map(Number).indexOf(item.position) < 0
      );

      var temp = reorderedItems[0];
      var temp2 = this.questions[event.detail.index];
      var position = temp2.position;

      temp2.position = temp.position;
      temp.position = position;

      this.questions[originPos] = temp2;
      this.questions[event.detail.index] = temp;
    },

    submitQuiz() {
      if (this.getQuiz.tn !== "") {
        this.editQuiz();
        return;
      }

      const quizContent = {
        type: "quiz",
        properties: {
          label: "label in content property",
          theme: this.getQuiz.theme,
          timeLimit: parseInt(this.getQuiz.timeLimit),
          playTimes: this.getQuiz.playTimes,
          averagePass: this.getQuiz.averagePass,
          thumbnail: this.getQuiz.thumbnail
        },
        questions: []
      };

      QuizTemplateRepository.postQuizTemplate(
        "form_json",
        "survey",
        "active",
        this.getQuiz.title,
        this.getQuiz.description,
        "JSON",
        quizContent,
        this.token
      )
        .then(res => {
          this.getQuiz.tn = res.data.tn;
          this.newQuiz = false;
          var voghs = '{"question_hashes":[]}';
          QuizFormRepository.postQuizForm(
            this.getQuiz.title,
            "survey",
            res.data.tn,
            this.token
          ).then(res2 => {
            this.questions.forEach(question => {
              var questionAdd = {
                label: question.label,
                vartype: "item",
                datatype: "varoption",
                isNew: true
              };
              var position = this.count++;
              var q = "question" + position;
              // Add an answer group for a question.
              AnswerRepository.postAnswerGroup(question.label, 1, this.token)
                .then(res3 => {
                  question.vogh = res3.data.vogh;

                  // Add answers to a question.
                  question.answers.forEach(answer => {
                    this.saveAnswer(answer, res3.data.vogh, this.token, false);
                    position++;
                  });

                  questionAdd.vogh = res3.data.vogh;

                  this.saveQuestion(questionAdd, res.data.tn, quizContent);
                  // reload dashboard
                  this.setLoaded("false");
                })
                .catch(err => {
                  this.$q.notify({
                    type: "negative",
                    message: `Failed to postAnswerGroup ${err}`
                  });
                });
            });
          });
        })
        .catch(err => {
          this.$q.notify({
            type: "negative",
            message: `Failed to postQuizTemplate ${err}`
          });
        });
    },

    editQuiz() {
      const quizContent = {
        type: "quiz",
        properties: {
          theme: this.getQuiz.theme,
          timeLimit: parseInt(this.getQuiz.timeLimit),
          playTimes: this.getQuiz.playTimes,
          averagePass: this.getQuiz.averagePass,
          thumbnail: this.getQuiz.thumbnail
        },
        questions: this.quiz.questions
      };

      QuizTemplateRepository.updateTemplate(
        this.getQuiz.tn,
        "active",
        this.getQuiz.title,
        this.getQuiz.description,
        this.token
      )
        .then(res => {
          QuizTemplateRepository.updateTemplateContent(
            this.getQuiz.tn,
            "json",
            quizContent,
            this.token
          )
            .then(res2 => {
              this.questions.forEach(question => {
                this.saveStateQuestion(question);
                this.editQuestion2();
                // reload dashboard
                this.setLoaded("false");
              });
              this.$q.notify({
                type: "positive",
                message: "Quiz updated!"
              });
            })
            .catch(err => {
              this.$q.notify({
                type: "negative",
                message: "Something went wrong while saving the quiz! " + err
              });
            });
        })
        .catch(err => {
          this.$q.notify({
            type: "negative",
            message: "Something went wrong while saving the quiz! " + err
          });
        });
    },

    saveQuestion(question, templateNumber, quizContent) {
      question = {
        label: question.label,
        vartype: question.vartype,
        datatype: question.datatype,
        position: question.position,
        vogh: question.vogh
      };

      QuestionRepository.postQuestion(question, this.token)
        .then(res4 => {
          quizContent.questions.push(res4.data.vh);
          QuizTemplateRepository.putQuestionInQuizTemplate(
            "json",
            templateNumber,
            quizContent,
            this.token
          )
            .then(res => {
              this.$q.notify({
                type: "positive",
                message: "questions added to quiz!"
              });
            })
            .catch(err => {
              this.$q.notify({
                type: "negative",
                message: "Unable to add questions to quiz!: " + err
              });
            });
        })
        .catch(err => {
          this.$q.notify({
            type: "negative",
            message: "Quiz could not be created! " + err
          });
        });
    },

    editQuestion2() {
      var question = this.getQuestion;
      this.saveQuestionToList(question);
      if (this.loadedTemplateHash != "" && question.vh) {
        question = {
          label: question.label,
          vartype: "item",
          datatype: "varoption",
          position: question.position,
          vogh: question.vogh,
          vh: question.vh,
          answers: question.answers
        };

        if (question.vh) {
          QuestionRepository.updateQuestion(question, this.token).then(res => {
            question.answers.forEach(answer => {
              if (answer.isCorrect) answer.value = 5;
              else answer.value = 0;

              if (answer.name) {
                this.saveAnswer(answer, question.vogh, this.token, true);
              } else {
                this.saveAnswer(answer, question.vogh, this.token, false);
              }
            });
          });
        }
      } else {
        const quizContent = {
          type: "quiz",
          properties: {
            theme: this.quiz.theme,
            timeLimit: parseInt(this.quiz.timeLimit)
          },
          questions: this.quiz.questions
        };
        // Add an answer group for a question.
        if (this.quiz.tn) {
          AnswerRepository.postAnswerGroup(question.label, 1, this.token)
            .then(res3 => {
              question.vogh = res3.data.vogh;

              // Add answers to a question.
              question.answers.forEach(answer => {
                if (answer.von) {
                  this.saveAnswer(answer, res3.data.vogh, this.token, true);
                } else {
                  this.saveAnswer(answer, res3.data.vogh, this.token, false);
                }
              });
              question.vogh = res3.data.vogh;
              this.saveQuestion(
                question,
                this.getQuiz.tn,
                quizContent,
                this.token
              );
            })
            .catch(err => {
              this.$q.notify({
                type: "negative",
                message: err
              });
            });
        }
      }
      this.editorTitle = "General";
    },

    saveQuestionToList(question) {
      var i = 0;
      this.questions.forEach(q => {
        if (q.position === question.position) {
          this.questions[i] = question;
        }
        i++;
      });
    },

    updateListing(question) {
      this.questions.forEach(q => {
        if (q.position === question.position) {
          q = question;
        }
      });
    },

    editQuestion(vogh, question) {
      QuestionRepository.updateQuestion(question, this.token)
        .then(res => {
          this.$q.notify({
            type: "positive",
            message: "Question has been edited!"
          });
        })
        .catch(err => {
          this.$q.notify({
            type: "negative",
            message: "Could not edit question! " + err
          });
        });
    },

    saveAnswer(answer, vogh, token, edit) {
      var answerToAdd = {
        label: answer.label,
        position: this.getPositionNumber(answer.position)
      };
      // points for each correct answer.
      // I just came up with these numbers randomly.
      if (answer.isCorrect) answerToAdd.value = 5.0;
      else answerToAdd.value = 0.0;

      if (answer.name) answerToAdd.name = answer.name;

      if (!edit) {
        AnswerRepository.postAnswer(answerToAdd, vogh, token)
          .then(res => {
            this.$q.notify({
              type: "positive",
              message: "Answers saved!"
            });
          })
          .catch(err => {
            this.$q.notify({
              type: "negative",
              message: "Could not save answer! " + err
            });
          });
      } else {
        AnswerRepository.updateAnswer(answerToAdd, vogh, token)
          .then(res => {
            this.$q.notify({
              type: "positive",
              message: "Answers saved!"
            });
          })
          .catch(err => {
            this.$q.notify({
              type: "negative",
              message: "Could not edit answer! " + err
            });
          });
      }
    },

    getPositionNumber(position) {
      switch (position) {
        case "A":
          return 1;
          break;
        case "B":
          return 2;
          break;
        case "C":
          return 3;
          break;
        case "D":
          return 4;
          break;
        default:
          break;
      }
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

    back() {
      this.$router.push({ path: "/dashboard" });
      this.emptyQuizAndQuestions();
    }
  }
};
</script>
