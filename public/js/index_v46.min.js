
var category = 0;
var tabIndex = 0;

$('#indexBody').ready(function(){
  $(window).scroll(function(){
    var t = $(this).scrollTop();
    if(t > 200){
        $('.up').stop().fadeIn();
    }else{
        $('.up').stop().fadeOut();
    }
  });
  preload('body');
  //设置li里面的元素等高
  setLiHeight();
  $($('.jl nav.mui-bar.mui-bar-tab a')[0]).addClass('mui-active');
  //带有导航条的多页商品显示
  var nav = $("#slider_wrap .item_cell span");
  var wrapper = $("ul.wrapper");

  //精选懒加载
  preload(wrapper[0]);

  for(var i=0;i<nav.length;i++){
    nav[i].index = i;
    nav[i].onclick=function(){
      //当前所在页
      
      tabIndex = this.index;

      for(var n = 0; n < wrapper.length; n++) {
          $(wrapper[n]).css("display","none");
          $(nav[n]).removeClass("red");
      }
      //当前页的category
      category = $(this).attr("category");
      $(wrapper[this.index]).css("display","block");
      
      preload(wrapper[this.index]);
     
      $(this).addClass("red");  
      //转换标签时下拉解锁
      dropload.unlock();
      dropload.noData(false);
      dropload.resetload();
    }
  }

  
  document.getElementById('slider_wrap').style.webkitOverflowScrolling = 'touch';  //js 添加  防止开始卡死
  document.getElementById("j_u_c_items").addEventListener('touchstart', function(event){});//ios7 促发


  mui('body').on('tap','a',function(){
    window.top.location.href=this.href;
  });
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval:3800//自动轮播周期，若为0则不自动播放，默认为0；
  });


  // dropload
  //单页下拉加载

  // 请求第几页，预加载了第0页
  var tabPage = new Array(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1); 
  // 每页展示10个
  var size = 10;
  var dropload = $(".mui-content").dropload({
    scrollArea : window,
    loadDownFn : function(me){
      tabPage[tabIndex]++;
      if(tabPage[tabIndex] > 10){//大于10时获取到的数据会重复
        // 锁定
        me.lock();
        // 无数据
        me.noData();
        dropload.resetload();
      }else{
        var categoryJson = {
          category: category,
          page: tabPage[tabIndex],
          page_size: size
        };
        var result = '';
        $.ajax({
          data: categoryJson,
          type: 'POST',
          url: '/category',
          dataType: 'json',
          cache: false,//不保存缓存
          success: function(data){
            if(data['err']){
              // 锁定
              me.lock();
              // 无数据
              me.noData();
              dropload.resetload();
            }else{
              var arrLen = data['data'].length;
              var count = 0;
              if(arrLen > 0){
                var item = '';
                for(var k = 0; k < data['data'].length; k++) {
                //- data['data'].forEach(function(item) {
                  item = data['data'][k];
                  var userIcon = "#icon-tianmao1";
                  if(item.user_type === 0){
                    userIcon = "#icon-taobao3";
                  }
                  result+=`<li>
                            <a href='javascript:fn(${item.num_iid})' id='${item.num_iid}'>
                              <div style='display:none'>
                                <span>${item.user_type}</span>
                                <span>${item.title}</span>
                                <span>${item.disprice}</span>
                                <span>${item.price}</span>
                                <span>${item.volume}</span>
                                <span>${item.coupon_val}</span>
                                <span>${item.coupon_start_time}</span>
                                <span>${item.coupon_end_time}</span>
                                <span>${item.coupon_url}</span>
                                <span>${item.img}</span>
                                <span>${item.limit}</span>
                                <span>${item.category}</span>
                                <span>${item.coupon_max}</span>
                                <span>${item.coupon_num}</span>
                                <span>${item.discount}</span>
                                <span>${item.progress}</span>
                              </div>
                              <div class="pic">
                                <img src='${item.img}'></div>
                              <div class="text">
                                <h2>
                                  <svg aria-hidden="true" class="icon">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${userIcon}"></use>
                                  </svg> ${item.title}
                                </h2>
                                <div>
                                  <span>现价
                                    <s>￥${item.price}</s>
                                  </span>
                                  <span style="float:right;">月销量 ${item.volume}件</span></div>
                                <div>
                                  <span>券后价
                                    <b>￥${item.disprice}</b>
                                  </span>
                                </div>
                                <div>
                                  <div style="background:rgba(	255,165,0,0.4); weight:20px" class="progress progress-striped active myprogress">
                                    <div role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: ${item.progress}%;" class="progress-bar progress-bar-warning">
                                      <div>
                                        <span style="position: absolute;left: 10px;">券：${item.coupon_val}元</span>
                                        <span style="position: absolute;right: 10px;">余 ${item.coupon_num}张</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="coupon" style="margin-top: 16.44px;">
                                <svg aria-hidden="true" class="icon">
                                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-savemoney"></use>
                                </svg>
                                <p>省￥${item.coupon_val}</p>
                              </div>
                            </a>
                          </li>`;
                }  
              }else{
                // 锁定
                me.lock();
                // 无数据
                me.noData();
              }
            }
            // 为了测试，延迟1秒加载
            setTimeout(function(){
              $("ul.wrapper[style='display: block;']").append(result);
              // 每次数据插入，必须重置

              me.resetload();
            },1000);
          },
          error: function(xhr, type){
            alert('Ajax error!');
            // 即使加载出错，也得重置
            me.resetload();
          }
        });
      }
    }
  });
});