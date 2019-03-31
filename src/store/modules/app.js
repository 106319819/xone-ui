export default {
    state: {
        appName: "Xone",  // 应用名称
        themeColor: "#333744",  // 主题颜色
        oldThemeColor: "#14889A",   // 上一次主题颜色
        collapse:false,  // 导航栏收缩状态
        subSystem:{},
        modules:[]    // 子系统的菜单模块
    },
    getters: {
        collapse(state){// 对应着上面state
            return state.collapse
        },
        subSystem(state){
            return state.subSystem;
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
        setSubSystem(state,subSystem){
            state.subSystem = subSystem;
        },
        setSubSystemModule(state, data){  // 改变菜单和路由的加载状态
            let exists = false;
            for(let i=0; i<state.modules.length; i++){
                let item = state.modules[i];
                if(item.subSystemId == data.subSystemId ){
                    state.modules[i] = data;
                    exists = true;
                    break;
                }
            }

            if(!exists){
                state.modules.push(data);
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