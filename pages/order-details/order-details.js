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
    tableName: {
      waitDelivery: '发货',
      waitReview: '审核',
      backTo: '退回',
      waitSign: '签到',
      waitMachine: '报台',
      momentum: '回收',
      complete: '完成',
      closeOrder: '关闭'
    },
    showActuallyDeliveries: {
      waitSign: '签到',
      waitMachine: '报台',
      momentum: '回收',
      complete: '完成'
    },
    dialogShow: false,
    showOneButtonDialog: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    info: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        orderType: info.applicationStatus == 'waitDelivery'
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  // 关闭弹框
  offDialog() {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  }
})