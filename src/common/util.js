/**
 * Created by jerry on 2017/4/14.
 */
//import { Loading } from 'element-ui';
import { MessageBox,Message } from 'element-ui';

export default {
  /**
   * 判断v是否为空
   * @param {} v
   * @return {Boolean}
   */
  nvl: function (v) {
    if ("" === v || null === v || "null" === v || undefined === v || "undefined" === v) {
      return true;
    }

    return false;
  },
  /**
   * 判断v是否为未定义
   * @param {} 
   * @return {Boolean}
   */
  undefined: function (v) {
    if (typeof (v) == "undefined") {
      return true;
    }
    return false;
  },
  /**
   * 当v为空时，返回默认值
   * @param {} v
   * @param {} val
   * @return {}
   */
  nvlEx: function (v, val) {
    if ("" == v || null == v || undefined == v) {
      return val;
    }

    return v;
  },
  /**
   * html的空格转换
   * @param {} v
   * @return {}
   */
  nbsp: function (v) {
    return ("" == v || "null" == v || null == v) ? "&nbsp;" : v;
  },
  isNumber(str){
   //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
　　return (/^[0-9]+.?[0-9]*$/).test(str);
  },
  /**
   * 去除js对象中为空的属性
   * @param {} obj
   * @param {} nvlFn
   */
  clean: function (obj, nvlFn) {
    if (!nvlFn) {
      nvlFn = this.nvl;
    }
    for (var attr in obj) {
      if (true == nvlFn(obj[attr])) {
        delete obj[attr];
      }
    }
  },
  eval: function (data) {
    try {
      return eval('(' + data + ')');
    } catch (e) {
      this.message('解析JSON数据错误:' + e.message);
    }
    return {};
  },
  /**
   * 将json对象转为字串
   * @param {} json 对象
   * @return {} string json
   */
  stringify: function (json) {
    if (typeof (JSON2) == 'undefined' && typeof (JSON) == 'undefined') {
      this.message("请引入json2.js文件，再调用stringify方法");
      return null;
    }
    if (typeof (JSON2) == 'object') {
      //优先使用高版本进行转换
      return JSON2.stringify(json);
    } else {
      return JSON.stringify(json);
    }
  },
  stringify2: function (json) {
    if (typeof (JSON2) == 'undefined' && typeof (JSON) == 'undefined') {
      this.message("请引入json2.js文件，再调用stringify方法");
      return null;
    }
    if (typeof (JSON2) == 'object') {
      //优先使用高版本进行转换
      return encodeURIComponent(JSON2.stringify(json));
    } else {
      return encodeURIComponent(JSON.stringify(json));
    }
  },
  /**
   * 将字串转为json对象
   * @param str json 字串
   */
  json: function (str) {
    if (typeof (JSON2) == 'object') {
      //优先使用高版本进行转换
      return JSON2.parse(str);
    } else {
      return JSON.parse(str);
    }
  },
  /**
   * 将字串转为json对象
   * @param str json 字串
   */
  json2: function (str) {
    if (typeof (JSON2) == 'object') {
      //优先使用高版本进行转换
      return JSON2.parse(decodeURIComponent(str));
    } else {
      return JSON.parse(decodeURIComponent(str));
    }
  },

  /**
   *去除字串中的换行及单引号
   * var str1 = str.replace(/\s+|\r+|\n+|\'/g,'');
   * @param {} src
   */
  clear: function (str) {
    if (!str) {
      return str;
    }

    var tmp = str.replace(/\r|\n|\'/g, '');
    return tmp;
  },
  /**
  *将 Date 转化为指定格式的String  月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 
  *可以用 1-2 个占位符， 年(y)可以用 1-4 个占位符，毫秒(S)只能用 
  *1 个占位符(是 1-3 位的数字)   
  *  
  * @param {} d 日期对象
  * @param {格式串} fmt
  * @return {指定格式后的日期字符串}
  * *例子：  
  * (format(d,"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
  * (format(d,"yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
  */
  format: function (d, {fmt = 'yyyy-MM-dd hh:mm:ss'}={}) { //author: meizz   
    var o = {
      "M+": d.getMonth() + 1, //月份   
      "d+": d.getDate(), //日   
      "h+": d.getHours(), //小时   
      "m+": d.getMinutes(), //分   
      "s+": d.getSeconds(), //秒   
      "q+": Math.floor((d.getMonth() + 3) / 3), //季度   
      "S": d.getMilliseconds()
      //毫秒   
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 -
        RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1,
          (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
            .substr(("" + o[k]).length)));
      }
    }
    return fmt;
  },
  /**
   * 取指定日期所属月的第一天，并按指定的格式串返回日期字串
   * @param {} date
   * @param {} format 日期格式串
   */
  getFirstDay: function (date, format) {
    date.setDate(1);
    return this.format(date, format);
  },
  /**
   * *取指定日期所属月的最后一天
   * @param {} date
   * @param {} format 日期格式串，并按指定的格式串返回日期字串
   */
  getLastDay: function (date, format) {
    var t = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var day = t.getDate();
    date.setDate(day);
    return this.format(date, format);
  },
  /**
   * 比较两个日期大小,如果d1 > d2 return true ,否则 return false
   * @param d1 string or date type
   * @param d2 string or date type 
   */
  compare: function (d1, d2) {

    if (d1 instanceof Date && d2 instanceof Date) {
      return (d1 > d2);
    }
    if (typeof (d1) == 'string' && typeof (d2) == 'string') {
      var d1d = d1.split(" ");
      var d2d = d2.split(" ");

      var d1ymd = d1d[0].split("-");
      var d2ymd = d2d[0].split("-");

      var sd = new Date(d1ymd[0], d1ymd[1], d1ymd[2]);
      var ed = new Date(d2ymd[0], d2ymd[1], d2ymd[2]);

      if (d1d.length == 2 && d2d.length == 2) {
        var d1t = d1d[1].split(":");
        var d2t = d2d[1].split(":");
        sd.setHours(d1t[0]);
        sd.setMinutes(d1t[1])
        sd.setSeconds(d1t[2])
        ed.setHours(d2t[0]);
        ed.setMinutes(d2t[1]);
        ed.setSeconds(d2t[2]);
      }
      return (sd > ed);
    }
  },
  /**
   * 计算d1到d2的天数
   * @param d1 yyyy-mm-dd
   * @param d2 yyyy-mm-dd
   */
  days: function (d1, d2) {
    //获得两个日期之间相差的天数
    var ds1 = d1.split("-"); //将日期字符串分隔为数组,数组元素分别为年.月.日
    var ds2 = d2.split("-");
    //根据年月日的值创建Date对象
    var t1 = new Date(ds1[0], (ds1[1] - 1), ds1[2]).getTime();

    var t2 = new Date(ds2[0], (ds2[1] - 1), ds2[2]).getTime();
    var times = 1000 * 60 * 60 * 24; //每一天的毫秒数
    return Math.floor(((t2 - t1) / times)); //计算出两个日期的天数差
  },
  getQuery: function (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    let context = ''
    if (r != null) {
      context = r[2]
    }
    reg = null
    r = null
    return context === null || context === '' || context === 'undefined' ? '' : context
  },

  error(data) {
    // let loading = Loading.service({});
    // loading.close();
    console.info(data);
    console.log(data);

    let message = '';
    if ('code' in data && 'message' in data) {
      message = `${data.code} ${data.message}`;
    } else if ('statusText' in data) {
      message = `${data.status} ${data.statusText} `;
    } else if ('message' in data) {
      message = data.message;
    } else {
      message = data;
    }

    MessageBox.alert(message, '错误');

  },
  alert(message, options = {title: '提示'}) {
    // let loading = Loading.service({});
    // loading.close();
    MessageBox.alert(message, options);
    //Message.success({showClose: true, message: message, duration: 2000});
  },
  message(message, duration = 2000) {
    Message.success({
      showClose: true,
      message: message,
      duration: duration
    });
  },
  confirm(message, params, options = {type: 'warning',title: '提示'}) {
    let p = new Promise((resolve, reject) => {
      MessageBox.confirm(message, options).then(() => {
        resolve(params)
      }).catch(() => {
        reject(params)
      });
    });
    return p;
  },
  prompt(message, options = { title: '提示'}) {
    let p = new Promise((resolve, reject) => {
      MessageBox.prompt(message, options).then(resolve).catch(reject);
    });
    return p;
  },
  response(data) {
    let p = new Promise((resolve, reject) => {
      if (data.status == 'success') {
        resolve(data);
      } else {
        reject(data);
      }
    });
    return p;
  },


}
