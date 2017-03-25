<template>
  <section class="hero app-navbar animated" :class="{ slideInDown: show, slideOutUp: !show }">
    <div class="hero">
      <nav class="nav">
        <div class="nav-left">
          <a id="icon-padding" class="nav-item is-hidden-mobile" @click="toggleSidebar(!sidebar.opened)">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </a>
        </div>

          <div class="nav-center">
          <transition name="fade">
            <a id="view-title" v-if="show"  class=" nav-item title is-4" href="/">
              {{$route.name}}
            </a>
          </transition>
          </div>
        <a v-if="$route.name != 'Home'" class="nav-right has-icon" href="/">
          <img src="./assets/herbivore.svg"> </svg>
        </a>
      </nav>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Navbar',
  data () {
    return {
      show: true
    }
  },
  watch: {
    $route (val) {
      if (val.name !== 'Home') {
        this.show = true
      } else {
        this.show = false
      }
    }
  },
  computed: mapGetters({
    sidebar: 'sidebar',
    route: 'route'
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
#view-title{
  padding-top: 2px;
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
