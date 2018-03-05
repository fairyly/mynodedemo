
var category = 0;
var tabIndex = 0;
$(function(){
  init();
  $($('.jl nav.mui-bar.mui-bar-tab a')[4]).addClass('mui-active');
  if(localStorage.collect === '' || localStorage.collect == undefined){
    sessionStorage.commodities='';
  }else{
    sessionStorage.commodities=localStorage.collect;
  }
  
  //设置li里面的元素等高
  setLiHeight();
  //带有导航条的多页商品显示
  var wrapper = $("ul.wrapper");
  //精选懒加载
  preload(wrapper[0]);

  var dropload = sortLoad();
  sortMenu(dropload);
});