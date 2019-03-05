/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import axios from '../axios'

export default {
  //登录
  create: params => {
    return axios({url:'/api/person/create',method:'post',data: params})
  },
  //{organizationId}
  findByOrganization: params => {
    return axios({url:`/api/person/find-by-organization/${params}`,method:'get',data: params})
  },
  //修改个人信息
  update: params => {
    return axios({url:'/api/person/update',method:'post',data: params})
  },

  //删除组织
  delete: params => {
    return axios({url:`/api/person/delete-by-id/${params}`, method:'post',data:params})
  },
  //删除组织
  deleteBatch: params => {
    return axios({url:`/api/person/delete-batch`,method:'post',data: params})
  },
}
