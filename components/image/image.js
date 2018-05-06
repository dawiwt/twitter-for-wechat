Component({
  data: {
    coverOpacity: 1
  },
  externalClasses: ["image-class"],
  properties: {
    width: {
      type: String,
      value: "300rpx"
    },
    height: {
      type: String,
      value: "225rpx"
    },
    style: String,
    src: String,
    coverColor: {
      type: String,
      value: "rgb(29, 161, 242)"
    },
    // 值为true时，图片的宽跟高为100%
    contain: {
      type: Boolean,
      value: false
    },
    lazyLoad: {
      type: Boolean,
      value: false
    },
    size: {
      type: String,
      value: "cover"
    },
    position: {
      type: String,
      value: "center"
    }
  },
  methods: {
    handleLoad: function() {
      this.setData({
        coverOpacity: 0
      })
    }
  }
})
