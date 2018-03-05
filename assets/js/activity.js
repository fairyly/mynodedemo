$(function() {
  $($('.jl nav.mui-bar.mui-bar-tab a')[3]).addClass('mui-active');
  init();
  var btns = document.querySelectorAll("button");
  var clipboard = new Clipboard(btns);
  clipboard.on("success", function(e) {
    mui.toast("淘口令复制成功,请打开【手机淘宝】查看活动详情", { duration: "long", type: "div" });
  });
  clipboard.on("error", function(e) {
    mui.toast("淘口令复制失败,请手动复制虚线框内的淘口令", { duration: "long", type: "div" });
  });
});