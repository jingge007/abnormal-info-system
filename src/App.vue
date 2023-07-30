<template>
  <div id="app">
    <router-view></router-view>
    <BackTop :height="400" :bottom="100"></BackTop>
  </div>
</template>

<script>

export default {
  name: 'App'
};
</script>
