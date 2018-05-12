const promisify = require('../../lib/promisify.js')
const { fetchTimeline } = require('../../services/api.js')
const { throttle, debounce } = require('../../lib/underscore.js')

const getUserInfo = promisify(wx.getUserInfo)

let scrollTop = 0

Page({
    data: {
        title: '主页',
        menuIndex: 0,
        tweets: [],
        users: {},
        userInfo: {},
        navClass: 'put-down'
    },
    menuTap: function(event) {
        const { currentTarget } = event
        this.setData({
            menuIndex: currentTarget.dataset.index,
            tweets: [],
            users: {}
        })
    },
    onLoad: function() {
        // 获取用户数据
        getUserInfo().then(data => {
            const { userInfo } = data
            this.setData({ userInfo })
        })
    },
    handleonpulldownscroll: function(event) {
        const detail = event.detail
        // iphone在scrollTop为0后依然可以向上滚动
        // 触发滚动事件，并且scrollTop为负数 
        // 此时会与下拉刷新功能冲突
        // 故scrollTop小于0时，不做任何操作
        if (detail.scrollTop < 0) return
        const isPutUp = detail.scrollTop > scrollTop
        this.setNav(isPutUp ? 'put-up' : 'put-down')
        scrollTop = detail.scrollTop
        // this.recordScrollTop(event.scrollTop)
    },
    // 停止滚动后再记录最后的scrollTop
    // recordScrollTop: debounce(function(currentScrollTop) {
    //   scrollTop = currentScrollTop
    // }, 100),
    // 防止用户频繁的上下滚动
    setNav: throttle(function(navClass) {
        // 如果当前导航为即将设置的状态，不再调用setData
        if (this.data.navClass !== navClass) {
            this.setData({ navClass })
        }
    }, 100),
    handlepulldownrefresh: function(event) {
        const { detail } = event
        console.log('开始请求数据')
        // 获取twitter数据
        fetchTimeline().then(data => {
            const { globalObjects } = data
            const tweets = Object.values(globalObjects.tweets)
            this.setData({
                tweets: tweets.splice(10+Math.ceil(Math.random()*5)),
                users: globalObjects.users
            })
            detail.stopPullDownRefresh()
            console.log('数据请求成功')
        })
    }
})
