<template>
<section>
<div class="splash content">
  <img class="test" src="./assets/herbivore-large.svg">
  <h1 class="title">Welcome to Herbivore</h1>

  <div class="subtitle is-5 sub">
    A tool that lets you take a deeper look at the packets traveling through your networks.
    </br>
    Go checkout whats happening on your current network.
      <span @click="goRight" class="icon">
        <i class="fa fa-arrow-right highlight" aria-hidden="true"></i>
      </span>
  </div>
    <a  class="nav-item">

    </a>
  <div @click="newMessage({level:'primary', title:'', duration: 5000, body:'If this is your first time using herbivore you\'ll need to set some permissions. Click on the permissions tab in the menu bar to do so. You will have to enter your password 3 times. (Sorry)'})" class='button'> Click here if its your first time </div>
  <p class="subtitle is-5 hint">
  Hint: you can also use the ← and → arrow keys to navigate.
  </p>
</div>
</section>
</template>
<script type="text/javascript">
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      test: '1111',
      show: false
    }
  },
  computed: mapGetters({
    view: 'view'
  }),
  methods: {
    toggle () {
      if (this.test === '1111') {
        this.test = '2222'
      } else {
        this.test = '1111'
      }
    },
    goRight: function () {
      console.log('there')
      this.incViewIndex()
      this.$router.push({
        path: `/${this.view.names[this.view.index]}`
      })
    },
    ...mapActions([
      'incViewIndex',
      'newMessage',
      'newNotification'
    ])}
}

</script>
<style scoped>
.sub {
  margin: auto 0;
}
.hint {
    font-size: 1.1rem;
    font-weight: 100;
    line-height: 1.25;
    margin-top: 6em;
}
.highlight{
  color: #00d1b2;
}
  code {
    background-color: rgba(40, 56, 76, .5);
    border-radius: 3px;
    color: #fff;
    font-weight: bold;
    padding: 3px 6px;
    margin: 0 3px;
    vertical-align: bottom;
  }
  .test{
    width:256px;
    height: auto;
  }
  .splash {
    padding-top: 10%;
  }
</style>
