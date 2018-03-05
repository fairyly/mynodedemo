/**
 * Created by ZhangQiang on 2017-6-26.
 * 仓库管理接口
 */
"use strict";

const superagent = require('superagent');
const NodeCache = require( "node-cache" );
//stdTTL:缓存有效时间，单位秒。
const myCache = new NodeCache( { stdTTL: 60*60*24, checkperiod: 0 } );


let cm = {
  coupon_val: 200,
  coupon_url: "http://www.taobao.com",
  title:
  "This is a title with the item, you can input a lot of msg in it, test test test",
  disprice: 500,
  img:
  "http://imgsrc.baidu.com/image/c0%3Dshijue%2C0%2C0%2C245%2C40/sign=9f058521ab8b87d6444fa35c6f61424d/54fbb2fb43166d22635322844c2309f79052d2fd.jpg",
  coupon_num: 900,
  coupon_max: 600,
  pla: 0,
  price: 600
};

let cm_1 = {
  coupon_val: 300,
  coupon_url: "http://www.taobao.com",
  title: "测试啊-1",
  disprice: 505,
  img: "http://img.sj33.cn/uploads/allimg/201302/1-130201105055.jpg",
  coupon_num: 90,
  coupon_max: 1600,
  pla: 1,
  price: 6300
};

// let mongodb = require('../db/MongodbMgr');
let tb = require("../tbk/TbkAPI");

let warehouse = (module.exports = {
  hotcommodities: [],
  redcommodities: [], //缓存12条数据16,21,11,35,50002766,1625,1801,30,50008165,50011699
  categories: [
    //类别 0女装 1男装 2鞋包配饰 3化妆品 4居家日用 5数码家电 6运动户外 7母婴用品 8汽车用品 9美食
    { id: 0, title: "精选", category: "", data: [] },
    { id: 1, title: "女装", category: "16", data: [] },
    { id: 2, title: "男装", category: "30", data: [] },
    { id: 3, title: "家居", category: "21,27", data: [] },
    { id: 4, title: "数码", category: "11,14,20", data: [] },
    { id: 5, title: "母婴", category: "35", data: [] },
    { id: 6, title: "食品", category: "50002766", data: [] },
    { id: 7, title: "鞋包", category: "50006842", data: [] },
    { id: 8, title: "美妝", category: "1801", data: [] },
    { id: 9, title: "童装", category: "50008165", data: [] },
    { id: 10, title: "运动", category: "50011699", data: [] },
    { id: 11, title: "汽车", category: "26", data: [] },
    { id: 12, title: "宠物", category: "29", data: [] },
    { id: 13, title: "计生", category: "2813", data: [] }
  ]
});

// var categories=[
//   { id: 0, title: "精选", category: "", data: [] },
//   { id: 1, title: "精品女装", category: "16", data: [] },
//   { id: 2, title: "精品男装", category: "30", data: [] },
//   { id: 3, title: "鞋靴", category: "50011740,50006843,50012029,50012048", data: [] },
//   { id: 4, title: "箱包", category: "50006842", data: [] },
//   { id: 5, title: "内衣配饰", category: "1625,50013864", data: [] },
//   { id: 6, title: "手机数码", category: "1512,50023904,50008090", data: [] },
//   { id: 7, title: "母婴", category: "35,50008165", data: [] },
//   { id: 8, title: "百货", category: "21", data: [] },
//   { id: 9, title: "珠宝配饰", category: "50011397", data: [] },
//   { id: 10, title: "运动户外", category: "50011699", data: [] },
//   { id: 11, title: "家电", category: "50022703,50012100,50012082", data: [] },
//   { id: 12, title: "食品", category: "50002766,50020275", data: [] },
//   { id: 13, title: "美妝", category: "1801", data: [] },
//   { id: 14, title: "家装", category: "50008164,27", data: [] },
//   { id: 15, title: "家居家纺", category: "50008163,50020808", data: [] },
//   { id: 16, title: "整车用品", category: "26,50024971", data: [] },
//   { id: 17, title: "宠物鲜花", category: "29,50007216", data: [] },
//   { id: 18, title: "图书乐器", category: "33,50017300", data: [] }
// ]
warehouse.Install = function (cb) {
  warehouse.LoadHotCommodities(err => {
    if (err) {
      cb(err);
    } else {
      warehouse.LoadRedCommodities(err => {
        if (err) {
          cb(err);
        } else {
          cb();
        }
      });
    }
  });
};

