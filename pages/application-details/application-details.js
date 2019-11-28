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
    info: ''
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
        let forData = [];
        if (that.data.orderType) {
          forData = that.data.orderDetails.listingtools
        } else {
          forData = that.data.orderDetails.actuallyDeliveries
        }
        let obj1 = {};
        let flag = false;
        if (forData.length > 0) {
          forData.forEach((item) => {
            let toolsNo = '',
              toolsName = '';

            if (that.data.orderType) {
              toolsNo = item.toolsNo;
              toolsName = item.toolsName;
            } else {
              toolsNo = item.actuallyToolsCode;
              toolsName = item.actuallyToolsDescription;
            }

            if (toolsNo == scanStr) {
              let obj = {};
              flag = true;
              if (that.data.orderType) {
                obj = {
                  actuallyToolsCode: toolsNo,
                  actuallyToolsDescription: toolsName
                };
              } else {
                obj = {
                  recyclingToolsCode: toolsNo,
                  recyclingToolsDescription: toolsName
                }
              }

              obj1 = JSON.parse(JSON.stringify(obj));

              if (that.data.orderType) {
                that.data.orderDetails.actuallyDeliveries.push(obj1);
              } else {
                that.data.orderDetails.recyclingListings.push(obj1);
              }

              app.globalData.$http.put('api/surgeryToolApplyOrderResource', that.data.orderDetails).then((info) => {
                that.setData({
                  orderDetails: info
                })
              })
            }
          })
          if (!flag) {
            if (that.data.orderType) {
              that.setData({
                info: '发货信息不在kitNo列表中'
              })
            } else {
              that.setData({
                info: '回收信息不在发货列表中'
              })
            }
          }

        } else {
          if (that.data.orderType) {
            that.setData({
              info: 'kitNo列表为空'
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
    if (this.data.orderType) {
      const id = this.data.orderDetails.actuallyDeliveries[i.currentTarget.dataset.index].id;
      app.globalData.$http.delete('api/surgeryToolApplyOrderActuallyDelivery/' + id).then((info) => {
        this.data.orderDetails.actuallyDeliveries = this.data.orderDetails.actuallyDeliveries.filter((item, index) => index != i.currentTarget.dataset.index);
        this.setData({
          orderDetails: this.data.orderDetails
        })
      })
    } else {
      const id = this.data.orderDetails.recyclingListings[i.currentTarget.dataset.index].id;
      app.globalData.$http.delete('api/surgeryToolApplyOrderRecyclingListing/' + id).then((info) => {
        this.data.orderDetails.recyclingListings = this.data.orderDetails.recyclingListings.filter((item, index) => index != i.currentTarget.dataset.index);
        this.setData({
          orderDetails: this.data.orderDetails
        })
      })
    }
  },

  // 判断是否有超出
  confirmShipment() {
    let nameArr = [];
    let oldNameArr = [];
    if (this.data.orderType) {
      const listingtools = this.data.orderDetails.listingtools;
      const actuallyDeliveries = this.data.orderDetails.actuallyDeliveries;
      for (let i = 0; i < listingtools.length; i++) {
        const obj = {
          toolsNo: listingtools[i].toolsNo,
          sum: 0,
          show: false
        };
        nameArr.push(JSON.parse(JSON.stringify(obj)));
        let sum = 0;
        for (let j = 0; j < actuallyDeliveries.length; j++) {
          if (listingtools[i].toolsNo == actuallyDeliveries[j].actuallyToolsCode) {
            nameArr[i].sum = nameArr[i].sum + 1;
            nameArr[i].show = nameArr[i].sum > listingtools[i].toolsCount;
          }
        }
      }
      nameArr = nameArr.filter((item) => item.show);
      if (nameArr.length > 0) {
        this.setData({
          dialogShow: true
        })
      } else {
        const e = {
          detail: {
            index: 1
          }
        };
        this.tapDialogButton(e);
      }
    } else {
      // const actuallyDeliveries = this.data.orderDetails.actuallyDeliveries;
      // const recyclingListings = this.data.orderDetails.recyclingListings;
      // this.data.orderDetails.actuallyDeliveries.forEach((item) => {
      //   nameArr.push(item.actuallyToolsCode);
      // })
      // this.data.orderDetails.recyclingListings.forEach((item) => {
      //   oldNameArr.push(item.recyclingToolsCode);
      // })
      // oldNameArr = oldNameArr.filter((item, index, selft) => oldNameArr.indexOf(item) === index);
      // let flag = false;
      // for (let i = 0; i < oldNameArr.length; i++) {
      //   for (let j = 0; j < nameArr.length; j++) {

      //   }
      // }
      this.setData({
        showOneButtonDialog: true
      })
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

        wx.switchTab({
          url: '../order/order', // 内部
          success: function() {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad(); //重新刷新页面
          }
        })
        wx.hideLoading();
      },
    })
  }
})