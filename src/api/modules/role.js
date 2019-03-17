import axios from '../axios'
/* 
 * 模块管理
 */
export default{
 //登录
 create: params => {
    return axios({url:'/admin/role/create',method:'post',data: params})
  },

  //修改个人信息
  update: params => {
    return axios({url:'/admin/role/update',method:'post',data: params})
  },

  //删除组织
  delete: params => {
    return axios({url:`/admin/role/delete-by-id/${params}`, method:'post',data:params})
  },
  //删除组织
  deleteBatch: params => {
    return axios({url:`/admin/role/delete-batch`,method:'post',data: params})
  },
  findAll: params => {
    return axios({url:`/admin/role/find-all`,method:'post', data: params})
  },

}
