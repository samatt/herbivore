<template>
<section>
<!--     <button class="button" @click="openNotificationWithType('')">Normal</button>
    <button class="button is-primary" @click="openMessageWithType('primary')">Primary</button> -->
  </section>
</template>

<script>
import Vue from 'vue'
import Message from 'vue-bulma-message'
import Notification from 'vue-bulma-notification'
import { mapGetters } from 'vuex'
const MessageComponent = Vue.extend(Message)
const NotificationComponent = Vue.extend(Notification)

const openNotification = (propsData = {
  title: '',
  message: '',
  type: '',
  direction: '',
  duration: 4500,
  container: '.notifications'
}) => {
  return new NotificationComponent({
    el: document.createElement('div'),
    propsData
  })
}

const openMessage = (propsData = {
  title: '',
  message: '',
  type: '',
  direction: '',
  duration: 1500,
  container: '.messages'
}) => {
  return new MessageComponent({
    el: document.createElement('div'),
    propsData
  })
}

export default {
  name: 'Alerts',
  components: {
    Message
  },
  computed: mapGetters(['message',
    'notification']),
  watch: {
    message (val) {
      console.log(val)
      openMessage({
        title: 'This is a title',
        message: val.body,
        type: val.level,
        direction: 'Up',
        duration: 2500
      })
    },
    notification (val) {
      openNotification({
        title: 'This is a title',
        message: val.body,
        type: val.level,
        duration: 2000,
        showCloseButton: true
      })
    }
  },
  methods: {
    openMessageWithType (type) {
      openMessage({
        title: 'This is a title',
        message: 'This is the message.',
        type: type
      })
    },
    openNotificationWithType (type) {
      openNotification({
        title: 'This is a title',
        message: 'This is the message.',
        type: type
      })
    }
  }
}
</script>
<style lang='scss'>

</style>
