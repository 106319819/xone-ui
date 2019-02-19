/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import * as API from '.'

export default {
  //登录
  create: params => {
    return API.POST('/api/person/create', params)
  },
  //{organizationId}
  findByOrganization: params => {
    return API.GET(`/api/person/find-by-organization/${params}`, params)
  },
  //修改个人信息
  update: params => {
    return API.POST('/api/person/update', params)
  },

  //删除组织
  delete: params => {
    return API.POST(`/api/person/delete-by-id/${params}`, params)
  },
  //删除组织
  deleteBatch: params => {
    return API.POST(`/api/person/delete-batch`, params)
  },
}
