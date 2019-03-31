import axios from '../axios'
/* 
 * 主机变量管理
 */
export default{
 //登录
 create: params => {
    return axios({url:'/admin/host/create',method:'post',data: params})
  },

  //修改个人信息
  update: params => {
    return axios({url:'/admin/host/update',method:'post',data: params})
  },

  //删除主机变量
  delete: params => {
    return axios({url:`/admin/host/delete-by-id/${params}`, method:'post',data:params})
  },
  //删除主机变量
  deleteBatch: params => {
    return axios({url:`/admin/host/delete-batch`,method:'post',data: params})
  },
  findAll: params => {
    return axios({url:`/admin/host/find-all`,method:'post', data: params})
  },

}
