function collect() {
  var collect = [];
  var collect_num_iids = [];
  var atDetail = JSON.parse(sessionStorage.atDetail);
  if (localStorage.collect && "" != localStorage.collect) {
    collect = JSON.parse(localStorage.collect);
    for (var index = 0; index < collect.length; index++) {
      collect_num_iids.push(collect[index].num_iid);
    }
  }
  if ($(".fix-mall-index.fl a.collect i").css("color") === "rgb(255, 0, 0)") {
    if (collect_num_iids.indexOf(atDetail.num_iid) >= 0) {
      collect.splice(collect_num_iids.indexOf(atDetail.num_iid), 1);
      localStorage.collect = JSON.stringify(collect);
      $(".fix-mall-index.fl a.collect i").css("color", "#909090");
      mui.toast("取消宝贝收藏成功", { duration: "long", type: "div" });
    }
  } else {
    if (sessionStorage.atDetail && "" != sessionStorage.atDetail) {
      if (collect.length < 20) {
        collect.push(atDetail);
        localStorage.collect = JSON.stringify(collect);
        $(".fix-mall-index.fl a.collect i").css("color", "red");
        mui.toast("收藏成功", { duration: "long", type: "div" });
      } else {
        mui.toast("收藏失败，亲最多只能收藏20个宝贝", { duration: "long", type: "div" });
      }
    }
  }
}

function checkCollect(num_iid) {
  var collect = [];
  if (localStorage.collect && "" != localStorage.collect) {
    collect = JSON.parse(localStorage.collect);
  }
  var item = "";
  for (var index = 0; index < collect.length; index++) {
    item = collect[index];
    if (item.num_iid === num_iid) {
      $(".fix-mall-index.fl a.collect i").css("color", "red");
      return true;
    }
  }
}

$(function() {
  var num_iid = parseInt($("#num_iid")[0].innerText);
  preload("ul.wrapper");
  init();
  //设置li里面的元素等高
  setLiHeight();

  var btns = document.querySelectorAll("button");
  var clipboard = new Clipboard(btns);
  clipboard.on("success", function(e) {
    mui.toast("淘口令复制成功,请打开【手机淘宝】领券", { duration: "long", type: "div" });
  });
  clipboard.on("error", function(e) {
    mui.toast("淘口令复制失败,请手动复制虚线框内的淘口令", { duration: "long", type: "div" });
  });
  checkCollect(num_iid);
});
