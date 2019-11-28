// pages/application-details/application-details.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFlag: true,
    orderDetails: '',
    orderId: '',
    showLoading: false,
    orderType: true,

    dialogShow: false,
    showOneButtonDialog: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    info: '',
    locaData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '获取数据中...',
      mask: true
    });
    this.setData({
      orderId: options.id
    })
    this.loadDetail(options.id); // 拿到列表页传过来的 id
  },

  loadDetail(id) {
    app.globalData.$http.get('api/surgeryToolApplyOrderResource/' + id).then((info) => {
      this.setData({
        orderDetails: info,
        orderType: info.applicationStatus == 'waitSign'
      });
      wx.hideLoading();
    });
  },

  showMore(show) {
    this.setData({
      showFlag: !this.data.showFlag
    })
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

  // 扫码
  scanClick() {

    let that = this;
    wx.scanCode({
      success(res) {
        const scanStr = res.result.split('-')[0];
        let forData = that.data.orderDetails.actuallyDeliveries;

        if (forData.length > 0) {
          let flag = false;
          let obj = {};
          forData.forEach((item) => {
            let toolsNo = item.actuallyToolsCode;
            if (toolsNo == scanStr) {
              flag = true;
              obj = JSON.parse(JSON.stringify(item));
            }
          })
          if (flag) {
            that.data.locaData.push(obj);
            that.setData({
              locaData: that.data.locaData
            })
          } else {
            if (that.data.orderType) {
              that.setData({
                info: '扫码信息不在签到列表中'
              })
            } else {
              that.setData({
                info: '扫码信息不在发货列表中'
              })
            }
          }
        } else {
          if (that.data.orderType) {
            that.setData({
              info: '签到列表为空'
            })
          } else {
            that.setData({
              info: '发货列表为空'
            })
          }
        }
      }
    })
  },

  // 删除当前信息 i 为索引
  deleteList(i) {
    this.data.locaData = this.data.locaData.filter((item, index) => index != i.currentTarget.dataset.index);
    this.setData({
      locaData: this.data.locaData
    })
  },

  // 判断是否有超出
  confirmShipment() {
    wx.showLoading({
      title: '提交中...',
      mask: true
    });
    if (this.data.orderType) {
      app.globalData.$http.get('api/surgeryToolApplyOrderResource/waitSign/' + this.data.orderId).then((info) => {
        if (info.status == 0) {
          this.setData({
            info: info.message
          });
          this.toPage();
        } else {
          this.setData({
            info: '签到失败'
          })
          wx.hideLoading();
        }
      });
    } else {
      app.globalData.$http.get('api/surgeryToolApplyOrderResource/momentum/' + this.data.orderId).then((info) => {
        if (info.status == 0) {
          this.setData({
            info: info.message
          });
          this.toPage();
        } else {
          this.setData({
            info: '报台失败'
          })
          wx.hideLoading();
        }
      });
    }

  },
  // 确认发货数据
  tapDialogButton(e) {
    var _this = this;

    this.offDialog();

    if (e.detail.index == 1) {

      wx.showLoading({
        title: '提交中...',
        mask: true
      });

      app.globalData.$http.get('api/surgeryToolApplyOrderResource/checkIn/' + this.data.orderId).then((info) => {
        // 请求当前登录人的信息
        _this.toPage();
      });
    }
  },

  // 确认回收数据

  tapOneDialogButton(e) {
    this.offDialog();
    if (e.detail.index == 1) {
      wx.showLoading({
        title: '提交中...',
        mask: true
      });
      app.globalData.$http.get('api/surgeryToolApplyOrderResource/complete/' + this.data.orderId).then((info) => {
        // 请求当前登录人的信息
        this.toPage();
      });
    }
  },


  // 关闭弹框
  offDialog() {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  },

  // 跳转页面
  toPage() {
    // 请求当前登录人的信息
    wx.getStorage({
      key: 'user',
      success: function(res) {
        const info = JSON.parse(res.data);
        wx.reLaunch({
          url: `../distributor-order/distributor-order`
        })
        wx.hideLoading();
      },
    })
  }
})