<template>
  <div class="q-ma-md col-auto">
    <q-card style="width: 200px">
      <q-skeleton height="50px" square />
      <q-item>
        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" height="23px" />
          </q-item-label>
          <div class="row">
            <q-skeleton class="float-left col-3" height="17px" type="text" />
            <div class="col"></div>
            <q-skeleton class="float-right col-3" height="17px" type="text" />
          </div>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "CreatedSkeleton"
};
</script>

<style lang="scss" scoped>
</style>