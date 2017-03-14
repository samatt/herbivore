import * as types from '../mutation-types'
// import views from '../../components/views'

// show: meta.label -> name
// name: component name
// meta.label: display label

const state = {
  items: [
    {
      name: 'Network',
      path: '/network',
      meta: {
        icon: 'fa-info',
        link: 'network/index.vue'
      },
      component: require('../../views/network')
    },
    {
      name: 'Sniffer',
      path: '/sniffer',
      meta: {
        icon: 'fa-eye',
        link: 'sniffer/index.vue'
      },
      component: require('../../views/sniffer')
    }
  ]
}

const getters = {
  menuitems: state => state.items
}

const mutations = {
  [types.EXPAND_MENU] (state, menuItem) {
    if (menuItem.index > -1) {
      if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
        state.items[menuItem.index].meta.expanded = menuItem.expanded
      }
    } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
      menuItem.item.meta.expanded = menuItem.expanded
    }
  }
}

export default {
  state,
  mutations,
  getters
}
