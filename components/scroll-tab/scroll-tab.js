// 作者： 吕俊涛
Component({

  properties: {
    //标题列表
    tList: {
      type: Array,
      value: []
    },
    //当前tab index
    currentTab: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal) {
        this.setData({
          currentTab: newVal
        })
      }
    }
  },

  //组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用
  methods: {

    _onIpItemClick: function(e) {
      this.ipItemClick(e);
      //自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项
      this.triggerEvent('changeCurrent', {
        currentNum: e.target.dataset.item
      })
    },
    /**
     * item点击事件
     */
    ipItemClick: function(event) {
      var id = event.currentTarget.dataset.item.showSort;
      var curIndex = 0;
      for (var i = 0; i < this.data.tList.length; i++) {
        if (id == this.data.tList[i].showSort) {
          this.data.tList[i].isSelect = true;
          curIndex = i;
        } else {
          this.data.tList[i].isSelect = false;
        }
      }
      this.setData({
        content: this.data.tList[curIndex].value,
        tList: this.data.tList,
      })
    }
  }
})