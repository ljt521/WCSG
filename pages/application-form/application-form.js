const app = getApp()
Page({
  data: {
    showItem: false,
    show: false,
    spDetailsShow: false,
    prodDetailsShow: false,
    isLevel3Clicked: false,
    itemIndex: 0,
    level3: [],
    level4: [],
    places: [{
      name: 'JK',
      value: 'JK',
      checked: true
    }, {
      name: 'GC',
      value: 'GC'
    }],
    statusType: [],
    hospital: {
      name: '',
      id: ''
    },
    region: [],
    slideButtons: [{
      text: '删除',
      extClass: 'test',
      type: 'warn',
    }],
    error: '',
    formData: {
      applyType: '', //分为常规订单和长期寄售订单，字典表【订单类型】code数据	ZCDD/CQJS 在初始化的时候 做的
      surgeryType: '', //一级按钮code-二级按钮code，例如：ZX01-XX02   在初始化的时候 做的
      hospital: '', //医院对象
      organizationName: '',
      consignee: '', //收货人
      receivingPhone: '',
      receivingAddress: '',
      hospitalName: '',
      surgeon: '',
      listingtools: [],
      listingProducts: [],
      remark: ''
    },
    currentType: 0,
    currentLevel1: '',
    currentLevel2: '',
    currentdomestic: '',
    currentLevel3: '',
    currentLevel4: '',
    prodDetails: [],
    spDetails: [],
    showNextStep: false,
    rules: [{
      name: 'hospital',
      rules: {
        required: true,
        message: '医院名称必填'
      }
    },
    {
      name: 'surgeon',
      rules: {
        required: true,
        message: '主刀医生必填'
      }
    }
    ],
    level2DetailsList: {},
    level4DetailsList: [],
    hospitals: [],
    hospitalIndex: '',
  },

  onLoad: function (options) {
    this.setData({
      "currentLevel1": options.level1,
      ['formData.applyType']: options.applyType,
      "currentLevel2": 'AX',
      "currentdomestic": 'JK',
      "currentLevel3": 'DP',
      "currentLevel4": 'DP',
    })
    var systemInfo = wx.getSystemInfoSync();
    this.getReceivingInfo();
    this.getAllCategory(options);
    this.getLevel2Details();
  },
  onShow() {
    this.setData({
      'hospital.name': app.globalData.hospital.name,
      'hospital.id': app.globalData.hospital.id,
      'formData.hospital': app.globalData.hospital.id
    })
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
  getaddressDetails(e) {
    this.setData({
      'formData.remark': e.detail.value
    })

  },
  formInputChange(e) {
    this.setData({
      ['formData.surgeon']: e.detail.value
    })
  },
  getAllCategory(urlInfo) {
    this.setData({
      show: true
    })
    app.globalData.$http.get('api/operationToolRelation/getAllCategory').then((info) => {


      this.data.allCategoryList = JSON.parse(JSON.stringify(info));
      // 获取二级菜单   三级菜单  四级菜单
      this.initLeve(info, ['level2'], [this.data.currentLevel1]);
      this.initecurrentLevel2();
      this.initLeve(info, ['level2', 'domestic'], [this.data.currentLevel1, this.data.currentLevel2]); //国产是写死的
      this.initLeve(info, ['level2', 'domestic', 'level3'], [this.data.currentLevel1, this.data.currentLevel2, 'JK']);
      this.initecurrentLevel3();
      this.initLeve(info, ['level2', 'domestic', 'level3', 'level4'], [this.data.currentLevel1, this.data.currentLevel2, 'JK', this.data.currentLevel3]);

      this.setData({
        show: false
      })

    }).catch((err) => {

    });
  },
  initecurrentLevel2() {
    if (this.data.statusType.length) {
      this.data.currentLevel2 = this.data.statusType[0].name;
    }
  },
  initecurrentLevel3() {
    if (this.data.level3.length) {
      this.data.currentLevel3 = this.data.level3[0].name;
    }
    // 默认初始化的  时候  获取4级所有的明细
    this.getLevel4Details()
  },

  // 初始化
  initLeve(totalData, levelArray, checkedLevelList) {
    let info = JSON.parse(JSON.stringify(totalData));
    let levleNameList = ['level1', 'level2', 'domestic', 'level3', 'level4'];
    let length = levelArray.length - 1;
    let leveList = [];
    //菜单切换的  初始化  对应的菜单数组
    switch (levelArray[length]) {
      case 'level2':
        this.setData({
          statusType: []
        })
        break;
      // case 'domestic':
      //   this.setData({
      //     places: []
      //   })
      //   break;
      case 'level3':
        // 防止 level4没有值的存在
        this.setData({
          level3: []
        });
        break;
      case 'level4':
        this.setData({
          level4: []
        })
        break;
    }

    for (let i = 0; i < levelArray.length; i++) {
      // 按级别遍历  得到 想要的数据  列表
      info = (info || []).filter(val => val[levleNameList[i]] == checkedLevelList[i]);
      if (i == levelArray.length - 1) {
        //赋值
        info.forEach((val, i) => {
          leveList = leveList.filter(item => item.name != val[levelArray[length]])
          switch (levelArray[length]) {
            case 'level2':
              leveList.push({
                name: val[levelArray[length]],
                page: 0,
                isDictCode: true,
                dictCode: 'level2',
                dictItemCode: val[levelArray[length]]
              })
              break;
            case 'domestic':
              if (val[levelArray[length]]) {
                if (val[levelArray[length]] == 'JK') {
                  leveList.push({
                    name: val[levelArray[length]],
                    value: val[levelArray[length]],
                    checked: true
                  })
                } else {
                  leveList.push({
                    name: val[levelArray[length]],
                    value: val[levelArray[length]],
                    checked: false
                  })
                }
              }
              break;
            case 'level3':
              if (val[levelArray[length]]) {
                leveList.push({
                  name: val[levelArray[length]],
                  value: val[levelArray[length]]
                })
              }
              break;
            case 'level4':
              if (val[levelArray[length]]) {
                leveList.push({
                  name: val[levelArray[length]],
                  value: val[levelArray[length]],
                  checked: false,
                  isNumberTapActived: false,
                  count: 1,
                  allowMultiple: val.allowMultiple
                })
              }
              break;
          }



          // console.log('菜单切换:',levelArray[length],)

          if (i == info.length - 1) {
            // 当产地 只有一个时，设置被选中
            if (levelArray[length] == "domestic") {
              if (leveList.length == 1) {
                leveList[0].checked = true;
              }
            }
            // console.log(leveList,66666)



            leveList.forEach((val, i) => {
              let key;
              switch (levelArray[length]) {
                case 'level2':
                  key = 'statusType[' + i + ']';
                  break;
                // case 'domestic':
                //   key = 'places[' + i + ']';
                //   break;
                case 'level3':
                  key = 'level3[' + i + ']';
                  break;
                case 'level4':
                  key = 'level4[' + i + ']';
                  break;
              }


              this.setData({
                [key]: val
              })
            })

          }
        })
      }
    }
  },

  collapsespChange(e) {
    this.setData({
      spDetailsShow: e.detail.show
    })
  },
  collapseproChange(e) {
    this.setData({
      prodDetailsShow: e.detail.show
    })
  },
  clickItem(e) {
    this.setData({
      itemIndex: e.currentTarget.dataset.index,
      currentLevel3: this.data.level3[e.currentTarget.dataset.index].name,
    })
    this.initLeve(this.data.allCategoryList, ['level2', 'domestic', 'level3', 'level4'], [this.data.currentLevel1, this.data.currentLevel2, this.data.currentdomestic, this.data.currentLevel3]);
    // 获取对应的清单数组  当复选框被选中 或者 取消时   刷新页面数据
    this.getLevel4Details();
    this.getLevel2Details();

  },
  slideButtonTap(e) {
    console.log(e)
  },
  placeChange: function (e) {
    this.setData({
      currentdomestic: e.detail.value,
    });
    this.initLeve(this.data.allCategoryList, ['level2', 'domestic', 'level3'], [this.data.currentLevel1, this.data.currentLevel2, this.data.currentdomestic]);
    this.initecurrentLevel3();
    this.initLeve(this.data.allCategoryList, ['level2', 'domestic', 'level3', 'level4'], [this.data.currentLevel1, this.data.currentLevel2, this.data.currentdomestic, this.data.currentLevel3]);
    this.getLevel2Details();
  },
  clickNumber(e) {
    let index = e.currentTarget.dataset.index;
    let key = 'level4[' + index + '].count';
    this.setData({
      [key]: e.detail.number
    })

    this.getclickNumberFinallyList(e)
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
  addressInputChange(e) {
    this.setData({
      ['formData.receivingAddress']: e.detail.value,
    })
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
        // 将 工具清单  和 列表清单  的值对应  转换一下
        //将  surgeryType  进行  一级按钮  和二级按钮  -拼接
        let list = [];
        if (this.data.spDetails && this.data.spDetails.length) {
          this.data.spDetails.forEach((val) => {
            list.push({
              toolsNo: val.kitNo,
              toolsName: val.kitNoDescription,
              toolsCount: val.kitNoCount
            })
          });
        }
        // 将 产品清单的值对应  转换一下
        let list2 = [];
        if (this.data.prodDetails && this.data.prodDetails.length) {
          this.data.prodDetails.forEach((val) => {
            list2.push({
              productCode: val.prodCode,
              productType: val.prodType,
              productName: val.prodDescription,
              productCount: val.prodCount
            })
          });
        }


        // let receivingAddress = this.data.formData.receivingAddress + this.data.formData.addressDetails;
        let surgeryType = this.data.currentLevel1 + '-' + this.data.currentLevel2;
        this.setData({
          'formData.listingtools': list,
          // 'formData.receivingAddress': receivingAddress,
          'formData.listingProducts': list2,
          'formData.surgeryType': surgeryType
        });

        app.globalData.$http.post('api/surgeryToolApplyOrderResource', this.data.formData).then(() => {
          wx.showToast({
            title: '新建成功'
          })
          wx.switchTab({
            url: '../distributor-order/distributor-order'
          })
        })


      }
    })
  },


  bindHospitalChange(e) {

    this.setData({
      hospitalIndex: e.detail.value,
      ['formData.hospitalName']: this.data.hospitals[e.detail.value].name,
      ['formData.hospital']: this.data.hospitals[e.detail.value]
    })
    // wx.navigateTo({
    //   url: '../hospital-infor/hospital-infor' // 医院信息
    // })
  },
  nextStep() {
    this.setData({
      showNextStep: !this.data.showNextStep
    })
  },
  backStep() {
    this.setData({
      showNextStep: !this.data.showNextStep
    })
  },

  // 初始化 二级菜单
  initH2() {
    const that = this;
    this.setData({
      places: that.data.places
    })
  },

  swichNav: function (res) {
    this.setListData('itemIndex', 0)
    this.setData({
      currentType: res.detail.currentNum,
      currentLevel2: this.data.statusType[res.detail.currentNum].name,
    });

    this.initH2();
    this.initLeve(this.data.allCategoryList, ['level2', 'domestic', 'level3'], [this.data.currentLevel1, this.data.currentLevel2, this.data.currentdomestic]);
    this.initecurrentLevel3();
    this.initLeve(this.data.allCategoryList, ['level2', 'domestic', 'level3', 'level4'], [this.data.currentLevel1, this.data.currentLevel2, this.data.currentdomestic, this.data.currentLevel3]);
    let data = {
      "level1": this.data.currentLevel1,
      "level2": this.data.currentLevel2,
      "domestic": null,
      "level3": null,
      "level4": null,
    }
    this.getLevel2Details(data)
  },
  bindChange: function (e) {
    this.setData({
      currentType: e.detail.current
    })
    if (!this.data.list[e.detail.current].length)
      this.getList();
  },
  clickItemLevel4(e) {

    let index = e.currentTarget.dataset.index;
    let length = e.detail.value.length;
    let key = 'level4[' + index + '].checked';

    if (length) {
      this.setData({
        [key]: true
      })
    } else {
      this.setData({
        [key]: false
      })
    }

    //判断 是否被  取消
    let checkedList = this.data.level4.filter(val => val.checked);
    if (checkedList.length == 0) {
      // 当4级菜单 没有选中时  重新获取 二级list
      this.getLevel2Details()
      console.log("5级选中  全部取消")

    } else {
      // 获取最终合并清单
      this.getFinallyList()
    }




  },
  getInitList(data) {
    this.setData({
      show: true,
      'spDetails': [],
      'prodDetails': [],
    })
    app.globalData.$http.post("api/operationToolRelation/getAllDetails", data).then((info) => {
      this.setData({
        'spDetails': info.spDetails,
        'prodDetails': info.prodDetails,
        'show': false
      })
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
  getLevel2Details() {
    //调用后台接口  获取2级分类下的 明细  后台指定发送的对象
    let data = {
      "level1": this.data.currentLevel1,
      "level2": this.data.currentLevel2,
      "domestic": null,
      "level3": null,
      "level4": null,
    }
    app.globalData.$http.post('api/operationToolRelation/getAllDetail', data).then((level2DetailsList) => {
      this.data.level2DetailsList = JSON.parse(JSON.stringify(level2DetailsList))

      this.setData({
        spDetails: level2DetailsList.spDetails,
        prodDetails: level2DetailsList.prodDetails
      })

    })

  },
  getLevel4Details() {
    //调用后台接口  获取4级分类下的 明细  后台指定发送的对象
    let data = {
      "level1": this.data.currentLevel1,
      "level2": this.data.currentLevel2,
      "domestic": this.data.currentdomestic,
      "level3": this.data.currentLevel3,
      "level4": null,
      "allowMultiple": true
    }
    app.globalData.$http.post('api/operationToolRelation/getAllDetail2', data).then((level4DetailsList) => {
      this.data.level4DetailsList = JSON.parse(JSON.stringify(level4DetailsList))

    })

  },
  getFinallyList() {
    //要求1：获取最终的  工具清单  和产品清单   的展示
    // 1. 二级对象下的  清单   不需要进行去重  后台已经做过处理
    // 2. 四级数组level4DetailsList下 对象  清单  不需要进行去重   后台已经做过处理
    // 3. 二级对象   和  四级数组的 展示在一起的时候   是需要去重的


    //具体实现
    //得到被选中的
    let level4List = this.data.level4.filter(val => val.checked)

    let level4DetailsList = JSON.parse(JSON.stringify(this.data.level4DetailsList));
    let checkedDetailsList = [];


    // console.log('4级detalisData:', level4DetailsList)
    // console.log('被选中的4级菜单', level4List)


    level4DetailsList.forEach((val, i) => {
      level4List.forEach(level4 => {
        if (level4.name == val.level4) {
          checkedDetailsList.push(val)
        }
      })
    })
    // console.log('checkedDetailsList:',checkedDetailsList)
    //获取最终的4级 sp  和 prod 清单
    let spList = [];
    let prodList = [];
    checkedDetailsList.forEach(details => {
      spList.push(...details.spDetails);
      prodList.push(...details.prodDetails)
    })

    //与二级合并
    spList.push(...this.data.level2DetailsList.spDetails);
    prodList.push(...this.data.level2DetailsList.prodDetails);

    // console.log("spList:",spList,454545)
    // console.log('prodList:',prodList,454545)

    //处理去重  对应数量相加  赋值
    this.setData({
      spDetails: this.distinct(spList, 'kitNo', 'kitNoCount'),
      prodDetails: this.distinct(prodList, 'prodCode', 'prodCount')
    })
  },
  getclickNumberFinallyList(e) {
    console.log("clickNumber:", e)
    if (e) {
      // console.log(e.detail);
      if (e.detail.datail.checked) {
        let oldNumber = e.detail.datail.count;
        let newNumber = e.detail.number;
        console.log("oldNumber:", oldNumber)
        console.log("newNumber:", newNumber)

        console.log('level4DetailsList:', this.data.level4DetailsList)

        let level4DetailsList = this.data.level4DetailsList.filter(val => val.level4 == e.detail.datail.name)
        console.log('Checkedlevel4DetailsList:', level4DetailsList)
        if (level4DetailsList.length) {

          // 获取被选中的   4级 明细
          let selectedspDetails = level4DetailsList[0].spDetails;
          let selectedprodDetails = level4DetailsList[0].prodDetails;

          console.log("selectedspDetails:", selectedspDetails)
          console.log("selectedprodDetails:", selectedprodDetails)




          if (newNumber == 1 && e.detail.tyname == "'_sub'") {
            // 执行减法  到0  为止
            if (selectedspDetails.length) {
              this.data.spDetails.forEach((spDetails, i) => {
                selectedspDetails.forEach(selectItem => {
                  if (selectItem.kitNo == spDetails.kitNo) {
                    spDetails.kitNoCount = spDetails.kitNoCount - selectItem.kitNoCount;
                    if (spDetails.kitNoCount <= 0) {
                      spDetails.kitNoCount = 0;
                    }
                    let key = 'spDetails[' + i + '].kitNoCount';
                    this.setListData(key, spDetails.kitNoCount)
                  }
                })

              })

            }
            if (selectedprodDetails.length) {
              this.data.prodDetails.forEach((prodDetails, i) => {
                selectedspDetails.forEach(selectItem => {
                  if (selectItem.prodCode == prodDetails.prodCode) {
                    prodDetails.prodCount = prodDetails.prodCount - selectItem.prodCount;
                    if (prodDetails.prodCount <= 0) {
                      prodDetails.prodCount = 0;
                    }

                    let key = 'prodDetails[' + i + '].prodCount';
                    this.setListData(key, prodDetails.prodCount)

                  }
                })

              })

            }
          } else {
            //执行加法

            if (selectedspDetails.length) {
              // 减去  总数据中  已经存在的值  加上新增的值
              //kitNo 中遍历  减去
              this.data.spDetails.forEach((spDetails, i) => {
                selectedspDetails.forEach(selectItem => {
                  // console.log(spDetails,selectItem,1111)
                  if (selectItem.kitNo == spDetails.kitNo) {
                    spDetails.kitNoCount = spDetails.kitNoCount + (- oldNumber + newNumber) * selectItem.kitNoCount;

                    if (spDetails.kitNoCount <= 0) {
                      spDetails.kitNoCount = 0;
                    }

                    let key = 'spDetails[' + i + '].kitNoCount';
                    this.setListData(key, spDetails.kitNoCount);


                  }
                })

              })

            }
            if (selectedprodDetails.length) {
              this.data.prodDetails.forEach((prodDetails, i) => {
                selectedprodDetails.forEach(selectItem => {
                  if (selectItem.prodCode == prodDetails.prodCode) {
                    prodDetails.prodCount = prodDetails.prodCount + (- oldNumber + newNumber) * selectItem.prodCount;;
                    if (prodDetails.prodCount <= 0) {
                      prodDetails.prodCount = 0;
                    }

                    let key = 'prodDetails[' + i + '].prodCount';
                    this.setListData(key, prodDetails.prodCount)
                  }
                })

              })


            }


          }
        }










      }
    }

  },
  setListData(key, value) {
    this.setData({
      [key]: value
    })

  },
  distinct(array, key, count) {
    array = JSON.parse(JSON.stringify(array))
    let result = []
    let obj = {}
    if (array.length) {
      for (let i of array) {
        let attr = i[key];
        if (!obj[attr]) {
          result.push(i)
          obj[attr] = 1
        } else {
          //数量相加
          result.forEach(val => {
            if (val[key] == attr) {
              val[count] = val[count] + i[count];
            }
          })
        }
      }
      // console.log(result);
      return result
    }



  },
  spclickNumber(e) {
    let i = e.currentTarget.dataset.index;
    let key = 'spDetails[' + i + '].kitNoCount';
    this.setData({
      [key]: e.detail.number
    })
  },
  prodclickNumber(e) {
    let i = e.currentTarget.dataset.index;
    let key = 'prodDetails[' + i + '].prodCount';
    this.setData({
      [key]: e.detail.number
    })
  },
  add(e) {
    this.getNumber('+', e.currentTarget.dataset.field)
  },
  sub(e) {
    this.getNumber('-', e.currentTarget.dataset.field)
  },
  getNumber(type, e) {

    if (e.checked && e.allowMultiple) {
      let level4DetailsList = this.data.level4DetailsList.filter(val => val.level4 == e.name)

      if (level4DetailsList.length) {

        // 获取被选中的   4级 明细
        let selectedspDetails = level4DetailsList[0].spDetails;
        let selectedprodDetails = level4DetailsList[0].prodDetails;

        // console.log("selectedspDetails:", selectedspDetails)
        // console.log("selectedprodDetails:", selectedprodDetails)

        if (selectedspDetails.length) {
          this.data.spDetails.forEach((spDetails, i) => {
            selectedspDetails.forEach(selectItem => {
              if (selectItem.kitNo == spDetails.kitNo) {

                if (type == '+') {
                  spDetails.kitNoCount = spDetails.kitNoCount + selectItem.kitNoCount;
                } else if (type == '-') {
                  spDetails.kitNoCount = spDetails.kitNoCount - selectItem.kitNoCount;
                }
                if (spDetails.kitNoCount <= 0) {
                  spDetails.kitNoCount = 0;
                }
                let key = 'spDetails[' + i + '].kitNoCount';
                this.setListData(key, spDetails.kitNoCount)
              }
            })

          })

        }
        if (selectedprodDetails.length) {
          this.data.prodDetails.forEach((prodDetails, i) => {
            selectedprodDetails.forEach((selectItem) => {

              if (selectItem.prodCode == prodDetails.prodCode) {
                if (type == '+') {
                  prodDetails.prodCount = prodDetails.prodCount + selectItem.prodCount;
                } else if (type == '-') {
                  prodDetails.prodCount = prodDetails.prodCount - selectItem.prodCount;
                }

                if (prodDetails.prodCount <= 0) {
                  prodDetails.prodCount = 0;
                }

                let key = 'prodDetails[' + i + '].prodCount';
                this.setListData(key, prodDetails.prodCount);
              }

            })
          })
        }
      }

    }








  }




})
