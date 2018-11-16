/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import * as API from '.'

export default {
  //登录
  create: params => {
    return API.POST('/api/organization/create', params)
  },
  //
  findByParent: params => {
    return API.GET(`/api/organization/find-by-parent/${params}`, params)
  },
  //修改个人信息
  update: params => {
    return API.PATCH('/api/organization/update', params)
  },

  //查询获取user列表(通过page分页)
  findList: params => {
    return API.GET('/api/v1/users', params)
  },
}
