<template>
  <q-page>
    <div class="bg" />
    <section class="section-container items-center">
      <div class="section-header shadow-3">
        <q-tabs v-model="tab" active-bg-color="secondary" indicator-color="transparent">
          <q-tab class="q-tabs" name="signin" label="Sign in" />
        </q-tabs>
        <q-tab-panels v-model="tab">
          <q-tab-panel name="signin">
            <div class="section-body column items-center">
              <section>
                <h6>Username:</h6>
                <q-input
                  outlined
                  dense
                  autofocus
                  v-model="credentials.username"
                  @keyup.enter="
                    hashPassword();
                    login();"
                  bg-color="grey-4"
                  placeholder="Username..."
                />
                <q-separator />
                <h6>Password:</h6>
                <q-input
                  outlined
                  dense
                  v-model="password"
                  @keyup.enter="
                    hashPassword();
                    login();"
                  bg-color="grey-4"
                  placeholder="Password..."
                  :type="isPwd ? 'password' : 'text'"
                  ref="signin"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
                <div class="text-body">
                  Apply for an account?
                  <a href>Click here!</a>
                </div>
              </section>
              <section class="row justify-center">
                <q-btn
                  :disabled="disabledSignInBtn"
                  @click="
                    hashPassword();
                    login();
                  "
                  rounded
                  class="col-12 q-ma-md sign-btn"
                >Sign in</q-btn>
              </section>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </section>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import md5 from "md5";
export default {
  data() {
    return {
      tab: "signin",
      credentials: {
        username: "quizzion_user1",
        password: ""
      },
      password: "Welkom12345!",
      isPwd: true,
      disabledSignInBtn: true
    };
  },

  methods: {
    ...mapActions({
      signIn: "authLogin/signIn",
      attemptAvatar: "authLogin/attemptAvatar"
    }),

    login() {
      // this call prevents all the quizzes from getting loaded or the problem may be in getting the templates (content mismatch problem)
      // TODO figure out hot to resolve it
      this.signIn(this.credentials).then(() => {
        if (this.$store.state.authLogin.token != null) {
          this.$router.push({ path: "/dashboard" });

          const random = Math.floor(Math.random() * 100);
          this.attemptAvatar(`https://api.adorable.io/avatar/72/${random}`);
        } else {
          console.log("Sign in error: No token after sign in");
        }
      });
    },

    hashPassword: function() {
      this.credentials.password = md5(this.password);
    }
  },
  computed: {
    usernameAndPassword() {
      return `${this.credentials.username}|${this.password}`;
    }
  },
  watch: {
    usernameAndPassword: function(newState, oldState) {
      const [oldUsername, oldPassword] = oldState.split("|");
      const [newUsername, newPassword] = newState.split("|");
      if (newUsername.length < 4) {
        this.disabledSignInBtn = true;
      } else if (newPassword.length < 4) {
        this.disabledSignInBtn = true;
      } else {
        this.disabledSignInBtn = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bg {
  background-image: url("../assets/bg.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(4px);
  left: -5px;
  top: -5px;
  bottom: -5px;
  right: -5px;
  margin: -5px;
  position: fixed;
}

.section-container {
  position: absolute;
  background-color: #ffffff;
  max-width: 30%;
  width: 100%;
  height: 100%;
}

.section-header {
  width: 100%;
  background-color: #ffffff;
  color: #ffffff;
  height: 100%;
}

.panel-height {
  height: 100%;
}

h6 {
  margin: 0px;
  padding: 18px 0 0 0;
  text-align: left;
  color: $secondary;
}

.text-body {
  font-size: 0.8rem;
  color: black;
}

a {
  color: $secondary;
}

.section-body {
  align-content: center;
  height: 100%;
}

.sign-btn {
  color: #ffffff;
  background-color: $accent;
}

@media (max-width: 1920px) {
  .section-container {
    max-width: 30%;
  }
}

@media (max-width: 1500px) {
  .section-container {
    max-width: 40%;
  }
}

@media (max-width: 1000px) {
  .section-container {
    max-width: 60%;
  }
}

@media (max-width: 600px) {
  .section-container {
    max-width: 100%;
  }
}

@media only screen and (max-width: 600px) {
  .section-container {
    position: absolute;
    background-color: #ffffff;
    width: 100%;
  }

  .section-header {
    width: 100%;
    color: #ffffff;
    height: 100%;
  }

  .panel-height {
    height: 70vh;
  }

  .section-body {
    height: 100%;
  }

  .q-tabs {
    width: 100%;
  }

  .sign-btn {
    color: #ffffff;
    background-color: $accent;
    margin-top: 25vh;
  }
}
</style>
