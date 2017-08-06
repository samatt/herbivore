import Vue from 'vue'
import Router from 'vue-router'
import menuModule from '../vuex/modules/menu'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'is-active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      name: 'Home',
      path: '/',
      component: require('../views/home/Index.vue')
    },
    {
      name: 'About',
      path: '/about',
      component: require('../views/about/Index.vue')
    },
    ...generateRoutesFromMenu(menuModule.state.items),
    {
      path: '*',
      redirect: '/'
    }
  ]
})

function generateRoutesFromMenu (menu = [], routes = []) {
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i]
    if (item.path) {
      routes.push(item)
    }
    if (!item.component) {
      generateRoutesFromMenu(item.children, routes)
    }
  }
  return routes
}
// import menuModule from 'vuex-store/modules/menu'

// export default [
//   {
//     path: '/',
//     name: 'home',
//     component: require('./views/home')
//   },
//   {
//     path: '*',
//     redirect: '/'
//   }
// ]
