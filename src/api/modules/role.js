import axios from '../axios'
/* 
 * 模块管理
 */
export default{
 //登录
 create: params => {
    return axios({url:'/api/role/create',method:'post',data: params})
  },

  //修改个人信息
  update: params => {
    return axios({url:'/api/role/update',method:'post',data: params})
  },

  //删除组织
  delete: params => {
    return axios({url:`/api/role/delete-by-id/${params}`, method:'post',data:params})
  },
  //删除组织
  deleteBatch: params => {
    return axios({url:`/api/role/delete-batch`,method:'post',data: params})
  },
  findAll: params => {
    return axios({url:`/api/role/find-all`,method:'post', data: params})
  },

}
