    <template>
<section>
    <div class="splash content">
      <!-- <img class="test" src="./assets/herbivore-large.svg"> -->
      <h1 class="title">This is the about page for herbivore</h1>
      <div class="subtitle is-5 sub">
    <div @click="goHome" class='button'> Click here to go back </div>
    </div>
    </div>
</section>
</template>
<script type="text/javascript">
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: mapGetters({
    view: 'view'
  }),
  methods: {
    goHome: function () {
      this.$router.push({
        path: `/$home`
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
