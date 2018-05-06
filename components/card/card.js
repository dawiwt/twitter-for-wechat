Component({
  properties: {
    tweet: Object,
    user: Object
  },
  data: {
    medias: [],
    favoriteClass: ""
  },
  ready: function() {
    const medias = []
    const { entities: { media = [] } } = this.properties.tweet
    switch (media.length) {
      case 1:
        medias.push(media)
        break
      case 2:
        medias.push([media[0]])
        medias.push([media[1]])
        break
      case 3:
        medias.push([media[0]])
        medias.push(media.slice(1))
        break
      case 4:
        medias.push(media.slice(0, 2))
        medias.push(media.slice(2))
        break
    }
    this.setData({ medias })
  },
  methods: {
    replyTap: function() {
      console.log("回复")
    },
    favoriteTap: function() {
      console.log("喜欢")
      const { favoriteClass } = this.data
      this.setData({
        favoriteClass: favoriteClass ? "" : "favorited"
      })
    }
  }
})
