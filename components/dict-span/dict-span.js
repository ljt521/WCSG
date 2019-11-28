// components/dict-span/dict-span.js
Component({
  properties: {
    dictCode: {
      type: String,
      value: ''
    },
    dictItemCode: {
      type: String,
      value: ''
    },
    index: {
      type: Number,
      value: -1
    },
  },
  data: {
    message: ''
  },
  ready: function ready() {
    this.getDictDetailsAll();
  },
  methods: {
    //1. 获取所有的 字典表明细
    getDictDetailsAll() {
      let that = this;
      if (this.data.index != -1) {
        this.data.dictItemCode = this.data.dictItemCode ? this.data.dictItemCode.split('-')[this.data.index] : this.data.dictItemCode;
      }
      wx.getStorage({
        key: that.data.dictCode,
        success: (res) => {
          res.data.forEach(val => {
            if (val.code == that.data.dictItemCode) {
              that.setData({
                message: val.value
              });
            }
          })
        },
        fail: (res) => {
          //新增缓存 
          this.addCache()
        }
      })
    },
    addCache() {
      //新增缓存 
      $http.get('api/dict-tables/search-with-list', {
        dictCode: this.data.dictCode
      }).then((dictDetailsAll) => {
        // 1.获取 对应dictCode的字典 数组列表
        // 2. 缓存 {dictCode:[]} 

        dictDetailsAll.dictItems.forEach(val => {
          if (val.code == this.data.dictItemCode) {
            this.setData({
              message: val.value
            });
          }
        })
        wx.setStorage({
          key: this.data.dictCode,
          data: dictDetailsAll.dictItems
        })

      }).catch((err) => {});
    }
  }
});
var $http = require("../../utils/util.js")