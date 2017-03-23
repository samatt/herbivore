<template>
<section>
<div class="splash content">
  <img class="test" src="./assets/herbivore-large.svg">
  <h1 class="title">Welcome to Herbivore</h1>

  <div class="subtitle is-3"></div>
    A tool that lets you take a deeper look at the packets traveling through your networks.
    </br>
  </div>
  <p>
    First go checkout whats happening on your
    <router-link to="/network" :exact="true">
      current network
    </router-link>
  </p>
  <div @click="newNotification({level:'danger', body:'Lots and lots of text about all the things...'})" class='button'> Notification </div>
  <div @click="newMessage({level:'danger', body:'test'})" class='button'> Message </div>

</div>
</section>
</template>
<script type="text/javascript">
import { mapActions } from 'vuex'
export default {
  methods: mapActions([
    'newMessage',
    'newNotification'
  ])
}

</script>
<style scoped>
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
