<template>
  <div class="main-container">
    <span class="title text-h8">Invitation code</span>
    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <span class="col row justify-center code">{{ code }}</span>
        <q-card-actions vertical class="justify-around q-px-md">
          <q-btn
            flat
            round
            size="10px"
            color="grey"
            icon="file_copy"
            v-on:click="copyCodeClicked"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
    <div>
      <q-tooltip v-model="showing">Copied to clipboard!</q-tooltip>
    </div>
  </div>
</template>

<script>
import { copyToClipboard } from "quasar";

export default {
  props: ["code"],
  data() {
    return {
      showing: false
    };
  },
  methods: {
    copyCodeClicked() {
      if (!this.code) {
        return;
      }
      copyToClipboard(this.code)
        .then(() => {
          this.showing = true;
          setTimeout(
            function() {
              this.showing = false;
            }.bind(this),
            1000
          );
        })
        .catch(() => {
          console.log("Failed copy to clipboard");
        });
    }
  }
};
</script>

<style scoped>
.code {
  align-items: center;
  font-weight: bold;
  padding-left: 38px;
  font-size: 16px;
}
.title {
  font-weight: bold;
  color: gray;
}
.my-card {
  margin-top: 8px;
}
.main-container {
  margin-left: 20px;
  margin-top: 32px;
  margin-right: 20px;
}
</style>
