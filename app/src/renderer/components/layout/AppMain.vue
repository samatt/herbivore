<template>
  <section class="app-main">
    <div class="container is-fluid is-marginless app-content">
      <transition
        mode="out-in"
        enter-active-class="fadeInDown"
        leave-active-class="fadeOutUp"
        appear>
        <levelbar class="animated"></levelbar>
      </transition>

      <transition
        mode="out-in"
        :enter-active-class="reversed ? 'slideInRight' : 'slideInLeft' "
        :leave-active-class="reversed ? 'slideOutLeft' : 'slideOutRight' "
        appear>
        <router-view class="animated has-text-centered"></router-view>
      </transition>
    </div>
  </section>
</template>

<script>
import Levelbar from './Levelbar'
import { mapGetters } from 'vuex'
export default {
  components: {
    Levelbar
  },
  computed: mapGetters([
    'reversed'
  ])
}
</script>

<style lang='scss'>
@import '~bulma/sass/utilities/variables';
@import '~bulma/sass/utilities/mixins';
.app-main {
  padding-top: 50px;
  /*margin-left: 180px;*/
  transform: translate3d(0, 0, 0);
  @include mobile() {
    margin-left: 0;
  }
}
.app-content {
  /*padding: 20px;*/
}
</style>
