/**
 * Created by jerry on 2017/4/14.
 */
//import { Loading } from 'element-ui';
import { MessageBox } from 'element-ui';
import { Message } from 'element-ui';

var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'
function padding (s, len) {
  let l = len - (s + '').length
  for (var i = 0; i < l; i++) { s = '0' + s }
  return s
};

export default {
  getQueryStringByName: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    var context = ''
    if (r != null) { context = r[2] }
    reg = null
    r = null
    return context === null || context === '' || context === 'undefined' ? '' : context
  },
  formatDate: {

    format: function (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
          case 'y': return padding(date.getFullYear(), $0.length)
          case 'M': return padding(date.getMonth() + 1, $0.length)
          case 'd': return padding(date.getDate(), $0.length)
          case 'w': return date.getDay() + 1
          case 'h': return padding(date.getHours(), $0.length)
          case 'm': return padding(date.getMinutes(), $0.length)
          case 's': return padding(date.getSeconds(), $0.length)
        }
      })
    },
    parse: function (dateString, pattern) {
      var matchs1 = pattern.match(SIGN_REGEXP)
      var matchs2 = dateString.match(/(\d)+/g)
      if (matchs1.length === matchs2.length) {
        var _date = new Date(1970, 0, 1)
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i])
          var sign = matchs1[i]
          switch (sign.charAt(0)) {
            case 'y': _date.setFullYear(_int); break
            case 'M': _date.setMonth(_int - 1); break
            case 'd': _date.setDate(_int); break
            case 'h': _date.setHours(_int); break
            case 'm': _date.setMinutes(_int); break
            case 's': _date.setSeconds(_int); break
          }
        }
        return _date
      }
      return null
    }

  },
  error(data){
      // let loading = Loading.service({});
      // loading.close();
      console.info(data);
      console.log(data);

      let message = '';
      if('code' in data &&　'message' in data){
        message = `${data.code} ${data.message}`;
      }
      else if ('statusText' in data){
        message = `${data.status} ${data.statusText} `;
      }else if ('message' in data){
        message = data.message;
      }else{
        message = data;
      }
      
      MessageBox.alert(message,'错误');

  },
  alert(message,options={title:'提示'}){
      // let loading = Loading.service({});
      // loading.close();
      MessageBox.alert(message,options);
      //Message.success({showClose: true, message: message, duration: 2000});
  },
  message(message,duration=2000){
    Message.success({showClose: true, message: message, duration: duration});
  },
  confirm(message,params,options={type: 'warning',title:'提示'}){
    let p = new Promise( (resolve,reject) => {
        MessageBox.confirm(message,options).then(()=>{resolve(params)}).catch(()=>{reject(params)});
    });
    return p;
  },prompt(message,options={title:'提示'}){
    let p = new Promise( (resolve,reject) => {
        MessageBox.prompt(message,options).then(resolve).catch(reject);
    });
    return p;
  },
  response(data){
    let p = new Promise( (resolve,reject) => {
        if(data.status == 'success'){
          resolve(data);
        }else{
          reject(data);
        }
    });
    return p;
  }

}
