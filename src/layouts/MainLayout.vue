<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div><button v-on:click="loginUser">Login</button></div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'
import AnswerRepository from '../remote/quiz/AnswerRepository';
import QuestionRepository from '../remote/quiz/QuestionRepository';
import QuizFormRepository from '../remote/quiz/QuizFormRepository';
import QuizTemplateRepository from '../remote/quiz/QuizTemplateRepository';
import Authenticator from "../remote/user/Authenticator";
import UserRepository from '../remote/user/UserRepository';

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
    }
  },
  methods:  {
    // USER
    loginUser: function (event) {
      // Authenticator.login().then((response) => {
      //   const obj = response.data;
      //   console.log(obj.token);
      // });
      UserRepository.getUser("394f784149e464117e9e333b09420936", this.$store.state.authLogin.token).then((response) => {
        console.log(response.data);
      });
    },
    updateUser: function (event, user) {
      UserRepository.updateUser("394f784149e464117e9e333b09420936", user, this.$store.state.authLogin.token).then((response) => {
        console.log(response.data);
      });
    },
    // QUIZ TEMPLATE
    createQuizTemplate: function (event) {
      // you could replace the hardcorded information with variables
      let templateContent = {
        type: 'quiz',
        properties: {
          label: label || '',
          theme: {}
        },
        pages: []
      }
      QuizTemplateRepository.postQuizTemplate('form_json', 'survey', 'active', 'Some label', 'Some description', 'JSON', templateContent, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    putQuestionInQuizTemplate: function (event) {
      let template_code = "8d2z9xw9q"
      // list of questions to add to the quiz
      let templateContent = {}
      QuizTemplateRepository.putQuestionInQuizTemplate('JSON', template_code, templateContent, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    getTemplate: function (event) {
      let template_code = "8d2z9xw9q"
      QuizTemplateRepository.getTemplate(template_code, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    updateTemplate: function (event) {
      let template_code = "8d2z9xw9q"
      QuizTemplateRepository.updateTemplate(template_code, 'active', 'Some label', 'Some description', this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },

    // QUIZ FORM
    createQuizForm: function (event) {
      let fields = {}
      // the result of successfully creating a quiz template
      let template_code = "8d2z9xw9q"
      QuizFormRepository.postQuizForm('Some label', 'survey', template_code, fields, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    getQuizForm: function (event) {
      let form_hash = '04f42c0cc4045afcbf1b777139900a8e'
      QuizFormRepository.getQuizForm(form_hash, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    updateQuizForm: function (event) {
      let form_hash = '04f42c0cc4045afcbf1b777139900a8e'
      let label = 'Some new label'
      QuizFormRepository.updateQuizForm(form_hash, label, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    deleteQuizForm: function (event) {
      let form_hash = '04f42c0cc4045afcbf1b777139900a8e'
      QuizFormRepository.deleteQuizForm(form_hash, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },

    // QUESTION
    createQuestion: function (event) {
      // var option (answer) group hash so we can connect an answer group to a question
      let vogh = "ae78ea385b5ef5e0118b0d12c01d27aa"
      QuestionRepository.createQuestion('Some label', 'item', 'varoption', vogh, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    getQuestion: function (event) {
      let var_hash = "4d7bae8f423d87473de20f9026d798e7"
      QuestionRepository.getQuestion(var_hash, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    deleteQuestion: function (event) {
      let var_hash = "4d7bae8f423d87473de20f9026d798e7"
      QuestionRepository.deleteQuestion(var_hash, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    updateQuestion: function (event) {
      let var_hash = "4d7bae8f423d87473de20f9026d798e7"
      QuestionRepository.updateQuestion(var_hash, 'Some new label', this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },


    // ANSWER GROUP
    createAnswerGroup: function (event) {
      // this gives us the vogh which we use in the attaching answers to the answer group and the answer group to the question
      // 0 if no, 1 if yes
      let multipleAnswers = 0
      AnswerRepository.postAnswerGroup('Some label', multipleAnswers, 'Some Name', this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    getAnswerGroup: function (event) {
      let var_option_group_hash = "0bf4821d453e00dee8e489101aff78d0"
      AnswerRepository.getAnswerGroup(var_option_group_hash, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    getAnswerGroupAnswers: function (event) {
      let var_option_group_hash = "0bf4821d453e00dee8e489101aff78d0"
      AnswerRepository.getAnswerGroupAnswers(var_option_group_hash, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    createAnswer: function (event) {
      let var_option_group_hash = "0bf4821d453e00dee8e489101aff78d0"
      AnswerRepository.postAnswer('Some label', 1, var_option_group_hash, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    getAnswer: function (event) {
      let var_option_group_hash = "0bf4821d453e00dee8e489101aff78d0"
      let var_option_name = "3b49sqyed"
      AnswerRepository.postAnswer(var_option_group_hash, var_option_name, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    deleteAnswer: function (event) {
      let var_option_group_hash = "0bf4821d453e00dee8e489101aff78d0"
      let var_option_name = "3b49sqyed"
      AnswerRepository.deleteAnswer(var_option_group_hash, var_option_name, this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    },
    updateAnswer: function (event) {
      let var_option_group_hash = "0bf4821d453e00dee8e489101aff78d0"
      let var_option_name = "3b49sqyed"
      AnswerRepository.updateAnswer(var_option_group_hash, var_option_name, 'New label', 2,  this.$store.state.authLogin.token).then((response) => {
        console.log(response)
      });
    }
  }
}
</script>
