
var category = 0;
var tabIndex = 0;



$('#searchBody').ready(function(){
  init();
  var keyword = $('#keyword').attr("value");
  var Json1 = {
    keyword: keyword,
    page: 1,
    page_size: 100
  };
  $.ajax({
    data: Json1,
    type: 'POST',
    url: '/search',
    dataType: 'json',
    cache: false,//不保存缓存
    success: function(data){
      if(data['err']){
        sessionStorage.commodities=JSON.stringify(data);
      }else{
        sessionStorage.commodities=JSON.stringify(data['data']);
      }
    },
    error: function(xhr, type){
     
    }
  });

  //设置li里面的元素等高
  setLiHeight();
  

  //带有导航条的多页商品显示

  var wrapper = $("ul.wrapper");
  
  //精选懒加载
  preload(wrapper[0]);

  var dropload = sortLoad();
  sortMenu(dropload);
});