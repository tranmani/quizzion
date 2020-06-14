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
          mask="xxxxxxxxx"
          v-model="inviteCode"
          :rules="[ val => val !== '' && val.length == 9|| '']"
        >
          <template v-slot:append>
            <q-btn
              :disabled="disabledBtn"
              class="btn"
              icon="code"
              color="grey"
              size="s"
              to="/completequiz"
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
export default {
  data() {
    return {
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
    this.menuList[1].sortTypes.forEach(element => {
      if (element.sort === this.sortState) element.active = true;
    });
  },
  computed: {
    ...mapGetters("quizzes", ["sortState"])
  },
  methods: {
    ...mapActions("quizzes", ["setSortState"]),
    goToQuizz() {
      if (!this.disabledBtn) {
        this.$router.push({ path: "/quiz/" + this.inviteCode });
      }
    },
    clearActiveState() {
      this.menuList[1].sortTypes.forEach(element => {
        element.active = false;
      });
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
