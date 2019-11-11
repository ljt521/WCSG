//index.js
const app = getApp()

Page({
  data: {
    statusType: [{
        name: "待发货",
        page: 0
      },
      {
        name: "待回收",
        page: 0
      }
    ],
    orderList: [],
    currentType: 0,
    list: [
      [],
      []
    ],
    windowHeight: ''
  },

  onLoad: function(options) {
    var systemInfo = wx.getSystemInfoSync();
    this.setData({
      windowHeight: systemInfo.windowHeight,
      currentType: options.id ? options.id : 0,
      orderList: [{
          title: "JXS20191018001",
          name: "髋关节-全髋",
          status: "待发货",
          company: "上海海洋医疗器械有限公司",
          Hospital: "中国人民总医院第三医学中心"
        },
        {
          title: "JXS20191018002",
          name: "大脑-全大脑",
          status: "待发货",
          company: "上海强哥医疗器械有限公司",
          Hospital: "中国人民总医院第一医学中心"
        },
        {
          title: "JXS20191018003",
          name: "大脑-全大脑",
          status: "待发货",
          company: "上海强哥医疗器械有限公司",
          Hospital: "中国人民总医院第一医学中心"
        },
        {
          title: "JXS20191018004",
          name: "大脑-全大脑",
          status: "待发货",
          company: "上海强哥医疗器械有限公司",
          Hospital: "中国人民总医院第一医学中心"
        },
        {
          title: "JXS20191018005",
          name: "大脑-全大脑",
          status: "待发货",
          company: "上海强哥医疗器械有限公司",
          Hospital: "中国人民总医院第一医学中心"
        }
      ]
    })
  },
  swichNav: function(res) {
    if (this.data.currentType == res.detail.currentNum) return;
    this.setData({
      currentType: res.detail.currentNum
    });
  },
  orderBtnClick: function(orderInfo) {
    console.log(orderInfo);
    wx.navigateTo({
      url: '../application-details/application-details'　　 // 页面 明细
    })
  },
  bindChange: function(e) {
    this.setData({
      currentType: e.detail.current
    })
    if (!this.data.list[e.detail.current].length)
      this.getList();
  },
  getList() {
    wx.showLoading();
    if (this.data.currentType == 0) {
      this.setData({
        orderList: [{
            title: "JXS20191018001",
            name: "髋关节-全髋",
            status: "待发货",
            company: "上海海洋医疗器械有限公司",
            Hospital: "中国人民总医院第三医学中心"
          },
          {
            title: "JXS20191018002",
            name: "大脑-全大脑",
            status: "待发货",
            company: "上海强哥医疗器械有限公司",
            Hospital: "中国人民总医院第一医学中心"
          },
          {
            title: "JXS20191018003",
            name: "大脑-全大脑",
            status: "待发货",
            company: "上海强哥医疗器械有限公司",
            Hospital: "中国人民总医院第一医学中心"
          },
          {
            title: "JXS20191018004",
            name: "大脑-全大脑",
            status: "待发货",
            company: "上海强哥医疗器械有限公司",
            Hospital: "中国人民总医院第一医学中心"
          },
          {
            title: "JXS20191018005",
            name: "大脑-全大脑",
            status: "待发货",
            company: "上海强哥医疗器械有限公司",
            Hospital: "中国人民总医院第一医学中心"
          }
        ]
      })
    } else {
      this.setData({
        orderList: [{
            title: "JXS20191018001",
            name: "髋关节-全髋",
            status: "待回收",
            company: "上海海洋医疗器械有限公司",
            Hospital: "中国人民总医院第三医学中心"
          },
          {
            title: "JXS20191018002",
            name: "大脑-全大脑",
            status: "长期寄存",
            company: "上海强哥医疗器械有限公司",
            Hospital: "中国人民总医院第一医学中心"
          },
          {
            title: "JXS20191018003",
            name: "大脑-全大脑",
            status: "待签到",
            company: "上海强哥医疗器械有限公司",
            Hospital: "中国人民总医院第一医学中心"
          },
          {
            title: "JXS20191018004",
            name: "大脑-全大脑",
            status: "待回收",
            company: "上海强哥医疗器械有限公司",
            Hospital: "中国人民总医院第一医学中心"
          },
          {
            title: "JXS20191018005",
            name: "大脑-全大脑",
            status: "待回收",
            company: "上海强哥医疗器械有限公司",
            Hospital: "中国人民总医院第一医学中心"
          }
        ]
      })
    }
    wx.hideLoading();
  }
})