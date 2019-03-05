// 导入所有接口
import api from './api'

const attache = Vue => {
    if (attache.installed)
        return;

        attache.installed = true;

    Object.defineProperties(Vue.prototype, {
        // 注意，此处挂载在 Vue 原型的 $api 对象上
        $api: {
            get() {
                return api
            }
        }
    })
}

export default attache