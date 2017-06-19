<template>
  <section class="hero app-navbar animated" :class="{ slideInDown: show, slideOutUp: !show }">
    <div class="hero">
      <nav class="nav">
       <!--  <div class="nav-left">
          <a id="icon-padding" class="nav-item" @click="toggleSidebar(!sidebar.opened)">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </a>
        </div> -->
          <div class="nav-left has-icon" >
            <img src="./assets/herbivore.svg"/>
          </div>
          <div class="nav-center">
            <span @click="popMessage" class="icon help">
              <i class="fa fa-question-circle" aria-hidden="true"></i>
            </span>
          <transition name="fade">
            <a id="view-title" v-if="show"  class=" nav-item title is-4" >
              {{$route.name}}
            </a>
          </transition>
          </div>
        <div  class="nav-right">
            <a  @click="goLeft" class="nav-item">
              <span :class="view.index > 0 ? ['icon', 'highlight'] : ['icon']">
                <i class="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
            </a>
            <a @click="goRight" class="nav-item">
              <span :class="view.index < view.names.length -1 ?  ['icon', 'highlight']:['icon']">
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
import helpText from './helpText'

export default {
  name: 'Navbar',
  props: ['views', 'viewIndex'],
  data () {
    return {
      show: false,
      helpText: helpText
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
    popMessage () {
      let view = this.$route.name.toLowerCase()
      console.log('post message')
      console.log(this.helpText[view])
      this.newNotification(
        { level: 'primary',
          title: this.helpText[view].title,
          duration: 15000,
          body: this.helpText[view].body
        })
    },
    ...mapActions([
      'incViewIndex',
      'decViewIndex',
      'toggleSidebar',
      'reverseAnimation',
      'newMessage',
      'newNotification'
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
.help {
  margin-top: 12px;
}
.highlight{
  color: #00d1b2;
}

.nav-left{
  padding-top: 14px;
}
img {
  width: 50px;
}
</style>
