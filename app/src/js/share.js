/**
 * 微信分享工具库
 *
 * 依赖:
 * 1. http://res.wx.qq.com/open/js/jweixin-1.2.0.js
 * 2. jquery或zepto
 */
window.wxshare = (function() {
  var opts = {
    title: '微信分享标题',
    desc: '微信分享描述',
    link: '微信分享链接',
    imgUrl: '微信分享图片',
    timelineText: null,
    timelineLink: null,
    timelineImgUrl: null,
    friendTitle: null,
    friendDesc: null,
    friendLink: null,
    friendImgUrl: null,
    onSuccess: null,
    onCancel: null
  }
  
  var isReady = false

  function config(optsArg) {
    $.extend(opts, optsArg)

    if (!isReady) {
      getSign()
      return
    }

    if (!window.wx) return
    var wx = window.wx

    wx.onMenuShareTimeline({
      title: opts.timelineText || opts.desc,
      link: opts.timelineLink || opts.link,
      imgUrl: opts.timelineImgUrl || opts.imgUrl,
      success: function() {
        if (opts.onSuccess) {
          opts.onSuccess()
        }
      },
      cancel: function() {
        if (opts.onCancel) {
          opts.onCancel()
        }
      }
    })

    wx.onMenuShareAppMessage({
      title: opts.friendTitle || opts.title,
      desc: opts.friendDesc || opts.desc,
      link: opts.friendLink || opts.link,
      imgUrl: opts.friendImgUrl || opts.imgUrl,
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function() {
        if (opts.onSuccess) {
          opts.onSuccess()
        }
      },
      cancel: function() {
        if (opts.onCancel) {
          opts.onCancel()
        }
      }
    })

    wx.onMenuShareQQ(opts)
    wx.onMenuShareWeibo(opts)
    wx.onMenuShareQZone(opts)
  }

  function getSign() {
    var me = this
    if (me.success) return
    if (me.running) return
    me.running = true

    var url = location.href.split('#')[0]
    // url = encodeURIComponent(url)

    $.ajax({
      type: 'POST',
      url: '/wx/sdk',
      data: {
        url: url
      },
      dataType: 'json',
      success: function(rsp) {
        if (!window.wx) return
        var wx = window.wx

        var debug = (window.location.search.indexOf('__wxdebug__=1') !== -1)
        var data = rsp
        wx.config({
          debug: true,
          appId: 'wx561e2e008f8768ae',
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'
          ]
        })
        wx.ready(function() {
          isReady = true
          config(opts)
          opts.onReady && opts.onReady()
          wx.onVoicePlayEnd({
            success: function (res) {
              stopWave();
            }
          })
        })
        wx.error(function(res){
        })
        me.success = true
      },
      complete: function() {
        me.running = false
      }
    })
  }

  return {
    config: config
  }

})()