warehouse.PackCoupon = function (origin) {
  let coupon = {};
  //console.log(origin);
  if (origin.coupon_info == undefined) {
    console.log('异常数据: ',origin.num_iid);
    return '';
  } else {
    coupon.coupon_url = origin.coupon_click_url;
    coupon.title = origin.title;
    coupon.price = parseFloat(origin.zk_final_price);
    coupon.img = origin.pict_url;
    //coupon.img = origin.small_images.string[0];
    coupon.coupon_num = origin.coupon_remain_count;
    coupon.coupon_max = origin.coupon_total_count;
    coupon.pla = origin.user_type;
    coupon.volume = origin.volume;
    coupon.progress =
      (coupon.coupon_max - coupon.coupon_num) / coupon.coupon_max * 100;
    let site = 0;
    let lSite = 0;
    for (let i = origin.coupon_info.length - 2; i >= 0; i--) {
      if (isNaN(origin.coupon_info[i])) {
        site = i;
        break;
      }
    }

    let num = origin.coupon_info.substring(
      site + 1,
      origin.coupon_info.length - 1
    );

    for (let i = 1; i <= origin.coupon_info.length; i++) {
      if (isNaN(origin.coupon_info[i])) {
        lSite = i;
        break;
      }
    }

    let limit = origin.coupon_info.substring(1, lSite);
    coupon.limit = limit;

    coupon.coupon_val = parseFloat(num);
    coupon.user_type = origin.user_type;
    coupon.coupon_start_time = origin.coupon_start_time;
    coupon.coupon_end_time = origin.coupon_end_time;
    coupon.disprice = parseFloat(coupon.price) - parseFloat(num);
    coupon.disprice = parseFloat(coupon.disprice.toFixed(2));
    coupon.discount = coupon.coupon_val / coupon.price;
    coupon.num_iid = origin.num_iid;
    coupon.category = origin.category;

    return coupon;
  }

};

