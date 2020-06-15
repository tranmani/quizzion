<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h5">{{ title }}</div>
    </q-card-section>

    <q-card-section>
      <div class="loading-title row justify-center">
        <span>Waiting for participants...</span>
      </div>
      <div class="loading">
        <div class="row justify-center">
          <q-spinner
            class="row justify-center"
            :showing="true"
            size="55px"
            color="secondary"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: ["title"]
};
</script>

<style scoped>
.my-card {
  width: 60%;
}
.loading-title {
  margin-top: 32px;
  font-size: 18px;
  font-weight: bold;
  color: gray;
}
.loading {
  margin-top: 24px;
  margin-bottom: 32px;
}
.text-h5 {
  font-weight: bold;
}
</style>
