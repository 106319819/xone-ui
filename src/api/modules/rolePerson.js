
import axios from '../axios'
/* 
 * 模块管理
 */
export default{
 //创建
 create: (personId,params) => {
    return axios({url:`/admin/role-person/create/${personId}`,method:'post',data: params})
  },

  //修改
  update: params => {
    return axios({url:'/admin/role-person/update',method:'post',data: params})
  },

  //删除
  delete: params => {
    return axios({url:`/admin/role-person/delete-by-id/${params}`, method:'post',data:params})
  },
  //批量删除
  deleteBatch: params => {
    return axios({url:`/admin/role-person/delete-batch`,method:'post',data: params})
  },

  findAllByRoleId:params => {
    return axios({url:`/admin/role-person/find-all-by-role-id/${params}`,data:params});
  },
  findRolesByPersonId:params => {
    return axios({url:`/admin/role-person/find-roles-by-person-id/${params}`,data:params});
  }
}
