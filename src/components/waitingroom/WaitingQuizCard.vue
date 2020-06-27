<template>
  <q-card class="q-mt-lg q-mb-lg">
    <q-card-section>
      <div class="text-h5">{{ title }}</div>
    </q-card-section>

    <q-card-section>
      <div
        class="loading-title row justify-center"
        :class="thumbnail ? 'loading-title-thumbnail' : ''"
      >
        <q-img
          v-if="thumbnail"
          :src="thumbnail"
          style="max-height: 50%; height: auto; width: 100%"
          class="q-mb-md"
        />
        <div>Waiting for participants...</div>
      </div>
      <div class="loading">
        <div class="row justify-center">
          <q-spinner class="row justify-center" :showing="true" size="55px" color="secondary" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: ["title", "thumbnail"]
};
</script>

<style scoped>
.loading-title {
  margin-top: 32px;
  font-size: 18px;
  font-weight: bold;
  color: gray;
}
.loading-title-thumbnail {
  margin-top: 0;
}
.loading {
  margin-top: 24px;
  margin-bottom: 32px;
}
.text-h5 {
  font-weight: bold;
}
</style>
