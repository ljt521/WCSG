// pages/hospital-infor/hospital-infor.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    cityPickerValue: [0, 0],
    cityPickerIsShow: false,
    search:'',
    hospitalList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search: this.search.bind(this)
    })

  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },
  search: function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{ text: '搜索结果', value: 1 }, { text: '搜索结果2', value: 2 }])
      }, 200)
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
  /**
   * 城市选择确认
   */
  cityPickerOnSureClick: function (e) {
    this.setData({
      city: e.detail.valueName[0] + e.detail.valueName[1],
      cityPickerValue: e.detail.valueCode,
      cityPickerIsShow: false,
    });
    app.globalData.$http.search('api/hospital', { page: 0, size: 20 }, 
    { 
      province: e.detail.valueName[1], 
      city: e.detail.valueName[0]
    }
      ).then((hospital)=>{
      this.setData({
        hospitalList: hospital
      })
    })
    

  },
  /**
   * 城市选择取消
   */
  cityPickerOnCancelClick: function (event) {
    console.log('cityPickerOnCancelClick');
    console.log(event);
    this.setData({
      cityPickerIsShow: false,
    });
  },


  showCityPicker() {
    // this.data.cityPicker.show()
    this.setData({
      cityPickerIsShow: true,
    });
  },
  getHispotalId(e) {
    let index=e.detail.value;
    app.globalData.hospital={
      name: this.data.hospitalList[index].name,
      id: this.data.hospitalList[index].id
    }
    console.log(this.data.hospitalList[index])

  }
})



