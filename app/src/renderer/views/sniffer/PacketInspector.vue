<template>
  <transition
    :name="transition"
    mode="in-out"
    appear
    :appear-active-class="enterClass"
    :enter-active-class="enterClass"
    :leave-active-class="leaveClass"
    @after-leave="afterLeave"
  >
      <div id="message-box" class="card animated" v-if="show">
        <header class="card-header">
<!--           <p class="card-header-title">
            Packet Inspector
          </p> -->
          <a class="card-footer-item"
              @click="setTab('Summary')" >
            Summary
          </a>
          <a class="card-footer-item"
              @click="setTab('Headers')" >
            Headers
          </a>
          <a class="card-footer-item"
              @click="setTab('Payload')" >
            Payload
          </a>
        </header>
        <div class="card-content">
          <div class="content">
          <packet-inspector-payload :tab="tab" />
<!--           <pre>
            {{packet}}
          </pre> -->
          </div>
        </div>
        <footer class="card-footer">

        </footer>
      </div>

  </transition>
</template>
<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
import PacketInspectorPayload from './PacketInspectorPayload'
export default {
  name: 'PacketInspector',
  components: {
    PacketInspectorPayload
  },
  data () {
    return {
      $_parent_: null,
      direction: {
        type: String,
        default: 'Down'
      },
      duration: {
        type: Number,
        default: 1500
      },
      tab: 'Headers'
    }
  },
  created () {
    // let $parent = this.$parent
    // if (!$parent) {
    //   let parent = document.querySelector(this.container)
    //   if (!parent) {
    //     // Lazy creating `div.notifications` container.
    //     const className = this.container.replace('.', '')
    //     const Messages = Vue.extend({
    //       name: 'Messages',
    //       render (h) {
    //         return h('div', {
    //           'class': {
    //             [`${className}`]: true
    //           }
    //         })
    //       }
    //     })
    //     $parent = new Messages().$mount()
    //     document.body.appendChild($parent.$el)
    //   } else {
    //     $parent = parent.__vue__
    //   }
    //   // Hacked.
    //   this.$_parent_ = $parent
    // }
  },
  mounted () {
    if (this.$_parent_) {
      this.$_parent_.$el.appendChild(this.$el)
      this.$parent = this.$_parent_
      delete this.$_parent_
    }
  },
  computed: {
    show () {
      return this.packet !== null
    },
    transition () {
      return `bounce-${this.direction}`
    },
    enterClass () {
      return `bounceIn${this.direction}`
    },
    leaveClass () {
      return `bounceOut${this.direction === 'Up' ? 'Down' : 'Up'}`
    },
    ...mapGetters({
      packet: 'inspectorPacket'
    })
  },
  methods: {
    close () {
      clearTimeout(this.timer)
      this.show = false
    },
    setTab (view) {
      console.log('here')
      this.tab = view
    },
    afterLeave () {
      // this.$destroy()
    }
  }

}
</script>
<style lang='scss'>
.messages {
/*  position: ;
  top: 135px;
  left: 0;*/
  width: 100%;
  height: 300px;
  overflow: scroll;
  z-index: 1024 + 234;
  pointer-events: all;
  transform: translate3d(0, 0, 0);
}
  #message-box {
    position: fixed;
    top: 135px;
    left: 0;
    width: 100%;
    /*height: 300px;*/
    z-index: 1024 + 234;
    /*transform: translate3d(0, 0, 0);*/
    /*backface-visibility: hidden;*/
    pointer-events: all;
  }

</style>
