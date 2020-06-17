<template>
  <div class="subheader">
    <q-toolbar>
      <div class="input">
        <InvitationCodeInput :joinBtn="false" />
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
        <transition name="fade">
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
        </transition>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import io from "socket.io-client";
import InvitationCodeInput from "./InvitationCodeInput";

export default {
  components: {
    InvitationCodeInput
  },
  data() {
    return {
      socket: {},
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
  computed: {
    ...mapGetters("quizzes", ["sortState"])
  },
  mounted() {
    this.menuList[1].sortTypes.forEach(element => {
      if (element.sort == this.sortState) {
        element.active = true;
        return;
      }
    });
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
    }
  }
};
</script>

<style lang="scss" scoped>
.input {
  padding: 0.5rem;
}

.subheader {
  background-color: $secondary;
  position: absolute;
  top: 0;
  height: 3.5rem;
  width: 100%;
  left: 0;
  right: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
