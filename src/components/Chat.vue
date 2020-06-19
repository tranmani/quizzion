<template>
  <div class="q-pa-md row">
    <div class="chat-container">
      <q-btn
        square
        outlined
        dense
        lazy-rules
        class="toggle-btn full-width"
        bg-color="#333"
        ref="toggleChat"
        :ripple="false"
        @click="toggleChatWindow"
      >Chat</q-btn>
      <div class="toggleable" v-bind:style="[toggled ? {display: 'block'} : {display: 'none'}]">
        <q-scroll-area
          :thumb-style="{ right: '-1.5rem', borderRadius: '0.5rem', background: '#aaa', width: '0.5rem', opacity: 1 }"
          :bar-style="{ right: '-1.5rem', borderRadius: '0.5rem', background: '#ddd', width: '0.5rem', opacity: 1 }"
          class="message-container"
          ref="chatArea"
        >
          <q-chat-message
            v-for="(msg, index) in messages"
            :key="index"
            :name="msg.sender.username"
            :bg-color="msg.sender.isModerator ? 'blue' : ''"
            :text-color="msg.sender.isModerator ? 'white' : ''"
            :avatar="'http://api.adorable.io/avatar/'+msg.sender.associatedAvatarId"
            :text="[msg.text]"
            :sent="msg.sender.isUs ? true : false"
          />
          <!--
                    why doesn't it work inside the attribute
                    :sent="msg.sender.uh == this.chatter.uh ? true : false"
          -->
        </q-scroll-area>

        <q-input
          square
          outlined
          dense
          lazy-rules
          bg-color="#333"
          label="Comment"
          class="comment-input"
          ref="comm"
          type="text"
          @keyup.enter="addComment"
          v-model="comment"
          :rules="[ val => val.length < 100]"
        >
          <template v-slot:append>
            <q-btn
              :disable="comment.length == 0"
              icon="send"
              dense
              flat
              rounded
              @click="addComment"
            />
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toggle-btn {
  min-width: 17.5rem;
}
.comment-input {
  box-shadow: 0 -0.1rem 0.1rem -0.1rem #aaa;
  width: 100%;
}
.chat-container {
  border: 0.1rem solid #aaa;
  position: fixed;
  left: 25%;
  bottom: 0%;
}
.message-container {
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  height: 15rem;
  min-width: 15rem;
}
.q-field--with-bottom {
  padding-bottom: 0px;
}
.q-field__control {
  color: #333;
}
@media only screen and (max-width: 600px) {
  .toggle-btn {
    min-width: 100vw;
  }
  .chat-container {
    border: 0.1rem solid #aaa;
    position: fixed;
    left: 0%;
    bottom: 0%;
  }
  .message-container {
    margin-left: 1vw;
    margin-right: 1vw;
    height: 10rem;
    min-width: 98vw;
  }
}
</style>

<script>
export default {
  data() {
    return {
      comment: "",
      typing: false,
      us: null,
      toggled: false,
      messages: [
        {
          sender: {
            uh: "67e855038d8a5dc9662b863679fcbdbe",
            username: "random-guest",
            associatedAvatarId: 2,
            isModerator: false,
            isUs: false
          },
          text: "yo guest here"
        },
        {
          sender: {
            uh: "7c580508c0e26ecac801ee4a42da6204",
            username: "quizzion_user1",
            associatedAvatarId: 1,
            isModerator: true,
            isUs: false
          },
          text: "im moderator"
        },
        {
          sender: {
            uh: "67e855038d8a5dc9662b863679fcbdbe",
            username: "random-guest",
            associatedAvatarId: 2,
            isModerator: false,
            isUs: false
          },
          text: "im guest participant"
        },
        {
          sender: {
            uh: "45a6e9be215c8e41ffb8840b5e9491ce",
            username: "our-username",
            associatedAvatarId: "3",
            isModerator: false,
            isUs: true
          },
          text: "a past message from me"
        }
      ]
    };
  },
  mounted() {},
  props: ["chatter", "uh"],
  methods: {
    addComment() {
      this.messages.push({
        sender: this.chatter,
        text: this.comment
      });
      this.$refs.chatArea.setScrollPosition(
        this.$refs.chatArea.scrollSize,
        this.$refs.chatArea.scrollSize
      );
      console.log(this.$refs.chatArea.scrollSize);
      this.comment = "";
    },
    toggleChatWindow() {
      this.toggled = !this.toggled;
    }
  }
};
</script>