warehouse.FindRecommendByNum_iid_wh = function (num_iid, count, cb) {
  tb.FindRecommendByNum_iid(num_iid, count, (err, data) => {
    if (err) {
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

warehouse.urlToTpwd_wh = function (url, text, logo, cb) {
  tb.urlToTpwd(url, text, logo, (err, data) => {
    if (err) {
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

warehouse.FindCommoditiesByTitle_wh = function (keyword, page, page_size, cb) {
  tb.FindCouponsByTile(keyword, page, page_size, (err, data) => {
    if (err) {
      cb(err);
    } else {
      let res_data = [];
      let size = data.length;
      for (let i = 0; i < size; i++) {
        if(warehouse.PackCoupon(data[i]) !==''){
          res_data.push(warehouse.PackCoupon(data[i]));
        }
        
      }
      cb(null, res_data);
    }
  });
};

warehouse.FindCouponsByFilter_wh = function (filter, cb) {
  tb.FindCouponsByFilter(filter, (err, data) => {
    if (err) {
      cb(err);
    } else {
      let res_data = [];
      let size = data.length;
      for (let i = 0; i < size; i++) {
        if(warehouse.PackCoupon(data[i]) !==''){
          res_data.push(warehouse.PackCoupon(data[i]));
        }
      }
      cb(null, res_data);
    }
  });
};

warehouse.FindCommoditiesByCategory_wh = function (
  category,
  page,
  page_size,
  cb
) {
  if (category == 0 || category >= warehouse.categories.length) {
    //0搜索全部
    if (page == 0) {
      cb(null, warehouse.redcommodities);
      return;
    }
    var cat = "";
    tb.FindCouponsByFilter(
      {
        page_size: page_size,
        page_no: page,
        end_tk_rate: "1000"
      },
      (err, data) => {
        if (err) {
          cb(err);
        } else {
          let res_data = [];
          let size = data.length;
          for (let i = 0; i < size; i++) {
            if(warehouse.PackCoupon(data[i]) !==''){
              res_data.push(warehouse.PackCoupon(data[i]));
            }
          }
          cb(null, res_data);
        }
      }
    );

    return;
  }
  tb.FindCouponsByCategory(
    warehouse.categories[category].category,
    page,
    page_size,
    (err, data) => {
      if (err) {
        cb(err);
      } else {
        let res_data = [];
        let size = data.length;
        for (let i = 0; i < size; i++) {
          if(warehouse.PackCoupon(data[i]) !==''){
            res_data.push(warehouse.PackCoupon(data[i]));
          }
        }
        cb(null, res_data);
      }
    }
  );
};

//获取相关商品
warehouse.getRecommend_wh = function (num_iid, count, cb) {
  var that = this;
  var RecommendArr = [];
  var index = 0;
  tb.FindRecommendByNum_iid(num_iid, count, (err, data) => {
    if (err) {
      cb(err);
    } else {
      data.forEach(function (element) {
        console.log(element.title.replace(/[^\u4e00-\u9fa5a-zA-Z\d]+/g, ""));
        tb.FindCouponsByTile(
          element.title, 1, 1,
          (err, data1) => {
            index++;
            let res_data = {}
            if (err) {
              cb(err);
            } else {
              let res_data = [];
              let size = data1.length;
              for (let i = 0; i < size; i++) {
                if(warehouse.PackCoupon(data[i]) !==''){
                  RecommendArr.push(warehouse.PackCoupon(data[i]));
                }
              }

              if (index >= data.length) {
                cb(null, RecommendArr);
              }
            }
          }
        );
      }, this);

    }
  });
};

//加载12个热门商品 佣金比率20%以上的
warehouse.LoadHotCommodities = function (cb) {
  tb.FindCouponsByFilter(
    {
      page_size: "100",
      page_no: "1"
    },
    (err, data) => {
      if (err) {
        cb(err);
      } else {
        let res_data = [];
        let size = data.length;
        for (let i = 0; i < size; i++) {
          if(warehouse.PackCoupon(data[i]) !==''){
            res_data.push(warehouse.PackCoupon(data[i]));
          }
        }
        warehouse.hotcommodities = res_data;
        cb();
      }
    }
  );
};

//预加载 16个首页商品
warehouse.LoadRedCommodities = function (cb) {
  tb.FindCouponsByFilter(
    {
      page_size: "10",
      page_no: "1"
    },
    (err, data) => {
      if (err) {
        cb(err);
      } else {
        let res_data = [];
        let size = data.length;
        for (let i = 0; i < size; i++) {
          if(warehouse.PackCoupon(data[i]) !==''){
            res_data.push(warehouse.PackCoupon(data[i]));
          }
        }
        warehouse.redcommodities = res_data;
        cb();
      }
    }
  );
};

//预加载 首页所有分类的数据allcommodities,每个100条
warehouse.LoadAllCommodities = function (cb) {
  warehouse.allcommodities = [];
  var index = 0;
  warehouse.categories.forEach(function (element) {
    if (element.id > 0) {
      tb.FindCouponsByCategory(element.category, "1", "10", (err, data) => {
        index++;
        if (err) {
          cb(err);
        } else {
          let res_data = [];
          let size = data.length;
          for (let i = 0; i < size; i++) {
            if(warehouse.PackCoupon(data[i]) !==''){
              res_data.push(warehouse.PackCoupon(data[i]));
            }
          }
          if (res_data.length <= 0) {
          } else {
            element["data"] = res_data;
          }

        }
        if (index == warehouse.categories.length) {
          cb();
        }
      });
    } else {
      //设置自定义的分类，如-1秒杀
    }
  }, this);
};
// warehouse.LoadAllCommodities(() => {
//     // var catLength = warehouse.categories.length;
//     // var miaosha = [];
//     // var miaoshaId = 0;
//     // warehouse.categories.forEach(function(element,index) {

//     //     if( element.id>0 && element.data !== []){;
//     //         miaosha.push(element.data.sort(warehouse.getSortFun('desc', 'discount')).slice(0,9));
//     //     }
//     //     if(element.id === -1){
//     //         miaoshaId = index;
//     //     }
//     // }, this);
//     // warehouse.categories[miaoshaId].data = miaosha;
// });


warehouse.getSortFun = function (order, sortBy) {
  var ordAlpah = order == "asc" ? ">" : "<";
  var sortFun = new Function(
    "a",
    "b",
    "return a." + sortBy + ordAlpah + "b." + sortBy + "?1:-1"
  );
  return sortFun;
};

//定时任务每天11点更新热门商品
let schedule = require("node-schedule");
let rule = new schedule.RecurrenceRule();
rule.hour = 11;
schedule.scheduleJob(rule, () => {
  warehouse.LoadHotCommodities(() => { });
  // warehouse.LoadRedCommodities(() => {});
  // warehouse.LoadAllCommodities(() => {});
});
var j = 1;

for (var index = 1; index < 13; index++) {
  schedule.scheduleJob(`30 ${5+index} 3 * * *`, () => {
    if(j === 1){
      myCache.del( "miaosha_data", function( err, count ){
        if( !err ){
          console.log(`delete Success : miaosha_data `, count ); 
        }else{
          console.log(`delete fail : miaosha_data `, err ); 
        }
      });
      for (var i = 1; i < 13; i++) {
        myCache.del( `category_${i}_data`, function( err, count ){
          if( !err ){
            console.log(`delete Success : category_${i}_data `, count ); 
          }else{
            console.log(`delete fail : category_${i}_data `, err ); 
          }
        });
      }
    }
    var url = `http://www.5aiss.com/category`;
    var Json1 = {
      category: j++,
      page: 1,
      page_size: 100
    };
    if(j==13){
      j=1;
    }
    superagent
      .post(url)
      .send(Json1) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        if(err){
          console.log(`Error: ${Json1.category} --- ${err}`);
        }else{
          console.log(`Success: ${Json1.category} --- ${res.body.data.length}`);
        }
      });
  });
}

