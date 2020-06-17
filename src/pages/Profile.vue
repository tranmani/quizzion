<template>
  <q-page class="bg-grey-6 column">
    <div class="container">
      <ProfileSkeleton v-if="!loaded" class="flex column section center" />

      <div v-if="loaded" class="flex column section center">
        <div class="row info">
          <q-icon name="person_outline" size="150px" class="col-xs-12 col-sm-4" />
          <div class="column justify-center col-xs-12 col-sm-8">
            <div class="row">
              <h5>{{ user.username }}</h5>

              <q-icon
                name="create"
                size="40px"
                @click="isEditing = !isEditing, copyProfile()"
                class="cursor-pointer"
              />
            </div>

            <p>{{ user.firstname + ' ' + user.lastname }}</p>
            <p>{{ user.email }}</p>
          </div>
        </div>

        <div class="column form">
          <transition name="fade">
            <div v-if="isEditing" class="q-gutter-sm">
              <div class="row q-pb-md" style="overflow: hidden">
                <q-input
                  class="col-6 q-pr-md"
                  lazy-rules
                  filled
                  autofocus
                  ref="firstname"
                  v-model="editProfile.firstname"
                  label="First name"
                  :error="!isFirstNameValid"
                  error-message="First name must be between 2 - 15 characters and not contains number"
                />
                <q-input
                  class="col-6 q-pl-md"
                  lazy-rules
                  filled
                  ref="lastname"
                  v-model="editProfile.lastname"
                  label="Last name"
                  :error="!isLastNameValid"
                  error-message="Last name must be between 2 - 15 characters and not contains number"
                />
              </div>

              <q-input
                lazy-rules
                filled
                ref="email"
                v-model="editProfile.email"
                type="email"
                label="Your New Email"
                :error="!isEmailValid"
                error-message="Please use valid email address"
              />

              <div class="flex flex-center">
                <q-btn v-if="disableBtn" disable label="Submit" color="primary" />
                <q-btn
                  v-if="!disableBtn"
                  label="Submit"
                  color="primary"
                  :loading="submitting"
                  @click="onSubmit"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ProfileSkeleton from "../components/ProfileSkeleton";
import UserRepository from "../remote/user/UserRepository";
import Authenticator from "../remote/user/Authenticator";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      isEditing: false,
      submitting: false,
      isFirstNameValid: true,
      isLastNameValid: true,
      isEmailValid: true,
      disableBtn: false,
      loaded: false,
      editProfile: {
        username: "",
        firstname: "",
        lastname: "",
        email: ""
      }
    };
  },
  components: {
    ProfileSkeleton
  },
  computed: {
    ...mapGetters("authLogin", ["user", "token"])
  },
  mounted() {
    if (this.token !== null) {
      if (Object.keys(this.user).length === 0) {
        this.getUser(this.token);
      } else {
        this.copyProfile();
        this.loaded = true;
      }
    } else {
      this.$q.notify({
        icon: "error",
        color: "negative",
        message: "Failed to load user data"
      });
    }
  },
  watch: {
    editProfile: {
      handler(val, oldVal) {
        if (
          val.firstname.length > 1 &&
          val.firstname.length < 16 &&
          val.firstname.match(/^([a-z A-Z])+$/)
        ) {
          this.isFirstNameValid = true;
        } else {
          this.isFirstNameValid = false;
        }
        if (
          val.lastname.length > 1 &&
          val.lastname.length < 16 &&
          val.lastname.match(/^([a-z A-Z])+$/)
        ) {
          this.isLastNameValid = true;
        } else {
          this.isLastNameValid = false;
        }
        if (
          !val.email.match(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        ) {
          this.isEmailValid = false;
        } else {
          this.isEmailValid = true;
        }
        this.validateForm();
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("authLogin", ["attemptUser"]),
    onSubmit() {
      if (!this.disableBtn) {
        this.submitting = true;
        // api call to edit profile here, remember to set this.isEditing and this.submitting to false
        UserRepository.updateUser(this.user.uh, this.editProfile, this.token)
          .then(response => {
            this.isEditing = false;
            this.submitting = false;
            this.attemptUser(this.editProfile);
            this.$q.notify({
              icon: "done",
              color: "positive",
              message: "Profile updated"
            });
          })
          .catch(error => {
            this.$q.notify({
              icon: "error",
              color: "negative",
              message: "Failed to update user data"
            });
            this.submitting = false;
          });
      }
    },
    validateForm() {
      if (
        !this.isEmailValid ||
        !this.isFirstNameValid ||
        !this.isLastNameValid
      ) {
        this.disableBtn = true;
      } else {
        this.disableBtn = false;
      }
    },
    getUser(token) {
      Authenticator.getUserByToken(this.token)
        .then(response => {
          this.attemptUser(response.data.user);
          this.copyProfile();
          this.loaded = true;
        })
        .catch(error => {
          this.$q.notify({
            icon: "error",
            color: "negative",
            message: "Failed to get user data"
          });
        });
    },
    copyProfile() {
      Object.assign(this.editProfile, this.user);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 1em;
  margin: 0 auto;
  max-width: 90%;
  width: 100%;
  height: $height-without-header;
  background-color: #ffffff;
}

.center {
  margin: 0 auto;
}

.section {
  align-items: center;
}

h5 {
  color: $secondary;
  font-weight: 500;
}

h5,
p {
  margin: 0px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1920px) {
  .info,
  .form {
    width: 40%;
  }
}

@media (max-width: 1500px) {
  .info,
  .form {
    width: 50%;
  }
}

@media (max-width: 1000px) {
  .info,
  .form {
    width: 60%;
  }
}

@media (max-width: 600px) {
  .info,
  .form {
    width: 80%;
    margin-top: 2em;
  }
  .container {
    padding-top: 0em;
    height: $height-without-header-mobile;
  }
}
</style>
