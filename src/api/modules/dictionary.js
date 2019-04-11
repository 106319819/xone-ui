import axios from '../axios'
/* 
 * 模块管理
 */
export default{
 //登录
 create: params => {
    return axios({url:'/admin/dictionary/create',method:'post',data: params})
  },

  //修改信息
  update: params => {
    return axios({url:'/admin/dictionary/update',method:'post',data: params})
  },

  //删除组织
  delete: params => {
    return axios({url:`/admin/dictionary/delete-by-id/${params}`, method:'post',data:params})
  },
  //删除组织
  deleteBatch: params => {
    return axios({url:`/admin/dictionary/delete-batch`,method:'post',data: params})
  },
  findAll: params => {
    return axios({url:`/admin/dictionary/find-all`,method:'post', data: params})
  },

  findAllList: params => {
    return axios({url:`/admin/dictionary/find-all-list`,method:'get', data: params})
  },
  
  findListBy: typeId => {
    return axios({url:`/admin/dictionary/find-list-by/${typeId}`,method:'get'})
  },
  
  findByCode: (typeId,code) => {
    return axios({url:`/admin/dictionary/find-by-code/${typeId}/${code}`,method:'get'})
  },
}
