/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import axios from '../axios'
export default {
  
  create: params => {
    return axios({url:'/api/sub-system/create',method:'post',data: params})
  },
  //{organizationId}
  findByOrganization: params => {
    return axios({url:`/api/sub-system/find-by-organization/${params}`,method:'get', data: params})
  },
  //修改个人信息
  update: params => {
    return axios({url:'/api/sub-system/update',method:'post',data: params})
  },

  //删除子系统
  delete: params => {
    return axios({url:`/api/sub-system/delete-by-id/${params}`,method:'post',data: params})
  },
  //删除子系统
  deleteBatch: params => {
    return axios({url:`/api/sub-system/delete-batch`,method:'post',data: params})
  },
}
