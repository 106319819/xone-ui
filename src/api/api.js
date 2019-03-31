/* 
 * 接口统一集成模块
 */

import user from './modules/user'
import organization from './modules/organization'
import person from './modules/person'
import subSystem from './modules/subSystem'
import module from './modules/module'
import role from './modules/role'
import roleModule from './modules/roleModule'
import rolePerson from './modules/rolePerson'
import host from './modules/host'

// 默认全部导出
export default {
    user,
    organization,
    person,
    subSystem,
    module,
    role,
    roleModule,
    rolePerson,
    host
}