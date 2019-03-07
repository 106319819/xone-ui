import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Dashboard from '@/views/Dashboard'

import SubSystemIndex from '@/views/system/index'

import PersonIndex from '@/views/person/index'
import UserChangePwd from '@/views/person/changepwd'

import OrganizationIndex from '@/views/organization/index'
import OrganizationEdit from '@/views/organization/edit-form'

import ModuleIndex from '@/views/module/index'
// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/views/Login'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/dashboard',
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-shouye_o', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '组织管理',
      menuShow: true,
      iconCls: 'iconfont icon-shuzhuangtu_o', // 图标样式class
      children: [
        {path: '/organization/index', component: OrganizationIndex, name: '组织列表', menuShow: true},
        {path:'/organization/edit',component:OrganizationEdit,name:'组织编辑', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '人员管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-qunzu_o', // 图标样式class
      children: [
        {path: '/person/index', component: PersonIndex, name: '人员列表', menuShow: true}
      ]
    },    
    {
      path: '/',
      component: Home,
      name: '模块管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-qunzu_o', // 图标样式class
      children: [
        {path: '/module/index', component: ModuleIndex, name: '模块列表', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '子系统管理',
      menuShow: true,
      iconCls: 'iconfont icon-shu_o',
      children: [
        {path: '/system/index', component: SubSystemIndex, name: '子系统管理', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      iconCls: 'iconfont icon-quanjushezhi_o',
      children: [
        {path: '/person/index', component: PersonIndex, name: '个人信息', menuShow: true},
        {path: '/person/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true}
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  // 登录界面登录成功之后，会把用户信息保存在会话
  if (to.path.startsWith('/login')) {
    window.localStorage.removeItem('token')
    next()
  } else {
    let user = JSON.parse(window.localStorage.getItem('token'))
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
