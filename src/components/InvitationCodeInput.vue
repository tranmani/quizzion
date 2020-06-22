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
      ref="code"
      @keyup.enter="goToQuizz"
      :class="joinBtn ? 'q-mt-lg' : ''"
      mask="xxxxxxxxxxx"
      v-model="inviteCode"
      v-if="joinBtn"
      :rules="[
        val =>
          (val !== '' && val.length > 9) ||
          'Invitation code must have 10 numbers'
      ]"
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
      ref="code"
      @keyup.enter="goToQuizz"
      :class="joinBtn ? 'q-mt-lg' : ''"
      mask="xxxxxxxxxxx"
      v-model="inviteCode"
      v-if="!joinBtn"
      :rules="[val => (val !== '' && val.length > 9) || '']"
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
      roomTitle: "",
      openSocket: false,
      socket: null,
      userHash: "",
      userToken: "",
      userName: "",
      userAvatarUrl: "",
      frmHash: ""
    };
  },
  computed: {
    ...mapGetters("authLogin", ["token"])
  },
  mounted() {
    this.socket = io("http://3.212.180.89:3000", {
      autoConnect: false
    });
    this.socket.on("join_room_response", response => {
      if (!response.user) {
        this.errorDialog(response.error);
      } else {
        this.roomTitle = response.quiz.title;
        this.formHash = response.quiz.formHash;

        console.log("WHOLE RESPONSE", response);
        // check if already logged in
        if (this.token == null) {
          this.enterName(response.user.userHash);
        } else {
          // TODO: wait for user info to save in session so we don't have to get user data
          this.getUser(this.token, response.user.userHash);
          this.userName = response.user.username;
        }
        this.userHash = response.user.userHash;
        this.userToken = response.user.accessToken;
        this.userAvatarUrl = response.user.avatarUrl;
        this.frmHash = response.quiz.formHash;
        console.log("User Hash: " + this.userHash);
        console.log("User Token: " + this.userToken);
        console.log("User Name: " + this.userName);
        console.log("User Avatar: " + this.userAvatarUrl);
        console.log("Form Hash: " + this.frmHash);
      }
    });

    this.socket.on("add_username_response", response => {
      if (response.error) {
        this.errorDialog(response.error);
      } else {
        if (this.token == null) {
          this.$store.dispatch("waitingRoom/setTitle", {
            title: this.roomTitle
          });
          this.$store.dispatch("waitingRoom/setFormHash", {
            formHash: this.formHash
          });
          this.$store.dispatch("waitingRoom/setInvitationCode", {
            invitationCode: null
          });

          this.$router.push({
            name: "guestwaitingroom",
            params: {
              socket: this.socket,
              hash: this.userHash,
              tkn: this.userToken,
              usrname: this.userName,
              avatarUrl: this.userAvatarUrl,
              frmHash: this.frmHash
            }
          });
        } else {
          this.$store.dispatch("waitingRoom/setTitle", {
            title: this.roomTitle
          });
          this.$store.dispatch("waitingRoom/setFormHash", {
            formHash: this.formHash
          });
          this.$store.dispatch("waitingRoom/setInvitationCode", {
            invitationCode: this.inviteCode
          });

          this.$router.push({
            name: "waitingroom",
            params: {
              socket: this.socket
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
        this.socket.open();
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
            isValid: val => val.length > 1,
            type: "text"
          },
          cancel: true,
          persistent: true
        })
        .onOk(data => {
          this.userName = data;
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
.join-btn {
  color: #ffffff;
  background-color: $accent;
  width: 75px;
}
</style>
