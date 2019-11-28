// pages/login/login.js
var app = getApp();
var call = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: true,
    account: '',
    password: '',
    error: '',
    success: '',
    formData: {
      name: '',
      login: '',
      email: '',
      userType: 0,
      password: '',
      mark1: '',
      mark2: '',
      activated: false,
      roles: [{
        "id": 1000010
      }],
      rolesId: 1000010
    },
    rules: [{
        name: 'name',
        rules: {
          required: true,
          message: '姓名必填'
        }
      },
      {
        name: 'login',
        rules: [{
          required: true,
          message: '手机号必填'
        }, {
          mobile: true,
          message: '手机号格式不对'
        }]
      },
      {
        name: 'email',
        rules: [{
          required: true,
          message: '邮箱必填'
        }, {
          email: true,
          message: '邮箱格式不对'
        }]
      },
      {
        name: 'mark1',
        rules: [{
          required: true,
          message: '所属组织必填'
        }]
      },
      {
        name: 'mark2',
        rules: [{
          required: false,
          message: '所属部门必填'
        }]
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(!this.data.login){
      wx.setNavigationBarTitle({
        title: '注册',
      }) 
    } else {
      wx.setNavigationBarTitle({
        title: '登录',
      }) 
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  radioChange(e) {
    this.setData({
      'formData.userType': e.detail.value
    })
    var that = this;
    if (e.detail.value == 1) {
      that.data.rules[that.data.rules.length - 1].rules[0].required = true;
      that.setData({
        rules: that.data.rules
      })
    } else {
      that.data.rules[that.data.rules.length - 1].rules[0].required = false;
      that.setData({
        rules: that.data.rules
      })
    }


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindAccount(e) {
    this.setData({
      account: e.detail.value
    })
  },

  bindPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  inputChange(e) {
    let type = 'formData.' + e.currentTarget.dataset.field;
    let value = e.detail.value;
    this.setData({
      [type]: value
    })
  },

  toRegisterUser() {
    /**
     * 注册时保存信息
     * 调用方法/api/user/{对象实体}
     *
     *
     login:
     name:
     password:
     passwordConfirm
     email:
     mark1:
     mark2:

     userType:
     activated:
     rolesId:
     *
     *
     *
     *
     *
     */
    var that = this;
    this.selectComponent('#form').validate((valid, errors) => {

      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
        return
      }
      console.log(valid);
      const data = {
        name: that.data.formData.mark1
      }
      call.get('api/institution/isCheckName', data).then((info) => {
        //存在则返回实体对象，否则返回空
        if(info) {
          that.setData({
            'formData.password': new Date()
          })
          let obj = that.data.formData;
          obj.mark1 = info.id;
          call.post('api/userOther/registration', obj).then(res => {
            if (res.messageType == "E") {
              that.setData({
                error: res.message
              })
            } else {
              that.setData({
                success: '注册成功'
              });
              wx.reLaunch({
                url: `../register-success/register-success`
              })
            }
          })
        } else {
          that.setData({
            error: '未找到所属组织'
          })
        }

      })
    })

  },

  toRegister(info) {

    wx.reLaunch({
      url: '../loading/loading' // 内部
    })
    wx.showToast({
      title: '校验通过'
    })
  },
  toLogin() {
    const data = {
      username: this.data.account,
      password: this.data.password,
      rememberMe: true
    };
    if (!data.username) {
      this.setData({
        error: '账号不能为空！'
      });
      return
    }
    if (!data.password) {
      this.setData({
        error: '密码不能为空！'
      });
      return
    }

    wx.showLoading({
      title: '登录中...',
      mask: true
    });

    call.post('api/authenticate/?_allow_anonymous=true', data).then((info) => {
      if (info.type == 'validationError') {
        wx.hideLoading();
        this.setData({
          error: info.message
        });
        return
      }

      if (info.type == 'errorVm') {
        wx.hideLoading();
        this.setData({
          error: '账号或密码错误'
        });
        return
      }
      this.doSuccess(info);
    }).catch((err) => {
      // console.log(err);
    });
  },
  doSuccess(e) {
    var that = this;
    if (e.status == 'login') {
      wx.setStorage({
        key: "_token",
        data: "Bearer " + e.msg.id_token
      });
      app.globalData.token = "Bearer " + e.msg.id_token;
      call.tokenData = "Bearer " + e.msg.id_token;
      // 请求当前登录人的信息
      app.globalData.$http.get('api/user/current').then((info) => {
        app.globalData.user = info;
        wx.setStorage({
          key: 'user',
          data: JSON.stringify(info),
          success: () => {
            that.toRegister(info);
          }
        });
      });
      wx.hideLoading();
    }
  },



  instatillCompontValit(e) { //校验公司名称是否存在

  }



  // doFail(e) {
  //   console.log(e);
  // },
  // swichNav(e) {
  //   console.log(e);
  // }
})