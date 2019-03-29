import Vue from 'vue'
import Router from 'vue-router'
//静态测试
// import Home from '@/views/Home'
// 动态生成
import Home from '@/views/main/index'
import Dashboard from '@/views/Dashboard'

import SubSystemIndex from '@/views/system/index'

import PersonIndex from '@/views/person/index'
import UserChangePwd from '@/views/person/changepwd'

import OrganizationIndex from '@/views/organization/index'
import OrganizationEdit from '@/views/organization/edit-form'

import ModuleIndex from '@/views/module/index'
import RoleIndex from '@/views/role/index'

import api from '@/api/api'
import store from '@/store'
import iframe from '@/common/iframe'
import Util from '@/common/util'
// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/views/Login'], resolve);

const MainIndex = resolve => require(['@/views/main/index'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      // component: Home,
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
      path: '/login',
      name: '登录',
      component: Login
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
      name: '角色管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-qunzu_o', // 图标样式class
      children: [
        {path: '/role/index', component: RoleIndex, name: '角色列表', menuShow: true}
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
    },{
      path: '/',
      component: Home,
      name: '动态生成',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-shuzhuangtu_o', // 图标样式class
      children: [
        {path: '/main/index', component: MainIndex , name: 'main', menuShow: true},
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  // 登录界面登录成功之后，会把用户信息保存在会话
  if (to.path.startsWith('/login')) {
    sessionStorage.removeItem('user')
    next();
  } else {
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      next({path: '/login'});
    } else {
      // 加载动态菜单和路由
      addDynamicMenuAndRoutes(user, to, from);
      next();
    }
  }
})

//------------动态加载菜单及路由
/**
* 加载动态菜单和路由
*/
function addDynamicMenuAndRoutes(user, to, from) {
  // 处理IFrame嵌套页面
  handleIFrameUrl(to.path);
  loadSubSystemModules(user,user.subSystems[0]);
  // if(store.state.app.menuRouteLoaded) {
  //   console.log('动态菜单和路由已经存在.')
  //   return;
  // }
  // api.module.fetchTreeByPersonId(user.personId).then(result => {
  //   // 添加动态路由
  //   let dynamicRoutes = addDynamicRoutes(result.data);
  //   // 处理静态组件绑定路由
  //   handleStaticComponent(router, dynamicRoutes);
  //   router.addRoutes(router.options.routes);
  //   // 保存加载状态
  //   store.commit('menuRouteLoaded', true);
  //   // 保存菜单树
  //   store.commit('setNavTree', result.data);
  // }).catch(Util.error);
}
function loadSubSystemModules(user,subSystem){
   for(let i=0; i< store.state.app.routers.length; i++){
      let item = store.state.app.routers[i];
      if(item.subSystemId == subSystem.subSystemId ){
        return ;
      }
  }

  api.module.fetchTree(user.personId,subSystem.subSystemId).then(result => {
    // 添加动态路由
    let dynamicRoutes = addDynamicRoutes(result.data);
    // 处理静态组件绑定路由
    handleStaticComponent(router, dynamicRoutes);
    router.addRoutes(router.options.routes);
    // 保存加载状态
    let subSystemRouter = {subSystemId:subSystem.subSystemId,routers: dynamicRoutes}
    store.commit('setSubSystemRouter', subSystemRouter);
    // 保存菜单树
    store.commit('setNavTree', result.data);
  }).catch(Util.error);
}
/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function handleStaticComponent(router, dynamicRoutes) {
  for(let j=0;j<dynamicRoutes.length; j++) {
    if(dynamicRoutes[j].name == '代码生成') {
      dynamicRoutes[j].component = Generator;
      break;
    }
  }
  let home = router.options.routes[0].children.slice(0,1);
  router.options.routes[0].children = home.concat(dynamicRoutes);
}

/**
 * 处理IFrame嵌套页面
 */
function handleIFrameUrl(path) {
  // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
  let url = path;
  let length = store.state.iframe.iframeUrls.length;
  for(let i=0; i<length; i++) {
    let frame = store.state.iframe.iframeUrls[i];
    if(path != null && path.endsWith(frame.path)) {
      url = frame.url
      store.commit('setIFrameUrl', url);
      break;
    }
  }
}

/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
function addDynamicRoutes (menuList = [], routes = []) {
 let temp = []
 for (let i = 0; i < menuList.length; i++) {
   if (menuList[i].children && menuList[i].children.length >= 1) {
     temp = temp.concat(menuList[i].children)
   } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      //menuList[i].url = menuList[i].url.replace(/^\//, '')
      // 创建路由配置
      let route = {
        path: menuList[i].url,
        component: null,
        name: menuList[i].name,
        meta: {
          icon: menuList[i].icon,
          index: menuList[i].moduleId
        }
      }
      let path = iframe.getPath(menuList[i].url);
      if (path) {
        // 如果是嵌套页面, 通过iframe展示
        route['path'] = `/${path}`;
        route['component'] = resolve => require([`@/views/main/iframe`], resolve)
        // route['component'] = resolve => require([`@/views/main/html-panel`], resolve)
        // 存储嵌套页面路由路径和访问URL
        let url = iframe.getUrl(menuList[i].url);
        let iFrameUrl = {'path':`/${path}`, 'url':url}
        store.commit('addIFrameUrl', iFrameUrl)
      } else {
       try {
         // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
         // 如url="sys/user"，则组件路径应是"@/views/sys/user.vue",否则组件加载不到
         route['component'] = resolve => require([`@/views${menuList[i].url}`], resolve)
       } catch (e) {}
     }
     routes.push(route)
   }
 }
 if (temp.length >= 1) {
   addDynamicRoutes(temp, routes)
 } else {
   console.log('动态路由加载...')
   console.log(routes)
   console.log('动态路由加载完成.')
 }
 return routes
}
//------------
export default router
