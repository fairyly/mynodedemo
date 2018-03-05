function setLiHeight() {
  //设置li里面的元素等高
  var right = $(".wrapper li");
  var left = $(".coupon");
  left.css("marginTop", right.height() * 0.1);
}

function preload(params) {
  $(params)
    .find("img")
    .lazyload({
      effect: "fadeIn",
      threshold: 200
    });
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return r[2];
  }
  return null;
}

//json数组排序
function getSortFun(order, sortBy) {
  var ordAlpah = order == "asc" ? ">" : "<";
  var sortFun = new Function(
    "a",
    "b",
    "return a." + sortBy + ordAlpah + "b." + sortBy + "?1:-1"
  );
  return sortFun;
}

//搜索功能
function enterSearch(e) {
  if (e.keyCode == 13) {
    $("#searchInput").blur();
    mui.openWindow({
      id: "/",
      url: "/search?keyword=" + $("#searchInput").val()
    });
  }
}

function init() {
  $(window).scroll(function(){
    var t = $(this).scrollTop();
    if(t > 200){
        $('.up').stop().fadeIn();
    }else{
        $('.up').stop().fadeOut();
    }
  });
  $.ajaxSetup({
    async: false
  });
  mui("body").on("tap", "a", function() {
    window.top.location.href = this.href;
  });
  mui("body").on("tap", "#searchSubmit", function() {
    $("#searchInput").blur();
    mui.openWindow({
      id: "/",
      url: "/search?keyword=" + $("#searchInput").val()
    });
  });
}

//排序菜单
function sortMenu(dropload) {
  var dispriceIsDesc = true;
  //带有导航条的多页商品显示
  var nav = $("#slider_wrap .item_cell span");
  var wrapper = $("ul.wrapper");
  for (var i = 0; i < nav.length; i++) {
    nav[i].index = i;
    nav[i].onclick = function() {
      //当前所在页
      tabIndex = this.index;

      for (var n = 0; n < wrapper.length; n++) {
        $(wrapper[n]).css("display", "none");
        $(nav[n]).removeClass("red");
        $("#j_u_c_items .item_cell span svg use").attr(
          "xlink:href",
          "#icon-shangxia1"
        );
      }
      //当前页的category
      category = $(this).attr("category");

      if (2 === tabIndex || 5 === tabIndex) {
        dispriceIsDesc = !dispriceIsDesc;
        if (dispriceIsDesc) {
          $("#j_u_c_items .item_cell span svg use").attr(
            "xlink:href",
            "#icon-down-copy1"
          ); //
          tabIndex = 2;
        } else {
          $("#j_u_c_items .item_cell span svg use").attr(
            "xlink:href",
            "#icon-down-copy"
          ); //
          tabIndex = 5;
        }
      }

      $(wrapper[tabIndex]).css("display", "block");

      preload(wrapper[tabIndex]);
      $(this).addClass("red");
      //转换标签时下拉解锁
      dropload.unlock();
      dropload.noData(false);
      dropload.resetload();
    };
  }

  document.getElementById("slider_wrap").style.webkitOverflowScrolling =
    "touch"; //js 添加  防止开始卡死
  document
    .getElementById("j_u_c_items")
    .addEventListener("touchstart", function(event) {}); //ios7 促发
}

//按照不同的排序规则加载商品
function sortLoad() {
  // 请求第几页，综合排序预加载了第0页
  var tabPage = new Array(0, 0, 0, 0, 0, 0);
  var page = 1;
  // 每页展示10个
  var size = 10;

  var dropload = $(".mui-content").dropload({
    scrollArea: window,
    loadDownFn: function(me) {
      tabPage[tabIndex]++;
      if (tabPage[tabIndex] > 10) {
        //大于10时获取到的数据会重复
        // 锁定
        me.lock();
        // 无数据
        me.noData();
        dropload.resetload();
      } else {
        var result = "";
        var orgdata = '';
        if(sessionStorage.commodities === '' || sessionStorage.commodities === undefined){
          orgdata = '';
        }else{
          orgdata = JSON.parse(sessionStorage.commodities);
        }
        
        if (orgdata["err"] || orgdata === [] || orgdata === '') {
          // 锁定
          me.lock();
          // 无数据
          me.noData();
          //dropload.resetload();
        } else {
          switch (tabIndex) {
            case 0: //综合排序desc降，ase升
              orgdata = orgdata;
              break;
            case 1: //优惠比降序
              orgdata = orgdata.sort(getSortFun("desc", "discount"));
              break;
            case 2: //价格升序
              orgdata = orgdata.sort(getSortFun("asc", "disprice"));
              break;
            case 3: //销量降序
              orgdata = orgdata.sort(getSortFun("desc", "volume"));
              break;
            case 4: //即将抢完 进度条百分比降序
              orgdata = orgdata.sort(getSortFun("desc", "progress"));
              break;
            case 5: //价格降序
              orgdata = orgdata.sort(getSortFun("desc", "disprice"));
              break;
            default:
              break;
          }
          var data = orgdata.slice(
            (tabPage[tabIndex] - 1) * size,
            tabPage[tabIndex] * size - 1
          );
          var arrLen = data.length;

          var count = 0;
          if (arrLen > 0) {
            var item = "";
            for (var k = 0; k < data.length; k++) {
              //- data['data'].forEach(function(item) {
              item = data[k];
              var userIcon = "#icon-tianmao1";
              if (item.user_type === 0) {
                userIcon = "#icon-taobao3";
              }
              result += `<li>
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
          } else {
            // 锁定
            me.lock();
            // 无数据
            me.noData();
          }
        }
        // 为了测试，延迟1秒加载
        setTimeout(function() {
          $("ul.wrapper[style='display: block;']").append(result);
          // 每次数据插入，必须重置

          me.resetload();
        }, 500);
      }
    }
  });
  return dropload;
}

function fn(id) {
  var detail = $($(`#${id}`).children()[0]).children();
  
  var detailJson = {
    num_iid: id,
    user_type: parseInt(detail[0].innerText),
    title: detail[1].innerText,
    disprice: parseInt(detail[2].innerText),
    price: parseInt(detail[3].innerText),
    volume: parseInt(detail[4].innerText),
    coupon_val: parseInt(detail[5].innerText),
    coupon_start_time: detail[6].innerText,
    coupon_end_time: detail[7].innerText,
    coupon_url: detail[8].innerText,
    img: detail[9].innerText,
    limit: detail[10].innerText,
    category: parseInt(detail[11].innerText),
    coupon_max: parseInt(detail[12].innerText),
    coupon_num: parseInt(detail[13].innerText),
    discount: parseFloat(detail[14].innerText),
    progress: parseFloat(detail[15].innerText)
    // tpwd: detail[9].innerText
  };
  sessionStorage.atDetail=JSON.stringify(detailJson);
  $.ajax({
    data: detailJson,
    type: 'POST',
    url: '/detail',
    dataType: 'json',
    success: function(data){
      if(data['err']){
        
      }else{
        mui.openWindow({
          url: `/detail?num_iid=${id}`, 
          id:'info'
        });
      }
    }
  });
}
