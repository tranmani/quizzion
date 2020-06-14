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
      mask="xxxxxxxxx"
      v-model="inviteCode"
      v-if="joinBtn"
      :rules="[ val => val !== '' && val.length == 9|| 'Invitation code must have 9 numbers']"
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
      mask="xxxxxxxxx"
      v-model="inviteCode"
      v-if="!joinBtn"
      :rules="[ val => val !== '' && val.length == 9|| '']"
    >
      <template v-slot:prepend>
        <q-icon name="code" />
      </template>
      <template v-slot:append>
        <q-btn icon="arrow_right_alt" dense flat rounded @click="goToQuizz" />
      </template>
    </q-input>
    <div v-if="joinBtn" class="row justify-center">
      <q-btn v-if="disabledBtn" disable rounded class="col-12 q-ma-md join-btn">Join</q-btn>
      <q-btn v-if="!disabledBtn" @click="goToQuizz" rounded class="col-12 q-ma-md join-btn">Join</q-btn>
    </div>
  </div>
</template>

<script>
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
      disabledBtn: true
    };
  },
  methods: {
    goToQuizz() {
      if (!this.disabledBtn) {
        this.$router.push({
          path: "/completequiz" /*'/quiz/' + this.inviteCode*/
        });
      }
    }
  },
  watch: {
    inviteCode: function(newState, oldState) {
      if (newState.length != 9) {
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