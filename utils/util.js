// 作者 吕俊涛
var app = getApp();

/**
 * http请求，
 * URL：api接口地址
 * method: 请求类型 默认 GET
 * data：参数，json类型
 * header: 请求头
 * success：成功的回调函数
 * fail：失败的回调函数
 */
//相同前缀的url
const baseUrl = app.globalData.url,
  tokenData = app.globalData.token;

function fun(url, method, data, header) {
  data = data || {}
  header = {
    'Content-Type': 'application/json',
    'device': 'wap',
    'Language': 'zh-CN',
    'Authorization': app.globalData.token || tokenData
  }
  method = method

  let promise = new Promise(function(resolve, reject) {
    wx.request({
      url: baseUrl + url,
      header: header,
      method: method,
      data: data,
      success: function(res) {

        if (res.statusCode == 500) {
          wx.showLoading({
            title: '服务器错误',
            mask: true
          });
          setTimeout(function() {
            wx.hideLoading()
          }, 2000)
          return
        }
        //响应拦截
        //通过返回的code参数的不同进行后续不同的操作
        if (res.data.code) {
          //我们后台规定当code为110时，就代表当前没有登录
          if (res.data.code === 110) {
            util.showMessage('登录失效，请重新登录')
            setTimeout(() => {
              //跳转到登录页面
              wx.reLaunch({
                url: '../login/login'
              })
            }, 1000)
            reject(res)
          } else if (res.data.responseCode) {
            let responseCode = res.data.responseCode

            //处理未绑定微信的情况
            if (responseCode === 103) {
              wx.hideToast();
              wx.showModal({
                content: `${app.globalData.responseCode[responseCode]}，即将转到微信绑定页面`,
                showCancel: false,
                confirmText: "确定",
                success() {
                  //转到绑定微信页面
                  wx.reLaunch({
                    url: '../bind/bind'
                  })
                }
              })

              reject(res)
            } else {
              //其他情况，把响应编码对应的提示信息已弹出框形式告知用户
              wx.hideToast();
              wx.showModal({
                content: `${app.globalData.responseCode[responseCode]}`,
                showCancel: false,
                confirmText: "确定"
              })
            }
          }
        }
        if (res['header'] && res['header']['X-Total-Count']) {
          app.globalData.total = res['header']['X-Total-Count'] - 0;
        }
        resolve(res.data)
      },
      fail: function(err) {
        console.log('err')
        reject(err)
      },
      complete: function() {
        //不管是success还是fail都会走这里的函数
        wx.hideToast()
      }
    })
  })
  return promise
};

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../utils/utils.js")  加载  已被放置在全局对象 globalData.$http中
 * 在引入引入文件的时候"  "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */

module.exports = {
  formatTime: formatTime,
  baseUrl: baseUrl,
  tokenData: tokenData,
  "get": function(url, data, header) {
    return fun(url, "get", data, {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': app.globalData.token
    });
  },
  "search": function(url, params = {}, searchData = {}) {
    let stringData = ''
    url = url + '?'
    if (params) {
      Object.keys(params).forEach(function(key) {
        stringData = stringData + `${key}=${params[key]}&`
      })
    }
    if (searchData) {
      Object.keys(searchData).forEach(function(key) {
        if (searchData[key] != 0 || key == 'personId') {
          stringData = stringData + `propertyNames=${key}&propertyValues=${searchData[key]}&`
        }
      })
    }
    return fun(url + stringData, "get", {}, {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': app.globalData.token
    });
  },
  "post": function(url, data, header) {
    return fun(url, "post", data, {
      'content-type': 'application/x-www-form-urlencoded'
    })
  },
  "put": function(url, data, header) {
    return fun(url, "put", data, header);
  },
  "delete": function(url, data, header) {
    return fun(url, "delete", data, header);
  }
}