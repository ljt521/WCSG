App({
  globalData: {
    appid: 'wx7f87cf69da7b140a', //appid需自己提供，此处的appid我随机编写
    secret: '392ace4bb8c92a44a1ff4d30803418a5', //secret需自己提供，此处的secret我随机编写
    url: 'http://192.168.1.142:8080/',
    userInfo: '',
    token: '',
    $http: '',
    user: '',
    hospital:{
      name:'',
      id:''
    },
    total: 0
  },
  onLaunch: function() {
    // 展示本地存储能力
    var _that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.getStorage({
      key: '_token',
      success(resData) {
        _that.globalData.token = resData.data;
        //字典表版本号   缓存与更新
        wx.getStorage({
          key: 'version',
          complete: (res) => {
            let newVersion = '';
            let oldVersion = '';
            _that.getDictTableVersionNumber().then(version => {
              newVersion = version.version;
              // 是否存在版本号    对比版本号  是否移除旧版本字典缓存  并存入新的版本号
              if (res.data) {
                oldVersion = res.data;
                // 版本号相同  无操作
                if (newVersion != oldVersion) {
                  //版本号不同   移除所有的字典主表的缓存  并存入新的版本号
                  $http.get('api/dict-tables/all').then(info => {
                    (info || []).forEach((val, i) => {
                      try {
                        wx.removeStorageSync(val.code);
                      } catch (e) {
                        console.log(e);
                      }
                    })
                    // 存入新的版本号
                    wx.setStorage({
                      key: "version",
                      data: version.version
                    })

                  })
                }
              } else {
                // 不存在值   存入版本号
                wx.setStorage({
                  key: "version",
                  data: version.version
                })
              }
              wx.navigateTo({
                url: '../pages/loading/loading'
              });
            }).catch(err => {
              console.log("获取版本号出错：" + err);
            })
          }
        })

      },
      fail(info) {
        console.log('fail');
        wx.navigateTo({
          url: '../pages/login/login'
        });
      }
    });
    wx: wx.getSystemInfo({
      success: (res) => {
        _that.systemInfo = res;
      }
    });




    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var d = _that.globalData; //这里存储了appid、secret、token串 
        var oppIdUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
        // wx.request({
        //   url: oppIdUrl,
        //   data: {},
        //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
        //   // header: {}, // 设置请求的 header 
        //   success: function(res) {
        //     var obj = {};
        //     obj.openid = res.data.openid;
        //     obj.expires_in = Date.now() + res.data.expires_in;
        //     //console.log(obj);
        //     wx.setStorageSync('user', obj); //存储openid 
        //   }
        // });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(globalData);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onLoad: function(options) {

  },
  // 1.获取字典表版本号  
  getDictTableVersionNumber() {
    return new Promise((resolve, reject) => {
      $http.get('api/dict-tables/version').then((version) => {
        console.log("version:", version)
        resolve(version)
      }).catch((err) => {
        reject(err)
      });
    })
  },





})
var app = getApp();
var $http = require("./utils/util.js")
app.globalData.$http = $http;