Page({
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.prepareList(this.getListParams());
  },
  clearInput: function () {
    this.setData({
      inputVal: ''
    });
    this.prepareList(this.getListParams());
  },
})