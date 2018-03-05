
var category = 0;
var tabIndex = 0;

$('#miaoshaBody').ready(function(){
  init();
  $($('.jl nav.mui-bar.mui-bar-tab a')[2]).addClass('mui-active');
  var Json1 = {
    category: category,
    page: 1,
    page_size: 100
  };
  $.ajax({
    data: Json1,
    type: 'POST',
    url: '/miaosha',
    dataType: 'json',
    cache: false,//不保存缓存
    success: function(data){
      if(data['err']){
        sessionStorage.commodities='';
      }else{
        sessionStorage.commodities=JSON.stringify(data['data']);
      }
      // 为了测试，延迟1秒加载
    },
    error: function(xhr, type){
    }
  });
  //设置li里面的元素等高
  setLiHeight();

  var dropload = sortLoad();
  sortMenu(dropload);
});