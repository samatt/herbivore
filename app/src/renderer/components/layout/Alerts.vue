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
      if (val.duration) {
        openMessage({
          title: val.title,
          message: val.body,
          type: val.level,
          direction: 'Down',
          duration: val.duration,
          showCloseButton: true
        })
      } else {
        openMessage({
          title: val.title,
          message: val.body,
          type: val.level,
          direction: 'Down',
          showCloseButton: true
        })
      }
    },
    notification (val) {
      if (val.duration) {
        openNotification({
          title: val.title,
          message: val.body,
          type: val.level,
          duration: val.duration,
          showCloseButton: true
        })
      } else {
        openNotification({
          title: val.title,
          message: val.body,
          type: val.level,
          showCloseButton: true
        })
      }
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
