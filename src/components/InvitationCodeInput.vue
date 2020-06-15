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
      class="code-input q-mt-lg"
      ref="code"
      @keyup.enter="goToQuizz"
      mask="xxxxxxxxxxx"
      v-model="inviteCode"
      :rules="[ val => val !== '' && val.length == 11|| 'Invitation code must have 11 characters']"
    >
      <template v-slot:prepend>
        <q-icon name="code" />
      </template>
    </q-input>

    <div class="row justify-center">
      <q-btn v-if="disabledBtn" disable rounded class="col-12 q-ma-md join-btn">Join</q-btn>
      <q-btn v-if="!disabledBtn" @click="goToQuizz" rounded class="col-12 q-ma-md join-btn">Join</q-btn>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "InvitationCodeInput",
  props: {},
  data() {
    return {
      inviteCode: "",
      disabledBtn: true,
      socket: {}
    };
  },
  created() {
    this.socket = io("http://localhost:3000");

    this.socket.on("join_room_response", response => {
      console.log(response);

      if (!response.user) {
        this.InvalidCode(response.error);
      } else {
        this.$router.push({
          name: "waitingroom",
          params: {
            inviteCode: this.inviteCode,
            socket: this.socket
          }
        });
      }
    });
  },
  methods: {
    goToQuizz() {
      if (!this.disabledBtn) {
        this.socket.emit("joinRoomRequest", { code: this.inviteCode });
      }
    },
    InvalidCode(error) {
      this.$q.dialog({
        title: "Invalid Code",
        message: error,
        cancel: false
      });
    }
  },
  watch: {
    inviteCode(newState, oldState) {
      if (newState.length !== 11) {
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