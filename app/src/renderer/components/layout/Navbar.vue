<template>
  <section class="hero app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
    <div class="hero">
      <nav class="nav">
        <div class="nav-left">
          <a id="icon-padding" class="nav-item is-hidden-mobile" @click="toggleSidebar(!sidebar.opened)">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </a>
        </div>
        <div class="nav-center">
          <a class="nav-item" href="/">
          <img src="./assets/herbivore.svg">
          </a>
        </div>
        <div class="nav-right is-flex">

        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Tooltip from 'vue-bulma-tooltip'
export default {
  name: 'Navbar',
  components: {
    Tooltip
  },
  props: {
    show: Boolean
  },
  computed: mapGetters({
    sidebar: 'sidebar'
  }),
  methods: mapActions([
    'toggleSidebar'
  ])
}
</script>

<style lang='scss'>
@import '~bulma/sass/utilities/variables';
@import '../../globals.scss';
.app-navbar {
  position: fixed;
  min-width: 100%;
  z-index: 1024;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);
  .container {
    margin: auto 10px;
  }
  .nav-right {
    align-items: stretch;
    align-items: stretch;
    flex: 1;
    justify-content: flex-end;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
}
.hero-brand {
  .vue {
    margin-left: 10px;
    color: #36AC70;
  }
  .highlight {
    color: $lime-green;
  }
}
.nav-left{
  padding-top: 14px;
}
img {
  width: 50px;
}
</style>
