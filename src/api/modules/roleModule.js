import axios from '../axios'
/* 
 * 模块管理
 */
export default{
 //创建
 create: (roleId,params) => {
    return axios({url:`/api/role-module/create/${roleId}`,method:'post',data: params})
  },

  //修改
  update: params => {
    return axios({url:'/api/role-module/update',method:'post',data: params})
  },

  //删除
  delete: params => {
    return axios({url:`/api/role-module/delete-by-id/${params}`, method:'post',data:params})
  },
  //批量删除
  deleteBatch: params => {
    return axios({url:`/api/role-module/delete-batch`,method:'post',data: params})
  },

  findAllByRoleId:params => {
    return axios({url:`/api/role-module/find-all-by-role-id/${params}`,data:params});
  }
}