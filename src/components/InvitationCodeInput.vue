<template>
  <div>
    <q-input
      rounded
      outlined
      dense
      clearable
      lazy-rules
      bg-color="grey-4"
      label="Invite Code..."
      class="code-input"
      ref="code"
      @keyup.enter="goToQuizz"
      :class="joinBtn ? 'q-mt-lg' : ''"
      mask="xxxxxxxxxxx"
      v-model="inviteCode"
      v-if="joinBtn"
      :rules="[ val => val !== '' && val.length > 9|| 'Invitation code must have 10 numbers']"
    >
      <template v-slot:prepend>
        <q-icon name="code" />
      </template>
    </q-input>

    <q-input
      rounded
      outlined
      dense
      lazy-rules
      bg-color="grey-4"
      label="Invite Code..."
      class="code-input"
      ref="code"
      @keyup.enter="goToQuizz"
      :class="joinBtn ? 'q-mt-lg' : ''"
      mask="xxxxxxxxxxx"
      v-model="inviteCode"
      v-if="!joinBtn"
      :rules="[ val => val !== '' && val.length > 9|| '']"
    >
      <template v-slot:prepend>
        <q-icon name="code" />
      </template>
      <template v-slot:append>
        <q-btn :disable="disabledBtn" icon="arrow_right_alt" dense flat rounded @click="goToQuizz" />
      </template>
    </q-input>

    <div v-if="joinBtn" class="row justify-center">
      <q-btn :disable="disabledBtn" rounded @click="goToQuizz" class="col-12 q-ma-md join-btn">Join</q-btn>
    </div>
  </div>
</template>

<script>
import Authenticator from "../remote/user/Authenticator";
import { mapGetters, mapActions } from "vuex";
import io from "socket.io-client";

export default {
  name: "InvitationCodeInput",
  props: {
    joinBtn: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      inviteCode: "",
      disabledBtn: true,
      socket: {},
      roomTitle: ""
    };
  },
  computed: {
    ...mapGetters("authLogin", ["user", "token"])
  },
  mounted() {
    this.socket = io("http://localhost:3000");

    this.socket.on("join_room_response", response => {
      if (!response.user) {
        this.errorDialog(response.error);
      } else {
        this.roomTitle = response.quiz.title;
        // check if already logged in
        if (this.token == null) {
          this.enterName(response.user.userHash);
        } else {
          // TODO: wait for user info to save in session so we don't have to get user data
          this.getUser(this.token, response.user.userHash);
        }
      }
    });

    this.socket.on("add_username_response", response => {
      if (response.error) {
        this.errorDialog(response.error);
      } else {
        if (this.token == null) {
          this.$router.push({
            name: "guestwaitingroom",
            params: {
              inviteCode: this.inviteCode,
              socket: this.socket,
              title: this.roomTitle
            }
          });
        } else {
          this.$router.push({
            name: "waitingroom",
            params: {
              inviteCode: this.inviteCode,
              socket: this.socket,
              title: this.roomTitle
            }
          });
        }
      }
    });
  },
  methods: {
    ...mapActions("authLogin", ["attemptUser", "attemptToken"]),
    goToQuizz() {
      if (!this.disabledBtn) {
        this.socket.emit("joinRoomRequest", { code: this.inviteCode });
      }
    },
    errorDialog(error) {
      this.$q.dialog({
        title: "Error",
        message: error,
        cancel: false
      });
    },
    enterName(uh) {
      this.$q
        .dialog({
          title: "Enter your name",
          message: "Your name you wanted to use",
          prompt: {
            model: "",
            isValid: val => val.length > 2,
            type: "text"
          },
          cancel: true,
          persistent: true
        })
        .onOk(data => {
          this.socket.emit("add_username_request", {
            userHash: uh,
            username: data
          });
        });
    },
    getUser(token, uh) {
      Authenticator.getUserByToken(token)
        .then(response => {
          this.attemptUser(response.data.user);
          this.socket.emit("add_username_request", {
            userHash: uh,
            username: response.data.user.username
          });
        })
        .catch(error => {
          this.$q.notify({
            icon: "error",
            color: "negative",
            message: "Failed to get user data"
          });
        });
    }
  },
  watch: {
    inviteCode(newState, oldState) {
      if (newState.length < 10) {
        this.disabledBtn = true;
      } else {
        this.disabledBtn = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.section-body {
  align-content: center;
}

.join-btn {
  color: #ffffff;
  background-color: $accent;
  width: 75px;
}
</style>