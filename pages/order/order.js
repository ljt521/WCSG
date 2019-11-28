//index.js
var app = getApp()
let pageStart = 0;
let pageSize = 0;
let testData = []

Page({
  data: {
    statusType: [{
        name: "未发货订单",
        requesting: false,
        end: false,
        emptyShow: false,
        page: pageStart,
        listData: [],
        size: pageSize
      },
      {
        name: "已发货订单",
        requesting: false,
        end: false,
        emptyShow: false,
        page: pageStart,
        listData: [],
        size: pageSize
      }
    ],
    noBtnName: {
      waitReview: '审核',
      backTo: '退回',
      waitSign: '签到',
      waitMachine: '报台',
      complete: '完成',
      closeOrder: '关闭'
    },
    currentType: 0,
    windowHeight: '',
    showActionsheet: false, //控制页面+号
    isHiddenSheet: true, //是否显示新建订单按钮，默认显示
    actions: [{
        text: '膝关节常规订单',
        value: "../application-form/application-form?level1=XGJ&applyType=ZCDD",
      },
      {
        text: '髋关节常规订单',
        value: "../application-form/application-form?level1=kGJ&applyType=ZCDD",
      },
      {
        text: '长期寄售订单',
        value: "../application-long-order/application-long-order?applyType=JSDD",
      }
    ],
    refreshStatus: '',
    duration: 300, // swiper-item 切换过渡时间
    userId: ''
  },

  // 获取页面数据
  getList(type, currentPage) {
    let pageData = this.getCurrentData();

    pageData.requesting = true;

    this.setCurrentData(pageData, true);

    wx.showNavigationBarLoading();

    setTimeout(() => {
      pageData.requesting = false;

      wx.hideNavigationBarLoading();

      if (type === 'refresh') {
        pageData.listData = testData;
        pageData.page = currentPage + 1;
      } else {
        pageData.listData = pageData.listData.concat(testData);
        pageData.page = currentPage + 1;
      }
      if (pageData.size >= app.globalData.total && app.globalData.total != 0) {
        pageData.end = true;
      } else {
        pageData.end = false;
      }

      this.setCurrentData(pageData);
    }, 10);
  },

  swichNav: function(res) {
    this.setData({
      duration: 0
    });
    setTimeout(() => {
      this.setData({
        currentType: res.detail.currentNum
      });
    }, 0);
  },


  // 获取当前激活页面的数据
  getCurrentData() {
    return this.data.statusType[this.data.currentType]
  },

  // 判断是否为加载新的页面,如果是去加载数据
  loadData() {
    let pageData = this.getCurrentData();
    if (pageData.listData.length === 0) {
      this.getList('refresh', pageStart);
    }
  },

  onLoad() {
    var that = this;
    var systemInfo = wx.getSystemInfoSync();
    that.setData({
      windowHeight: systemInfo.windowHeight
    });
    wx.getStorage({
      key: 'user',
      success: (res) => {
        app.globalData.user = JSON.parse(res.data);
        that.data.userId = app.globalData.user.id;
        //当角色为分库仓库时，新建订单按钮
        if (app.globalData.user.roles[0].name == 'ROLE_FK_CANGKU') {
          that.setData({
            isHiddenSheet: false
          })
        }
      }
    })


    // 第一次加载延迟 350 毫秒 防止第一次动画效果不能完全体验
    setTimeout(() => {
      that.getList('refresh', pageStart);
    }, 350);
  },

  // 刷新数据
  refresh() {
    this.getCurrentData().page = 0;
    this.getList('refresh', pageStart);
  },
  // 加载更多
  more() {
    this.getList('more', this.getCurrentData().page);
  },


  // 更新页面数据

  setCurrentData(pageData, info) {
    const that = this;
    that.data.statusType[that.data.currentType] = pageData;
    that.setData({
      statusType: that.data.statusType
    })

    if (info) {
      return
    }


    if (that.data.currentType == 0) {
      const data = {
        page: 0,
        size: 10 * that.getCurrentData().page
      }
      that.data.statusType[that.data.currentType].size = data.size;
      app.globalData.$http.search('api/surgeryToolApplyOrderResource/delivered', data).then((order) => {
        if (order) {
          pageData.listData = order;
          that.data.statusType[that.data.currentType] = pageData;
          that.setData({
            statusType: that.data.statusType
          })
        }
      })
    } else {
      const data = {
        page: 0,
        size: 10 * that.getCurrentData().page
      }
      that.data.statusType[that.data.currentType].size = data.size;
      app.globalData.$http.search('api/surgeryToolApplyOrderResource/recycling', data).then((recycling) => {
        if (recycling) {
          pageData.listData = recycling;
          that.data.statusType[that.data.currentType] = pageData;
          that.setData({
            statusType: that.data.statusType
          })
        }
      })
    }
  },


  orderBtnClick: function(e) {
    wx.navigateTo({
      url: `../application-details/application-details?id=${e.detail.currentData.id}`　 // 页面 明细
    })
  },
  clickAllOrder: function (e) {
    wx.navigateTo({
      url: `../order-details/order-details?id=${e.detail.currentData.id}`　 // 页面 明细
    })
  },
  bindChange: function(e) {
    this.setData({
      duration: 300
    });
    setTimeout(() => {
      this.setData({
        currentType: e.detail.current
      });
      this.loadData()
    }, 0);
  },

  add() {
    this.setData({
      showActionsheet: !this.data.showActionsheet
    })

  },
  close: function() {
    this.setData({
      showActionsheet: false
    })
  },
  sheetBtnClick(e) {
    if (e) {
      wx.navigateTo({
        url: e.detail.value　　 // 页面 明细
      })

    }
    this.setData({
      showActionsheet: false
    })


  }
})