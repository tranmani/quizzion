<template>
  <q-page class="flex flex-center">
      <chat-component :chatter="us" :uh="uh"></chat-component>
  </q-page>
</template>

<script>
import UserRepository from '../remote/user/UserRepository';
import ChatComponent from '../components/Chat';

export default {
  name: 'ChatPage',
  components: {
      ChatComponent
  },
  data () {
    return {
        us: {
            uh: "45a6e9be215c8e41ffb8840b5e9491ce",
            username: "our-username",
            associatedAvatarId: "3",
            isModerator: false,
            isUs: true
        },
        uh: "45a6e9be215c8e41ffb8840b5e9491ce"
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>
