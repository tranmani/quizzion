<template>
  <q-card flat bordered class="my-card">
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img v-bind:src="avatarUrl" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="label">{{ username }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script>
export default {
  props: ["username", "avatarUrl"]
};
</script>
<style scoped>
.label {
  font-weight: bold;
}
</style>
