/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import axios from '../axios'

export default {
  //登录
  create: params => {
    return axios({url:'/admin/person/create',method:'post',data: params})
  },
  //{organizationId}
  findByOrganization: params => {
    return axios({url:`/admin/person/find-by-organization/${params}`,method:'get',data: params})
  },
  //修改个人信息
  update: params => {
    return axios({url:'/admin/person/update',method:'post',data: params})
  },

  //删除组织
  delete: params => {
    return axios({url:`/admin/person/delete-by-id/${params}`, method:'post',data:params})
  },
  //删除组织
  deleteBatch: params => {
    return axios({url:`/admin/person/delete-batch`,method:'post',data: params})
  },
// 更新账户密码
  updateAccountPassword:(accountId,srcpwd,password) =>{
    return axios({url:`/admin/account/update-account-password/${accountId}`,
     method:'post',params:{srcpwd:srcpwd,password:password}});
  },
  // 更新账户登录ID
  updateAccountCode:(accountId,accountCode) =>{
    return axios({url:`/admin/account/update-account-code/${accountId}`, method:'post',data:{accountCode:accountCode}});
  },
// 重置密码
  resetAccountPassword:(account)=>{
    return axios({url:`/admin/account/reset-account-password`, method:'post',data:account});
  }
 
  
}
