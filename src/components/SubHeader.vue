<template>
  <div class="subheader">
    <q-toolbar>
      <div class="input">
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
          mask="xxxxxxxxxxx"
          v-model="inviteCode"
          :rules="[ val => val !== '' && val.length == 11|| '']"
        >
          <template v-slot:append>
            <q-btn
              :disabled="disabledBtn"
              class="btn"
              icon="code"
              color="grey"
              size="s"
              @click="goToQuizz"
              dense
              rounded
            />
          </template>
        </q-input>
      </div>
      <q-space />
      <q-btn
        color="white"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="drawer = !drawer"
      />
    </q-toolbar>
    <q-drawer v-model="drawer" show-if-above bordered content-class="bg-grey-1">
      <q-scroll-area class="fit">
        <q-list v-for="(menuItem, index) in menuList" :key="index">
          <q-item
            clickable
            v-ripple.early
            v-if="menuItem.page"
            @click="$router.push({ path: menuItem.page });"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>{{ menuItem.label }}</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple.early
            v-else-if="menuItem.sortTypes"
            @click="sortItemList = !sortItemList"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>{{ menuItem.label }}</q-item-section>
          </q-item>

          <q-separator v-if="menuItem.separator" />
        </q-list>

        <q-list dense v-if="sortItemList">
          <q-item
            clickable
            v-ripple.early
            v-for="(sortType, index) in menuList[1].sortTypes"
            :key="index"
            :active="sortType.active"
            @click="$emit('sort', sortType.sort), setSortState(sortType.sort), clearActiveState(), sortType.active = true"
          >
            <q-item-section avatar>
              <q-icon name="sort" />
            </q-item-section>
            <q-item-section>{{ sortType.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import io from "socket.io-client";

export default {
  data() {
    return {
      socket: {},
      inviteCode: "",
      disabledBtn: true,
      drawer: false,
      sortItemList: false,
      active: true,
      menuList: [
        {
          icon: "create",
          label: "Create",
          separator: true,
          page: "quiz"
        },
        {
          icon: "filter_list",
          label: "Sort quizzes",
          separator: true,
          sortTypes: [
            {
              label: "Default",
              sort: "default",
              active: false
            },
            {
              label: "Highest play times",
              sort: "playTimesDes",
              active: false
            },
            {
              label: "Lowest play times",
              sort: "playTimesAsc",
              active: false
            },
            {
              label: "Highest average pass",
              sort: "averagePassDes",
              active: false
            },
            {
              label: "Lowest average pass",
              sort: "averagePassAsc",
              active: false
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.socket = io("http://localhost:3000");

    this.menuList[1].sortTypes.forEach(element => {
      if (element.sort === this.sortState) element.active = true;
    });

    this.socket.on("join_room_response", response => {
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
  computed: {
    ...mapGetters("quizzes", ["sortState"])
  },
  methods: {
    ...mapActions("quizzes", ["setSortState"]),
    goToQuizz() {
      if (!this.disabledBtn) {
        this.socket.emit("joinRoomRequest", { code: this.inviteCode });
      }
    },
    clearActiveState() {
      this.menuList[1].sortTypes.forEach(element => {
        element.active = false;
      });
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
    inviteCode: function(newState, oldState) {
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
.input {
  padding: 0.5rem;
}

.subheader {
  background-color: #ff7e21;
  position: absolute;
  top: 0;
  height: 3.5rem;
  width: 100%;
  left: 0;
  right: 0;
}
</style>
