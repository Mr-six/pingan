/**
* 页面答题主要业务逻辑
*/

// 引入选择题配置项
import conf from './source'
// 引入分数配置项
import score_conf from './score'


$(function () {
  var start_page = 0
  var current_page = 0
  var Tap = false // 点击状态 防止多次点击
  var disableBtn = false // 禁用按钮点击
  var score = 0 // 起始分数

  // 翻页按钮
  $('.next-btn').on('touchend', function (e) {
    e.preventDefault()
    e.stopPropagation()
    if(Tap) return
    Tap = true
    disableBtn = true // 禁用选择
    // 进行翻页
    current_page += 1

    // 为本页添加动画类 隐藏此页
    if ($(this).parents('.content').hasClass('index')) {
      $(this).parents('.content').attr('class', 'content index animated fadeOutLeft')
    } else {
      $(this).parents('.content').addClass('animated fadeOutLeft')
    }
    

    // 开启下一页
    show_next(current_page)

    // 连续点击时间限制
    setTimeout(function () {
      Tap = false
    },1000)
  })

  // 计分函数
  //

  // 播放声音提示函数
  $('.page-tip').on('touchend', function () {
    if ($(this).find('.voice-tip').css('opacity') == 1) {
      voice_control(current_page)
    }
  })


  // 按钮点击函数
  $('.page-choise.choise .btn').on('touchend', function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (disableBtn) return
    disableBtn = true // 禁用按钮点击
    Tap = true 

    // 声音暂停
    voice_control(current_page, true)

    // 元素查找替换样式
    var parent = $(this).parents('.content')
    var voice_tip = parent.find('.voice-tip') // 声音提示图片
    var right_tip = parent.find('.right-tip') // 正确提示图片
    var err_tip = parent.find('.err-tip') // 错误提示
    var next_btn = parent.find('.page-choise.next') // 下一步按钮
    var choise_btn = parent.find('.page-choise.choise') // 选项按钮

    // 执行动画过程
    // ----------------
    // 如果是正确选项
    if ($(this).hasClass('btn-right')) {
      parent.addClass('show-right')
      // 分数增加
      score += 1
    } else {
      parent.addClass('show-err')
    }
    setTimeout(function () {
      parent.addClass('show-ans')
      Tap = false
      // console.log(score)
    },1000)
  })



  // 开启下一页逻辑
  function show_next (page) {
    // 当加载了最后一页之后 展示最终页
    if (page === 11) {
      $('.last.content').addClass('bl')
      // 分数计算
      $('#score').html(score * 10)
      // 击败人数
      $('#beat').html(beat(score))
      // 暂停第十页声音
      // var preve_voice = $('.page' + (page - 1)).find('.voice')
      //   preve_voice.attr('src', '')
      //   preve_voice[0].pause()
      return
    } else {
      // 显示下一页
      $('.page' + page).addClass('fadeIn animated bl')

      // 声音自动播放
      if (page > 1) {
        // 清除上一页的声音
        voice_control((current_page - 1), true, true)
      }

      // 异步加载资源 等待 500毫秒
      setTimeout(function () {
        update_page(page)
        disableBtn = false // 解禁按钮点击
      },1000)
    }
  }

  // 异步加载页面资源
  function update_page (page) {
    if (page === 1) return
    if (page < 9) {
      var pre = page - 1
      var fur = page + 2
      update_source(pre, fur)
    }
  }

  // 分享提示
  $('.share-btn').on('touchend', function() {
    $('.content.share').toggleClass('hide');
  })
  // 重新测试
  $('.res-btn').on('touchend', function() {
    // 页面初始化
    restart()
  })

  // 页面资源更新
  function update_source (pre, fur) {
    // 当前页
    var prev_page = $('.page' + pre)
    // 未来将要成为的页
    var further_page = prev_page.attr('class', 'content page page' + fur)
    // 提取未来资源
    var source = conf[fur] || {}

    // 食物图片url
    further_page.find('.page-pic img').attr('src', source.food_img)
    // 正确答案
    further_page.find('.page-dsc img').attr('src', source.dsc)
    // 声音文件
    further_page.find('.voice').attr('src', source.voice)
    // 选项列表
    var choice = further_page.find('.page-choise.choise >span')
    // 进行遍历替换
    choice.each(function (index, el) {
      // 初始化类
      $(el).attr('class', 'btn')
      // 如果为正确选项
      if (index === source.btn_right) {
        $(el).addClass('btn-right')
      }
    })
    // 替换按钮选项
    $(choice[0]).find('img').attr('src', source.btn1)
    $(choice[1]).find('img').attr('src', source.btn2)
    $(choice[2]).find('img').attr('src', source.btn3)
  }

  // 页面初始化
  function restart () {
    // 首页1
    $('.index').attr('class', 'content index animation')
    // 资源页
    update_source(8, 1)
    update_source(9, 2)
    update_source(10, 3)
    // 尾页
    $('.last.content').removeClass('bl')
    // 分数
    score = 0
    // 当前页数
    current_page = 0
  }

  // 计算击败人数
  function beat (score) {
    if (score === 0) {
      return 0
    } else if (score === 10) {
      return 99
    } else {
      return score_conf[score][parseInt(Math.random() * 3)]
    }
  }

  // 声音控制选项
  function voice_control (index, stop, remove) {
    // 是否为暂停控制
    if (stop) {
      var voice = $('.page' + index).find('.voice')
      voice[0].pause()
      if (remove) {
        voice.attr('src', '')
      }
    } else {
      $('.page' + index).find('.voice')[0].play()
    }
  }

  // 表单数据
  $('#submit').on('touchend', function (e) {
    e.preventDefault()
    var reg = /^1[34578]\d{9}$/
    var btn = $(this)

    if ($(this).hasClass('disabled') || $(this).attr('disabled') == true) {
      layer.open({
        content: '您已经提交过了',
        btn: '确定',
        shadeClose: false
      })
      return
    }
    // 省份
    var province = $.trim($('#province').val())
    // 电话
    var tel = $.trim($('#tel').val())
    // 提交时间
    var time = (new Date()).toLocaleString()
    // 信息不能为空
    if (!province || !tel) {
      layer.open({
        content: '信息不能为空',
        btn: '确定',
        shadeClose: false
      })
    } else if(!reg.test(tel) || tel > 19999999999){
      layer.open({
        content: '请输入正确的手机号码',
        btn: '确定',
        shadeClose: false
      })
    } else if (province.length < 2 || province.length > 10) {
      layer.open({
        content: '请输入正确的省份',
        btn: '确定',
        shadeClose: false
      })
    } else {
      // 禁用按钮 防止再次点击
      btn.addClass('disabled').attr('disabled', 'true')

      $.ajax({
        type: 'POST',
        url: '/info',
        data: JSON.stringify({province: province, tel: tel, time: time}),
        contentType: 'application/json',

        // 成功发送
        success: function(data){
          layer.open({
            content: '提交成功'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
          })
          // 清空表单数据
          $('#province').val('').attr('placeholder', '您已提交成功')
          $('#tel').val('').attr('placeholder', '请静候佳音')
        },

        // 相应出错
        error: function(xhr, type){
          layer.open({
            content: '网络错误'
            ,skin: 'msg'
            ,time: 2 //2秒后自动关闭
          })
          btn.removeClass('disabled').attr('disabled', 'false')
        }
      })
    }


  })

})

 // 页面加载loading
window.onload = function () {
  $('.content.loading').removeClass('bl')
  $('.content.index').addClass('animation')
}
