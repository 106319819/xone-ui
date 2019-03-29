import router from '@/router'
import api from '@/api/api'
import store from '@/store'
import iframe from '@/common/iframe'
import Util from '@/common/util'
// 懒加载方式，当路由被访问的时候才加载对应组件
export default {
  /**
   * 加载动态菜单和路由
   */
  addDynamicMenuAndRoutes(user, to, from) {
    // 处理IFrame嵌套页面
    this.handleIFrameUrl(to.path);
    this.loadSubSystemModules(user, user.subSystems[0]);
  },
  loadSubSystemModules(user, subSystem) {
    for (let i = 0; i < store.state.app.modules.length; i++) {
      let item = store.state.app.modules[i];
      if (item.subSystemId == subSystem.subSystemId) {
         // 处理静态组件绑定路由
        // this.handleStaticComponent(router, item.routers);
        // router.addRoutes(router.options.routes);

          // 添加动态路由
        let dynamicRoutes = this.addDynamicRoutes(item.modules);
        // 处理静态组件绑定路由
        this.handleStaticComponent(router, dynamicRoutes);
        router.addRoutes(router.options.routes);     
        // 保存菜单树
        store.commit('setNavTree', item.modules);

       return;
      }
    }

    api.module.fetchTreeByOwner(user.personId, subSystem.subSystemId).then(result => {
      // 添加动态路由
      let dynamicRoutes = this.addDynamicRoutes(result.data);
      // 处理静态组件绑定路由
      this.handleStaticComponent(router, dynamicRoutes);
      router.addRoutes(router.options.routes);
      // 保存加载状态
      let subSystemModule = {
        subSystemId: subSystem.subSystemId,
        modules: result.data
      }
      store.commit('setSubSystemModule', subSystemModule);
      // 保存菜单树
      store.commit('setNavTree', result.data);
    }).catch(Util.error);
  },
  /**
   * 处理路由到本地直接指定页面组件的情况
   * 比如'代码生成'是要求直接绑定到'Generator'页面组件
   */
  handleStaticComponent(router, dynamicRoutes) {
    for (let j = 0; j < dynamicRoutes.length; j++) {
      if (dynamicRoutes[j].name == '代码生成') {
        dynamicRoutes[j].component = Generator;
        break;
      }
    }
    let home = router.options.routes[0].children.slice(0, 1);
    router.options.routes[0].children = home.concat(dynamicRoutes);
  },

  /**
   * 处理IFrame嵌套页面
   */
  handleIFrameUrl(path) {
    // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
    let url = path;
    let length = store.state.iframe.iframeUrls.length;
    for (let i = 0; i < length; i++) {
      let frame = store.state.iframe.iframeUrls[i];
      if (path != null && path.endsWith(frame.path)) {
        url = frame.url
        store.commit('setIFrameUrl', url);
        break;
      }
    }
  },

  /**
   * 添加动态(菜单)路由
   * @param {*} menuList 菜单列表
   * @param {*} routes 递归创建的动态(菜单)路由
   */
  addDynamicRoutes(menuList = [], routes = []) {
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
          let iFrameUrl = {
            'path': `/${path}`,
            'url': url
          }
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
      this.addDynamicRoutes(temp, routes)
    } else {
      console.log('动态路由加载...')
      console.log(routes)
      console.log('动态路由加载完成.')
    }
    return routes
  }
}
