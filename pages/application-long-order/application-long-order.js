// pages/application-long-order/application-long-order.js
const app = getApp()

Page({
  data: {
    showItem: false,
    number:1,
    region: [],
    statusType: [
      { name: "全髋", page: 0 },
      { name: "半髋", page: 0 },
    ],
    slideButtons: [{ text: '删除', extClass: 'test', type: 'warn',}],
    currentType: 0,
    showNextStep: false,
    rules: [
      { name: 'stockingHospital', rules: { required: true, message: '备货医院必填' } },
      { name: 'receivingAddress', rules: { required: true, message: '收货地址必填' } },
      { name: 'receivingPhone', rules: [{ required: true, message: '手机号必填' }, { mobile: true, message: '手机号必填格式不对' }],}
    ],
    formData: {
      applyType: '', //分为常规订单和长期寄售订单，字典表【订单类型】code数据	ZCDD/CQJS 在初始化的时候 做的
      stockingHospital: '', //医院id
      organizationName: '',
      consignee: '', //收货人
      receivingPhone: '',
      receivingAddress: '',
      hospitalName: '',
      listingtools: [],
      remark: ''
    },
    hospital: {
      name: '',
      id: ''
    },
    hospitals: [],
    listingtools:[],
    i:0,
    error:''
  },

  onLoad: function (options) {
    this.setData({
      ['formData.applyType']: options.applyType,
    })
    var systemInfo = wx.getSystemInfoSync();
    this.getReceivingInfo()
  },
  addressInputChange(e) {
    this.setData({
      ['formData.receivingAddress']: e.detail.value,
    })
  },
  addCool(){
    // 增加数据
   let  list= [...this.data.listingtools, {
      key: `${this.data.i}`,
      kitNo:'',
      kitNoDescription: '',
      kitNoCount: 1
    }];
    let i = this.data.i;
    this.setData({
      'listingtools': list,
      i:i+1,
    })
  },


  del(e){
    
     // 删除数据
    let key = e.currentTarget.dataset.key;
    let list = this.data.listingtools.filter(d => d.key != key);
    this.setData({
      'listingtools': list
    })
  },
  onShow() {
    this.setData({
      'hospital.name': app.globalData.hospital.name,
      'hospital.id': app.globalData.hospital.id,
      'formData.stockingHospital': app.globalData.hospital.id
    })
  },
  consigneeInputChange(e) {
    this.setData({
      ['formData.consignee']: e.detail.value,
    })
  },
  receivingPhoneInputChange(e) {
    this.setData({
      ['formData.receivingPhone']: e.detail.value,
    })
  },
  bindHospitalChange(e) {
    this.setData({
      hospitalIndex: e.detail.value,
      ['formData.hospitalName']: this.data.hospitals[e.detail.value].name,
      ['formData.stockingHospital']: this.data.hospitals[e.detail.value]
    })
    // wx.navigateTo({
    //   url: '../hospital-infor/hospital-infor' // 医院信息
    // })
  },
  formBlurChange(e){
    let index = e.currentTarget.dataset.index;
    let kekitNoDescription = 'listingtools[' + index + '].kitNoDescription';
    let kitNo = 'listingtools[' + index + '].kitNo';
    this.setData({
      [kitNo]: e.detail.value,
      [kekitNoDescription]: ''//初始化
    })

    if(e.detail.value){
      app.globalData.$http.get('api/standardPackage/getOneByKitNo/' + e.detail.value).then((res) => {
        if(res){
          this.setData({
            [kekitNoDescription]:res.name
          })
        }
      })

    }


  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        if (this.data.listingtools.length==0){
          this.setData({
            error: '工具清单必填'
          })
          return
        }
        this.setData({
          'formData.listingtools': this.data.listingtools
        })
        app.globalData.$http.post('api/surgeryToolApplyOrderResource', this.data.formData).then(() => {
          wx.showToast({
            title: '新建成功'
          })
          wx.switchTab({
            url: '../order/order'
          })
        })
      }
    })
  },



  nextStep() {
    this.setData({
      showNextStep: !this.data.showNextStep
    })
  },
  showMore() {
    this.setData({
      showItem: !this.data.showItem
    });
  },
  swichNav: function (res) {
    if (this.data.currentType == res.detail.currentNum) return;
    this.setData({
      currentType: res.detail.currentNum
    });
  },
  bindChange: function (e) {
    this.setData({
      currentType: e.detail.current
    })
    if (!this.data.list[e.detail.current].length)
      this.getList();
  },
  bindRegionChange: function (e) {
    let addressList = e.detail.value;
    let address = '';
    addressList.forEach((val, i) => {
      if (i > 0) {
        address += val;
      }
    })

    this.setData({
      region: e.detail.value,
      'formData.receivingAddress': address
    })
  },
  clickNumber(e){
    let index = e.currentTarget.dataset.index;
    let key = 'listingtools[' + index + '].kitNoCount';
    this.setData({
      [key]: e.detail.number
    })
  },
  getaddressDetails(e) {
    this.setData({
      'formData.remark': e.detail.value
    })

  },
  getReceivingInfo() {
    wx.getStorage({
      key: 'user',
      complete: (res) => {
        if (res.data) {
          let receivingInfo = JSON.parse(res.data);
          app.globalData.$http.get('api/institution/' + receivingInfo.mark1).then((info) => {
            this.setData({
              ['formData.organizationName']: info.organizationName,
              ['formData.consignee']: info.contacter,
              ['formData.receivingPhone']: info.phoneNumber,
              ['formData.receivingAddress']: info.address,
              ['hospitals']: info.hospitals,
            })

          })
        }

      }
    })
  },


})
