/**
 * Created by ZhangQiang on 2017-6-29.
 */
"use strict";

var TopClient = require("../../lib/api/topClient").TopClient;
var client = new TopClient({
  appkey: "***",
  appsecret: "***",
  // 'REST_URL' : 'http://gw.api.taobao.com/router/rest',
  REST_URL: "http://gw.api.taobao.com/router/rest"
});

let api = (module.exports = {
  adzone_id: "***",
  fields:'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url'
});

api.FindCouponsByTile = function(title, page, page_size, cb) {
  const selfThis = this;
  client.execute(
    "taobao.tbk.dg.item.coupon.get",
    {
      adzone_id: selfThis.adzone_id,
      q: title,
      page_size: page_size,
      page_no: page
    },
    function(error, response) {
      try {
        if (response.results && response.results.tbk_coupon) {
          cb(null, response.results.tbk_coupon);
        } else {
          console.log("FindCouponsByTile error1 " + title + " "+ response.results.tbk_coupon.length+ page,response,error);
          cb("err");
        }
      } catch (err) {
        console.log("FindCouponsByTile error2 " + title + " " + page + err,response,error);
        cb("err");
      }
    }
  );
};

api.FindCoupons = function(page, page_size, cb) {
  client.execute(
    "taobao.tbk.dg.item.coupon.get",
    {
      adzone_id: this.adzone_id,
      page_size: page_size,
      page_no: page,
      end_tk_rate: "2000"
    },
    function(error, response) {
      try {
        if (response.results && response.results.tbk_coupon) {
          cb(null, response.results.tbk_coupon);
        } else {
          console.log("FindCoupons error " + page);
          cb("err");
        }
      } catch (err) {
        console.log("FindCoupons error " + page + err);
        cb("err");
      }
    }
  );
};

api.FindCouponsByCategory = function(category, page, page_size, cb) {
  console.log({
    adzone_id: this.adzone_id,
    page_size: page_size,
    page_no: page,
    cat: category
  })
  client.execute(
    "taobao.tbk.dg.item.coupon.get",
    {
      adzone_id: this.adzone_id,
      page_size: page_size,
      page_no: page,
      cat: category
    },
    function(error, response) {
      try {
        if (response.results && response.results.tbk_coupon) {
          cb(null, response.results.tbk_coupon);
        } else {
          console.log("FindCouponsByCategory error " + category);
          cb("err");
        }
      } catch (err) {
        console.log("FindCouponsByCategory error " + category + err+ JSON.stringify(error,null,2));
        cb("err");
      }
    }
  );
};

api.FindCouponsByFilter = function(filter, cb) {
  
  filter.adzone_id = this.adzone_id;

  client.execute("taobao.tbk.dg.item.coupon.get", filter, function(
    error,
    response
  ) {
    try {
      if (response.results && response.results.tbk_coupon) {
        cb(null, response.results.tbk_coupon);
      } else {
        console.log("FindCouponsByFilter error11 " + JSON.stringify(filter,null,2),JSON.stringify(response,null,2));
        cb("err");
      }
    } catch (err) {
      console.log("FindCouponsByFilter error22 " + JSON.stringify(filter,null,2) +JSON.stringify(response,null,2)+ err);
      cb("err");
    }
  });
};

//url转淘口令
api.urlToTpwd = function(url, text, logo, cb) {
  client.execute(
    "taobao.tbk.tpwd.create",
    {
      text: text,
      url: url,
      logo: logo
    },
    function(error, response) {
      try {
        if (response.data) {
          cb(null, response.data);
        } else {
          console.log("urlToTpwd error ");
          cb("err");
        }
      } catch (err) {
        console.log("urlToTpwd error " + err);
        cb("err");
      }
    }
  );
};

//查找关联商品
api.FindRecommendByNum_iid = function(num_iid, count, cb) {
  client.execute(
    "taobao.tbk.item.recommend.get",
    {
      fields: this.fields,
      num_iid: num_iid,
      count: count,
      platform: "2"
    },
    function(error, response) {
      try {   
        if (response.results && response.results.n_tbk_item) {
          cb(null, response.results.n_tbk_item);
        } else {
          console.log("FindRecommendByNum_iid error ");
          cb("err");
        }
      } catch (err) {
        console.log("FindRecommendByNum_iid error " + JSON.stringify(err,null,2));
        cb("err");
      }
    }
  );
};
