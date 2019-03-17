/**
 * Created by jerry on 2017/11/13.
 * 用户相关api
 */
import axios from '../axios'
export default {
  //登录
  login: params => {
    return axios({url:'/admin/login/', method:'post', data: params})
  },
  //登出
  logout: params => {
    return axios.get('/admin/v1/users/logout', params)
  },
  //修改个人信息
  changeProfile: params => {
    return axios.post('/admin/v1/users/profile', params)
  },

  //查询获取user列表(通过page分页)
  findList: params => {
    return axios.get('/admin/v1/users', params)
  },
}
