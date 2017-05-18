
  var start_page = 1
  var current_page = 1
  var current_shi = 0
  var Tap = false // 点击状态 防止多次点击
  var disableBtn = false // 禁用按钮点击
  var score = 0 // 起始分数
  var timer // 计时器


  // 开启下一页逻辑
  function show_next (page) {
    // 跳转到指定页
    if(page) {
      $('.page').removeClass('fadeIn animated bl')
      $('.page' + page).addClass('fadeIn animated bl')
      current_page = page
    }
    // 显示下一页
    else {
      $('.page' + current_page++).removeClass('fadeIn animated bl')
      $('.page' + current_page).addClass('fadeIn animated bl')
    }
  }

  // 首页停留时间
  setTimeout(function(){
    show_next()
  }, 3000)

  // 下一页
  $('.show_next').on('click', function(event) {
    event.preventDefault();
    show_next()
  });

  // 返回页
  $('.back').on('click', function(event) {
    event.preventDefault();
    show_next(2)
  });

  // 录音页
  $('.wolu').on('click', function(event) {
    event.preventDefault();
    clearTimeout(timer)
    $('#process').css('width', '100%');
    $('#v_time').html('30秒')
    $('#luyin').removeClass('recording')
    show_next(6)
  });

  $('.btn-end').on('click', function() {
    show_next(10)
  })

  // 刷新录音
  $('.ref').on('click', function(event) {
    event.preventDefault();
    layer.open({
      type: 2
      ,content: '刷新录音中……'
      ,time: 3
    });
  });

  // 身份选择
  $('.shenfen').on('click', function(event) {
    event.preventDefault()
    $('.shenfen').removeClass('select')
    $(this).toggleClass('select')
  });

  // 录音播放(区别本地播放)
  $('.video-box img').on('click', function(event) {
    var parent = $(this).parent('.video-box')
    parent.toggleClass('on')
    // 播放本地银屏
    if ($(this).hasClass('local')) {
      if (parent.hasClass('on')) {  // 播录音
        voice_control(parent)
      } else {
        voice_control(parent, 1)
      }
    }
  });

  // 点赞
  $('.likes').on('click', function(event) {
    var that = $(this)
    if ($(this).hasClass('disable')) return
    $(this).addClass('disable')
    var parent = $(this).parent('.video-box')
    var num = $(this).find('.nub')
    var numb = parseInt(num.html())
    event.preventDefault();
    parent.toggleClass('like')
    if (parent.hasClass('like')) {
      num.html(numb + 1)
    } else {
      num.html(numb - 1)
    }
    setTimeout(function(){
      that.removeClass('disable')
    }, 1000)
  });

  // 录音倒计时逻辑
  function _dao () {
    var v_time = parseInt($('#v_time').html())
    console.log(v_time)
    if (typeof v_time !== "number") return
    timer = setTimeout(function(){
      if (v_time-- > 0) {
        $('#v_time').html(v_time + '秒')
        $('#process').css('width', v_time * 3.333 + '%');
        _dao()
      }
    }, 1000)
  }

  // 声音控制选项
  function voice_control (el, stop) {
    var voice = el.find('.voice') 
    // 是否为暂停控制
    if (stop) {
      voice[0].pause()
    } else {
      voice[0].play()
    }
  }

  var shi = [] // 朗读数组
  shi[0] = '<div data-shi="登黄鹤楼" class="shiming"> \
            <p class="title">登黄鹤楼</p> \
            <p class="zuozhe">作者：王之涣</p> \
            <p>白日依山尽，</p> \
            <p>黄河入海流。</p> \
            <p>欲穷千里目，</p> \
            <p>更上一层楼。</p> \
          </div>'
  shi[1] = '<div data-shi="小池" class="shiming"> \
            <p class="title">小池</p> \
            <p class="zuozhe">作者：杨万里</p> \
            <p>泉眼无声惜细流，</p> \
            <p>树阴照水爱晴柔。</p> \
            <p>小荷才露尖尖角，</p> \
            <p>早有蜻蜓立上头。</p> \
          </div>'
  shi[2] = '<div data-shi="题西林壁" class="shiming"> \
            <p class="title">题西林壁</p> \
            <p class="zuozhe">作者：苏轼</p> \
            <p>横看成岭侧成峰，</p> \
            <p>远近高低各不同。</p> \
            <p>不识庐山真面目，</p> \
            <p>只缘身在此山中。</p> \
          </div>'
  shi[3] = '<div data-shi="你不快乐的每一天都不是你的" class="shiming font-little"> \
            <p class="title">你不快乐的每一天都不是你的</p> \
            <p class="zuozhe">作者：费尔南多·佩索阿</p> \
            <p>你不快乐的每一天都不是你的：，</p> \
            <p>你只是虚度了它。无论你怎么活。</p> \
            <p>只要不快乐，你就没有生活过。</p> \
            <p>夕阳倒映在水塘，假如足以令你愉悦，</p> \
            <p>那么爱情，美酒，或者欢笑，</p> \
            <p>便也无足轻重。</p> \
            <p>幸福的人，是他从微小的事物中，</p> \
            <p>汲取到快乐，每一天都不拒绝，</p> \
            <p>自然的馈赠！</p> \
          </div>'
  shi[4] = '<div data-shi="安慰" class="shiming font-little"> \
            <p class="title">安慰</p> \
            <p class="zuozhe">作者：顾城</p> \
            <p>青青的野葡萄，</p> \
            <p>淡黄的小月亮。</p> \
            <p>妈妈发愁了，</p> \
            <p>怎么做果酱。</p> \
            <p>我说：</p> \
            <p>别加糖。</p> \
            <p>在早晨的篱笆上，</p> \
            <p>有一枚甜甜的，</p> \
            <p>红太阳。</p> \
          </div>'

  // 诗歌切换
  function shi_control (prev) {
    var len = shi.length
    if (prev) { // 上一首
      if (current_shi === 0 ) {
        current_shi = len -1
      } else {
        current_shi--
      }
    } else {
      if (current_shi === len - 1 ) {
        current_shi = 0
      } else {
        current_shi++
      }
    }
    $('#shi').html(shi[current_shi])
  }

  $('.shic').on('click', function(){
    if ($(this).hasClass('prev')) {
      shi_control(1)
    } else {
      shi_control()
    }
  })
