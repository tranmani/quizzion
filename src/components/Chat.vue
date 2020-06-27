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
        @click="toggleChatWindow()"
      >Chat</q-btn>
      <div class="toggleable" v-bind:style="[toggled ? {display: 'block'} : {display: 'none'}]">
        <q-scroll-area
          :thumb-style="{ right: '-0.5rem', borderRadius: '0.5rem', background: '#aaa', width: '0.5rem', opacity: 1 }"
          :bar-style="{ right: '-0.5rem', borderRadius: '0.5rem', background: '#ddd', width: '0.5rem', opacity: 1 }"
          class="message-container"
          ref="chatArea"
        >
          <q-chat-message
            v-for="(msg, index) in messages"
            :key="index"
            :name="msg.sender.username"
            :bg-color="msg.sender.isModerator ? 'blue' : ''"
            :text-color="msg.sender.isModerator ? 'white' : ''"
            :avatar="msg.sender.associatedAvatar"
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
  min-width: 300px;
}
.comment-input {
  box-shadow: 0 -0.1rem 0.1rem -0.1rem #aaa;
  width: 300px;
  background-color: ghostwhite;
}
.chat-container {
  border: 0.1rem solid #aaa;
  position: fixed;
  left: 0px;
  bottom: 0%;
  background-color: white;
}
.message-container {
  margin-left: 10px;
  margin-right: 10px;
  height: 15rem;
  min-width: 280px;
}
.q-field--with-bottom {
  padding-bottom: 0px;
}
.q-field__control {
  color: #333;
}
@media only screen and (max-width: 600px) {
  .toggle-btn {
    min-width: 300px;
  }
  .chat-container {
    border: 0.1rem solid #aaa;
    position: fixed;
    left: 0%;
    bottom: 0%;
  }
  .message-container {
    margin-left: 5px;
    margin-right: 5px;
    height: 10rem;
    min-width: 290px;
  }
}
</style>

<script>
export default {
  data() {
    return {
      comment: "",
      typing: false,
      toggled: false
    };
  },
  props: ["sender", "messages", "scroll"],
  methods: {
    addComment() {
      this.scrollDown();

      this.$emit("newChat", {
        sender: this.sender,
        text: this.comment
      });

      this.comment = "";
    },
    toggleChatWindow() {
      this.toggled = !this.toggled;
    },
    scrollDown() {
      this.$refs.chatArea.setScrollPosition(
        this.$refs.chatArea.scrollSize,
        this.$refs.chatArea.scrollSize
      );
      this.$emit("scrollDone");
    }
  },
  watch: {
    scroll(newState, oldState) {
      if (newState) this.scrollDown();
    }
  }
};
</script>
