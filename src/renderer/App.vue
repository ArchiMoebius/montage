<template>
  <div id="app">
    <navigation-bar></navigation-bar>
  </div>
</template>

<script>
  import NavigationBar from './components/NavigationBar.vue';

  export default {
    name: 'Montage',
    components: {
      NavigationBar
    }
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

  body { font-family: 'Roboto', sans-serif; }
</style>
