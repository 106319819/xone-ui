import axios from '../axios'
/* 
 * 模块管理
 */
export default{
 //登录
 create: params => {
    return axios({url:'/admin/module/create',method:'post',data: params})
  },
  //{subSystemId}
  findBySubSystem: params => {
    return axios({url:`/admin/module/find-by-sub-system/${params}`,method:'get',data: params})
  },
  //修改个人信息
  update: params => {
    return axios({url:'/admin/module/update',method:'post',data: params})
  },

  //删除组织
  delete: params => {
    return axios({url:`/admin/module/delete-by-id/${params}`, method:'post',data:params})
  },
  //删除组织
  deleteBatch: params => {
    return axios({url:`/admin/module/delete-batch`,method:'post',data: params})
  },

  //组织
  /**
   * @param params 子系统id
   */
  fetchTree: params => {
    return axios({url:`/admin/module/fetch-tree-by-sub-system/${params}`,method:'get',data: params})
  },
  /**
   * 查询个人所有的模块
   */
  fetchTreeByPersonId: personId => {
    return axios({url:`/admin/module/fetch-tree-by-person-id/${personId}`,method:'get',data: personId})
  },
  
}
