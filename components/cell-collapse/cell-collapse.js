//组件的对外属性，是属性名到属性设置的映射表，属性设置中可包含三个字段， type 表示属性类型、 value 表示属性初始值、 observer 表示属性值被更改时的响应函数
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    // 是否展开
    iscollapse: {
      type: Boolean,
      value: true
    },
    text: {
      type: String,
      value: ''
    },
    ismargin: {
      type: Boolean,
      value: true
    },
    ispadding: {
      type: Boolean,
      value: false,
    },
    isbackground: {
      type: Boolean,
      value: true
    },
    isborderradius: {
      type: Boolean,
      value: true,
    },
    isfooter: {
      type: Boolean,
      value: true,
    },
    isback2: {
      type: Boolean,
      value: false,
    },

  },
  data: {
    show: false
  },
  //组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用
  methods: {
    // 内部方法建议以下划线开头
    _collapseChange: function(e) {
      switch (this.data.iscollapse) {
        case true:
          console.log(this.data)
          this._collapseHandler();
          break;
        case false:
      }


    },
    _collapseHandler() {
      this.setData({
        show: !this.data.show
      })
      this.triggerEvent('collapseChange',{
        show:this.data.show
      })
    },
  }
})