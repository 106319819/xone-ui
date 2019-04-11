import axios from '../axios'
/* 
 * 模块管理
 */
export default{
 //登录
 create: params => {
    return axios({url:'/admin/dictionary-type/create',method:'post',data: params})
  },

  //修改信息
  update: params => {
    return axios({url:'/admin/dictionary-type/update',method:'post',data: params})
  },

  //删除组织
  delete: params => {
    return axios({url:`/admin/dictionary-type/delete-by-id/${params}`, method:'post',data:params})
  },
  //删除组织
  deleteBatch: params => {
    return axios({url:`/admin/dictionary-type/delete-batch`,method:'post',data: params})
  },
  findAll: params => {
    return axios({url:`/admin/dictionary-type/find-all`,method:'post', data: params})
  },
  
  findAllList: params => {
    return axios({url:`/admin/dictionary-type/find-all-list`,method:'get', data: params})
  },
  findList: params => {
    return axios({url:`/admin/dictionary-type/find-list`,method:'get',data:params})
  },
  
  findByTypeCode: typeCode => {
    return axios({url:`/admin/dictionary-type/find-by-code/${typeCode}`,method:'get'})
  },
}
