<template>
  <q-page class="flex flex-center"></q-page>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Logout",
  mounted: function() {
    this.logout();
    this.emptyQuizzesForLogout();

    this.$router.push({ path: "/signin" });
  },
  methods: {
    ...mapActions("quizzes", ["emptyQuizzesForLogout"]),
    ...mapActions("authLogin", ["logout"])
  }
};
</script>

<style scoped>
</style>