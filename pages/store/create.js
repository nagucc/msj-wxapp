const { jkefApiToken } = require('../../config');
const CosCloud = require('../../lib/cos');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: {
    },
    storeImages: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  // 此代码仅能从相册或相机选择图片，不包含上传功能。
  chooseImage: function(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 1,
      success: (res) => {
        var cos = new CosCloud({
          appid: '1252179205', // APPID 必填参数
          bucket: 'nagucc', // bucketName 必填参数
          region: 'cd', // 地域信息 必填参数 华南地区填 gz 华东填 sh 华北填 tj
          getAppSign: function (callback) {//获取签名 必填参数

              // 下面简单讲一下获取签名的几种办法
              // 首先，签名的算法具体查看文档：[COS V4 API 签名算法](https://www.qcloud.com/document/product/436/6054)

              // 1.搭建一个鉴权服务器，自己构造请求参数获取签名，推荐实际线上业务使用，优点是安全性好，不会暴露自己的私钥
              // 拿到签名之后记得调用callback
              /*
              wx.request({
                  url: 'SIGN_URL',
                  data: {once: false},
                  dataType: 'text',
                  success: function (result) {
                      var sig = result.data;
                      callback(sig);
                  }
              });
              */
              callback('ec9YuJfM6AkyPqwQLnvLY8TiO29hPTEyNTIxNzkyMDUmYj1uYWd1Y2Mmaz1BS0lEc2dKang0SG9RM2F3QUNPZjlUZUt0SFRXTjRjenRBTU4mZT0xNTAzMzE3OTQ2JnQ9MTUwMzA1ODc0NiZyPTQ0NTUyMjImZj0=');
          },
          getAppSignOnce: function (callback) { //单次签名，必填参数，参考上面的注释即可
              // 填上获取单次签名的逻辑
              // var res = getAuth(true); // 这个函数自己根据签名算法实现
              // callback(res);
          }
      });
        var successCallback = function (result) {
            console.log('success', result);
        }
        var errorCallback = function (result) {
            console.log('success', result);
        }
        var progressCallback = function (res) {
          console.log('上传进度', res);
        }
        if (res.tempFilePaths && res.tempFilePaths.length) {
          var localPath = res.tempFilePaths[0];
          const image = {
            localPath,
            percent: 0,
          };
          this.setData({
            storeImages: this.data.storeImages.concat([image]),
          });
          const path = `/meishijie/${localPath.replace('://', '_')}`;
          cos.uploadFile({
              success: successCallback,
              error: errorCallback,
              onProgress: info => { // 返回 info 对象，带有 loaded、total、percent、speed 四个字段
                const storeImages = this.data.storeImages.map(img => {
                  if (img.localPath === localPath) {
                    return Object.assign(img, {
                      percent: Math.round(info.percent * 100),
                    });
                  } else return img;
                });
                this.setData({
                  storeImages,
                });
              }, 
              bucket: 'nagucc',
              path,
              filepath: localPath,
              insertOnly: 1, // insertOnly==0 表示允许覆盖文件 1表示不允许覆盖
          });
        }
      }
    })
  },
  removeImage: function(e) {
    const index = parseInt(e.target.id, 10);
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            storeImages: this.data.storeImages.filter((img, idx) => (idx !== index)),
          });
        }
      }
    });
  },
  previewImage: function(e){
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: this.data.storeImages.map(images => images.localPath) // 需要预览的图片http链接列表
      });
  }
})