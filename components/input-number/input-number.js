Component({
  properties: {
    number: Number ,
    min:Number,
    disabled:{
      type: Boolean,
      value:false,
    },
    datail: {
      type: Object,
      value: {}
    }
  },
  data:{},
  //组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用
  methods: {
    getNumber(e){
      if(!this.data.disabled){
        let number = e.detail.value * 1
        if (this.data.min != 'undifend') {
          number < this.data.min ? number = this.data.min : number
        }
        this.setData({
          number: number
        })
        this.triggerEvent('clickNumber', {
          number: this.data.number,
          allowMultiple: this.data.disabled,
        })

      }

    },
    // 内部方法建议以下划线开头
    _sub: function (e) {
      //自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项
      // 可操作前提下 
      if(!this.data.disabled){
        let number = this.data.number - 1;
        if (this.data.min != 'undifend') {
          number < this.data.min ? number = this.data.min : number
        }

        this.setData({
          number: number
        })
        this.triggerEvent('clickNumber', {
          number: this.data.number,
          allowMultiple: this.data.disabled,
          tyname: e.currentTarget.dataset.tyname,
          datail: this.data.datail
        })

      }

    },
    _add: function (e) {
      if(!this.data.disabled){
        let number = this.data.number + 1;
        this.setData({
          number: number,
          allowMultiple: this.data.disabled,
          tyname: e.currentTarget.dataset.tyname
        })
        //自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项
        this.triggerEvent('clickNumber', {
          number: this.data.number,
          tyname: e.currentTarget.dataset.tyname,
          datail: this.data.datail
        })
      }

    }
  }
})