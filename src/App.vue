<template>
  
  <div id="q-app">
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <router-view />
  </div>
</template>

<script>
import store from './store/index';
export default {
  store: store,
  name: 'App'
}
</script>
