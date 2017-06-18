<template>
  <section class="hero app-navbar animated" :class="{ slideInDown: show, slideOutUp: !show }">
    <div class="hero">
      <nav class="nav">
       <!--  <div class="nav-left">
          <a id="icon-padding" class="nav-item" @click="toggleSidebar(!sidebar.opened)">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </a>
        </div> -->
          <a v-if="$route.name != 'Home'" class="nav-left has-icon" href="/">
            <img src="./assets/herbivore.svg"/>
          </a>
          <div class="nav-center">

          <transition name="fade">
            <a id="view-title" v-if="show"  class=" nav-item title is-4" >
              {{$route.name}}
            </a>
          </transition>
          </div>
        <div  class="nav-right">
            <a  @click="goLeft" class="nav-item">
              <span class="icon">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
            </a>
            <a @click="goRight" class="nav-item">
              <span class="icon">
                <i class="fa fa-arrow-right" aria-hidden="true"></i>
              </span>
            </a>
      </div>
      </nav>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Navbar',
  props: ['views', 'viewIndex'],
  data () {
    return {
      show: false
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
    view: 'view',
    route: 'route'
  }),
  methods: {
    goRight: function () {
      console.log('there')
      this.incViewIndex()
      this.$router.push({
        path: `/${this.view.names[this.view.index]}`
      })
    },
    goLeft: function () {
      this.decViewIndex()
      this.$router.push({
        path: `/${this.view.names[this.view.index]}`
      })
    },
    ...mapActions([
      'incViewIndex',
      'decViewIndex',
      'toggleSidebar',
      'reverseAnimation'
    ])
  }
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
