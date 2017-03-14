<template>
<section>
  <div>
    <!-- <img src="./LandingPageView/assets/logo.png" alt="electron-vue"> -->

    <current-page></current-page>
    <!-- <versions></versions> -->
    <!-- <links></links> -->
    <info/>
  </div>
  </section>
</template>

<script>
  import CurrentPage from './LandingPageView/CurrentPage'
  import Links from './LandingPageView/Links'
  import Versions from './LandingPageView/Versions'
  import Info from './LandingPageView/Info'
  export default {
    components: {
      CurrentPage,
      Links,
      Versions,
      Info
    },
    name: 'landing-page'
  }
</script>

<style scoped>
  img {
    margin-top: -25px;
    width: 450px;
  }
</style>
