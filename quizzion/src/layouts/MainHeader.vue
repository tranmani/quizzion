<template>
<div>
  <div class="gt-sm">
    <q-layout view="hHh LpR lfr">
      <q-header elevated class="row justify-center text-grey bg-white">
        <q-toolbar>
          <q-toolbar-title class="title">
            Quizzi<span style="color: #F2994A">O</span>n 2.0
          </q-toolbar-title>

          <q-tabs
            shrink
            stretch
            class="text-#828282"
            active-color="primary"
            indicator-color="primary"
            v-if="typeof this.$store.state.authLogin == 'undefined' || this.$store.state.authLogin.token == null"
          >
            <q-route-tab to="join" label="Join" />
            <q-route-tab to="signin" label="Sign in" />
          </q-tabs>
          <q-tabs
            shrink
            stretch
            class="text-#828282"
            active-color="primary"
            indicator-color="primary"
            v-else
          >
            <q-route-tab to="dashboard" label="Dashboard" />
            <q-route-tab to="profile" label="Profile" />
            <q-route-tab to="logout" label="Log out" />
          </q-tabs>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>

  <div class="lt-sm">
    <q-layout view="hHh LpR lfr">
      <q-header elevated class="row justify-center text-grey bg-white">
        <q-toolbar>
          <q-toolbar-title class="title text-center">
            Quizzi<span style="color: #F2994A">O</span>n 2.0
          </q-toolbar-title>
          </q-toolbar>
          <q-toolbar >
          <q-tabs
            class="text-#828282; q-tabs-phone"
            active-color="primary"
            indicator-color="primary"

            v-if="typeof this.$store.state.authLogin == 'undefined' || this.$store.state.authLogin.token == null"
          >
            <q-route-tab to="join" label="Join" />
            <q-route-tab to="signin" label="Sign in" />
          </q-tabs>
          <q-tabs
            class="text-#828282; q-tabs-phone"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            v-else
          >
            <q-route-tab to="dashboard" label="Dashboard" />
            <q-route-tab to="profile" label="Profile" />
            <q-route-tab to="logout" label="Log out" />
          </q-tabs>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>

  <div class="sm">
    <q-layout view="hHh LpR lfr">
      <q-header elevated class="row justify-center text-grey bg-white">
        <q-toolbar>
          <q-toolbar-title class="title">
            Quizzi<span style="color: #F2994A">O</span>n 2.0
          </q-toolbar-title>

          <q-tabs
            shrink
            stretch
            class="text-#828282"
            active-color="primary"
            indicator-color="primary"
            v-if="typeof this.$store.state.authLogin == 'undefined' || this.$store.state.authLogin.token == null"
          >
            <q-route-tab to="join" label="Join" />
            <q-route-tab to="signin" label="Sign in" />
          </q-tabs>
          <q-tabs
            shrink
            stretch
            class="text-#828282"
            active-color="primary"
            indicator-color="primary"
            v-else
          >
            <q-route-tab to="dashboard" label="Dashboard" />
            <q-route-tab to="profile" label="Profile" />
            <q-route-tab to="logout" label="Log out" />
          </q-tabs>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</div>
</template>

<script>
export default {
  meta: {
    title: "Quizzion 2.0"
  },

  data() {
    return {
      loggedIn: this.$store.state.authLogin.token == null || typeof this.$store.state.authLogin == 'undefined' ? false : true
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  position: relative;

  font-family: "righteous";
  font-style: normal;
  font-weight: normal;
  font-size: 3rem;
  line-height: 3rem;

  color: #000000;
}

.q-tabs-phone {
  width: 100%;
}
</style>
