import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login')
  },
  {
    path: '/',
    name: '首页',
    component: () => import(/* webpackChunkName: "about" */ '../views/layout'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: '首页',
        component: () => import(/* webpackChunkName: "about" */ '../views/home/index')
      },
      {
        path: '/user-admin',
        name: '后台用户',
        component: () => import(/* webpackChunkName: "about" */ '../views/user/user-admin')
      },
      {
        path: '/user-wx',
        name: '微信用户',
        component: () => import(/* webpackChunkName: "about" */ '../views/user/user-wx')
      },
      {
        path: '/bigType',
        name: '商品大类',
        component: () => import(/* webpackChunkName: "about" */ '../views/bigType/index')
      },
      {
        path: '/smallType',
        name: '商品小类',
        component: () => import(/* webpackChunkName: "about" */ '../views/smallType/index')
      },
      {
        path: '/goods',
        name: '菜品管理',
        component: () => import(/* webpackChunkName: "about" */ '../views/goods/index')
      },
      {
        path: '/ingredients',
        name: '原料管理',
        component: () => import(/* webpackChunkName: "about" */ '../views/ingredients/index')
      },
      {
        path: '/goods-ingredient',
        name: '菜品原料管理',
        component: () => import(/* webpackChunkName: "about" */ '../views/goods-ingredient/index')
      },
      {
        path: '/order',
        name: '订单管理',
        component: () => import(/* webpackChunkName: "about" */ '../views/order/index')
      },
      {
        path: '/purchase',
        name: '采购管理',
        component: () => import(/* webpackChunkName: "about" */ '@/views/purchase/index')
      },
      {
        path: '/modifyPassword',
        name: '修改密码',
        component: () => import(/* webpackChunkName: "about" */ '../views/modifyPassword/index')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
