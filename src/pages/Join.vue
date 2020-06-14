<template>
  <q-page class="flex flex-center">
    <div class="bg"></div>
    <section class="section-container justify-center">
      <div class="section-header shadow-3">
          <h5>Invitation code</h5>
      </div>
      <div class="section-body column items-center">
        <InvitationCodeInput />
      </div>
    </section>
  </q-page>
</template>

<script>
import InvitationCodeInput from '../components/InvitationCodeInput'
  export default {
    components: {
      InvitationCodeInput
    }
  }
</script>

<style lang="scss" scoped>
.bg {
  background-image: url("../assets/bg.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(4px);
  left: -5px;
  top:-5px;
  bottom:-5px;
  right: -5px;
  margin:-5px;
  position: fixed;
}

.section-container {
  position: absolute;
  background-color: #ffffff;
  max-width: 30%;
  width: 100%;
  height: 230px;
  border-radius: $guest-page-border-radius;
  overflow: hidden;
}

.section-header {
  border-top-left-radius: $guest-page-border-radius;
  border-top-right-radius: $guest-page-border-radius;
  width: 100%;
  height: 70px;
  background-color: $secondary;
}

h5 {
  font-weight: bold;
  margin: 0px;
  padding: 18px 0 0 0;
  text-align: center;
  color: #ffffff;
}

@media (max-width: 1920px) {
  .section-container {
    max-width: 30%;
  }
}

@media (max-width: 1500px) {
  .section-container {
    max-width: 40%;
  }
}

@media (max-width: 1000px) {
  .section-container {
    max-width: 60%;
  }
}

@media (max-width: 600px) {
  .section-container {
    max-width: 80%;
  }
}
</style>