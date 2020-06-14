<template>
  <div>
    <q-item>
      <q-item-section avatar>
        <q-skeleton type="circle" size="120px" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton width="170px" height="35px" />
        </q-item-label>
        <q-item-label>
          <q-skeleton width="170px" />
        </q-item-label>
        <q-item-label>
          <q-skeleton width="170px" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  name: "ProfileSkeleton"
};
</script>

<style lang="scss" scoped>
</style>