export default {
    state: {
        appName: "Xone",  // 应用名称
        themeColor: "#333744",  // 主题颜色
        oldThemeColor: "#14889A",   // 上一次主题颜色
        collapse:false,  // 导航栏收缩状态
        menuRouteLoaded:false,
        routers:[]    // 子系统的菜单和路由数据
    },
    getters: {
        collapse(state){// 对应着上面state
            return state.collapse
        }
    },
    mutations: {
        onCollapse(state){  // 改变收缩状态
            state.collapse = !state.collapse
        },
        setThemeColor(state, themeColor){  // 改变主题颜色
            state.oldThemeColor = state.themeColor
            state.themeColor = themeColor
        },
        setSubSystemRouter(state, router){  // 改变菜单和路由的加载状态
            let exists = false;
            for(let i=0; i<state.routers.length; i++){
                let item = state.routers[i];
                if(item.subSystemId == router.subSystemId ){
                    state.routers[i] = rotuer;
                    exists = true;
                    break;
                }
            }

            if(!exists){
                state.routers.push(router);
            }
            
            //state.menuRouteLoaded = menuRouteLoaded;
        },
        menuRouteLoaded(state,menuRouteLoaded){
            state.menuRouteLoaded = menuRouteLoaded;
        }
    },
    actions: {
    }
}