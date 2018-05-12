const options = {
    // 是否开启下拉刷新功能，以scrollTop的值来计算
    enabled: true,
    // 记录下拉长度
    dorpDownTop: 0,
    // touchstart时，所有触摸点pageY
    pageY: []
}
// 事件顺序: touchstart -> touchmove -> scroll -> touchend
Component({
    externalClasses: ['external-class'],
    properties: {
        height: {
            type: String,
            value: '100%'
        },
        scrollTop: {
            type: Number,
            value: 0
        },
        autoFirstRefresh: {
            type: Boolean,
            value: false,
            observer: 'autoFirstRefresh'
        }
    },
    data: {
        scroll: true,
        loading: false,
        animationRefreshDownUp: {},
        animationDrop: {}
    },
    created: function(event) {
        this.animation = {
            refreshDownUp: wx.createAnimation({ duration: 200 }),
            dropDown: wx.createAnimation({ duration: 0 }),
            dropUp: wx.createAnimation({
                duration: 200,
                timingFunction: 'ease-out'
            })
        }
    },
    methods: {
        autoFirstRefresh: function(nv) {
            if (nv) {
                console.log('autoFirstRefresh')
                const { dropDown, dropUp } = this.animation
                dropDown.translateY(60).step()
                this.setData({
                    animationDrop: dropDown.export(),
                    loading: true
                })

                setTimeout(() => {
                    // 必须放在timeout里才能触发事件
                    this.triggerEvent('onpulldownrefresh', {
                        stopPullDownRefresh: () => {
                            dropUp.translateY(0).step({ duration: 0 })
                            this.setData({
                                loading: false,
                                animationDrop: dropUp.export()
                            })
                        }
                    })
                })
            }
        },
        getDropDownTop: function(changedTouches) {
            const origin = this.data.loading ? 60 : 0
            if (changedTouches.length !== options.pageY.length) {
                return options.dorpDownTop
            }
            // 下拉距离为 0 - 250
            // 返回整数，减少渲染次数
            return (options.dorpDownTop = Math.ceil(
                Math.max(
                    Math.min.apply(
                        Math,
                        [250].concat(
                            options.pageY.map((y, index) => {
                                return changedTouches[index].pageY - y + origin
                            })
                        )
                    ),
                    0
                )
            ))
        },
        handlescroll: function(event) {
            const detail = event.detail
            options.enabled = detail.scrollTop <= 0
            this.triggerEvent('onscroll', detail)
        },
        handletouchstart: function(event) {
            if (!options.enabled) return
            const { touches } = event
            options.pageY = touches.map(touche => {
                return touche.pageY
            })
        },
        handletouchmove: function(event) {
            if (!options.enabled) return
            const { changedTouches } = event
            const { refreshDownUp, dropDown } = this.animation
            const top = this.getDropDownTop(changedTouches)

            console.log('top', top)

            // 下拉箭头指示动画
            refreshDownUp.rotate(top >= 60 ? 180 : 0).step()

            // 下拉动画
            // Math.max(top, 0) 防止top为负数
            dropDown.translateY(top).step()

            this.setData({
                animationRefreshDownUp: refreshDownUp.export(),
                animationDrop: dropDown.export(),
                scroll: top <= 0
            })
        },
        handletouchend: function() {
            // 恢复scroll-view滚动
            this.setData({ scroll: true })

            if (!options.enabled) return

            if (options.dorpDownTop >= 60) {
                if (!this.data.loading) {
                    this.triggerEvent('onpulldownrefresh', {
                        stopPullDownRefresh: this.dropDownUpAnimationOver.bind(
                            this
                        )
                    })
                }
                const { dropUp } = this.animation
                dropUp.translateY(50).step()
                dropUp.translateY(60).step()
                this.setData({
                    animationDrop: dropUp.export(),
                    loading: true
                })
                return
            }
            if (options.dorpDownTop > 0) {
                this.dropDownUpAnimationOver()
            }
        },
        dropDownUpAnimationOver: function(data) {
            console.log('dropDownUpAnimationOver')
            const { dropUp, refreshDownUp } = this.animation
            options.dorpDownTop = 0
            dropUp.translateY(-10).step()
            dropUp.translateY(0).step()
            refreshDownUp.rotate(0).step()
            this.setData({
                ...data,
                loading: false,
                animationDrop: dropUp.export(),
                animationRefreshDownUp: refreshDownUp.export()
            })
        },
        handletouchcancel: function() {
            this.dropDownUpAnimationOver()
        }
    }
})
