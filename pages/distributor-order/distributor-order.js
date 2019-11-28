// 作者 吕俊涛
const app = getApp()
let pageStart = 0;
let pageSize = 0;
let testData = []

Page({
  data: {
    ips: [],
    noBtnName: {
      waitDelivery: '发货',
      waitReview: '审核',
      backTo: '退回',
      momentum: '回收',
      complete: '完成',
      closeOrder: '关闭'
    },
    statusType: [{
        name: "正常订单",
        requesting: false,
        end: false,
        emptyShow: false,
        page: pageStart,
        listData: [],
        screen: {},
        size: pageSize
      },
      {
        name: "长期寄售",
        requesting: false,
        end: false,
        emptyShow: false,
        page: pageStart,
        listData: [],
        screen: {},
        size: pageSize
      }
    ],
    currentType: 0,
    windowHeight: '',
    showActionsheet: false,
    actions: [{
        text: '膝关节常规订单',
        value: "../application-form/application-form?level1=XGJ&applyType=ZCDD",
      },
      {
        text: '髋关节常规订单',
        value: "../application-form/application-form?level1=KGJ&applyType=ZCDD",
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
  //////////////////////////////////
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
    const that = this;
    this.setData({
      duration: 0,
      currentType: res.detail.currentNum,
    });
    this.data.currentType = res.detail.currentNum;
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
    this.setData({
      windowHeight: systemInfo.windowHeight
    });
    wx.getStorage({
      key: 'user',
      success: (res) => {
        app.globalData.user = JSON.parse(res.data);
        that.data.userId = app.globalData.user.id;
      }
    });
    app.globalData.$http.get('api/dict-tables/search-with-list', {
      dictCode: 'DDZT'
    }).then((info) => {
      for (var i = 0; i < info.dictItems.length; i++) {
        info.dictItems['isSelect'] = false;
      }
      info.dictItems.unshift({
        showSort: "0",
        value: "全部",
        isSelect: true
      });
      this.setData({
        ips: info.dictItems
      })
    });
    // 第一次加载延迟 350 毫秒 防止第一次动画效果不能完全体验
    setTimeout(() => {
      this.getList('refresh', pageStart);
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
      // const data2 = {"applicationStatus": ""}
      that.data.statusType[that.data.currentType].size = data.size;
      app.globalData.$http.search('api/surgeryToolApplyOrderResource/normalOrder', data, that.data.statusType[that.data.currentType].screen).then((info) => {
        pageData.listData = info;
        that.data.statusType[that.data.currentType] = pageData;
        that.setData({
          statusType: that.data.statusType
        })
      })
    } else {
      const data1 = {
        page: 0,
        size: 10 * that.getCurrentData().page
      }
      that.data.statusType[that.data.currentType].size = data1.size;
      app.globalData.$http.search('api/surgeryToolApplyOrderResource/termConsignment', data1, that.data.statusType[that.data.currentType].screen).then((info) => {
        pageData.listData = info;
        that.data.statusType[that.data.currentType] = pageData;
        that.setData({
          statusType: that.data.statusType
        })
      })
    }
  },

  orderBtnClick: function(e) {
    wx.navigateTo({
      url: `../distributor-details/distributor-details?id=${e.detail.currentData.id}` // 功能
    })
  },
  clickAllOrder: function(e) {
    wx.navigateTo({
      url: `../order-details/order-details?id=${e.detail.currentData.id}`　 // 页面 明细
    })
  },
  bindChange: function(e) {
    const that = this;
    this.setData({
      duration: 300,
      currentType: e.detail.current
    });
    this.data.ips.forEach((item) => {
      if (this.data.statusType[e.detail.current].screen.applicationStatus) {
        if (item.code == this.data.statusType[e.detail.current].screen.applicationStatus) {
          item.isSelect = true;
        } else {
          item.isSelect = false;
        }

      } else {
        if (item.showSort == '0') {
          item.isSelect = true;
        } else {
          item.isSelect = false;
        }
      }
    });
    setTimeout(() => {
      this.setData({
        ips: that.data.ips
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


  },
  swichTabNav(e) {
    let data = {};
    if (e.detail.currentNum.value != '全部') {
      data = {
        applicationStatus: e.detail.currentNum.code
      }
    }
    this.data.statusType[this.data.currentType].screen = JSON.parse(JSON.stringify(data));
    const that = this;
    this.setData({
      statusType: that.data.statusType
    })
    that.getList('refresh', pageStart);
  }

})