// pages/loading/loading.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _that = this;
    // 获取缓存token
    wx.getStorage({
      key: '_token',
      success(res) {
        app.globalData.token = res.data;
        // 请求当前登录人的信息
        wx.getStorage({
          key: 'user',
          success: function(res) {
            const info = JSON.parse(res.data);
            //获取用户角色
            let role = info.roles[0];
            if (role.name == 'ROLE_FK_CANGKU') {
              wx.switchTab({
                url: '../order/order'
              })
            } else {
              wx.reLaunch({
                url: `../distributor-order/distributor-order`
              })
            }
          },
        })
      },
      fail(info) {
        wx.reLaunch({
          url: '../login/login'
        });
      }
    });
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

  }
})
