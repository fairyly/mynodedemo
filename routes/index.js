'use strict'

var express = require('express');
var router = express.Router();
var escaper = require("true-html-escape");
var makeUnique = require('tfk-unique-array')
let tdt = require('../server/TDTMgr');
let activity = require('../data/activity.json');
var checkCategores = require('../middlewares/index').checkCategores;
const NodeCache = require( "node-cache" );
//stdTTL:缓存有效时间，单位秒。
const myCache = new NodeCache( { stdTTL: 60*60*24, checkperiod: 0 } );


var getSortFun = function (order, sortBy) {
    var ordAlpah = order == "asc" ? ">" : "<";
    var sortFun = new Function(
      "a",
      "b",
      "return a." + sortBy + ordAlpah + "b." + sortBy + "?1:-1"
    );
    return sortFun;
  };

//title: '淘殿堂', describe: '免费领取各种淘宝优惠券 正当时快乐购'
/* GET home page. *///'16,30,50008165,1625,1801,21,11,5001169935,50002766'
router.get('/', function (req, res, next) {
    var local = {
        keywords: tdt.keywords,
        hotcommodities: tdt.GetHotCommoditiesInCache().slice(0, 10),
        activity: activity.activity
    }
    res.render('index', local);
});


router.get('/hot', function (req, res, next) {
    // res.render('index', { title: '淘殿堂' , describe : '淘宝优惠券查询系统'});
    res.render('hot');
});

router.get('/collect', function (req, res, next) {
    res.render('collect');
});
router.get('/activity', function (req, res, next) {
    var local = {
        activity: activity.activity
    }
    res.render('activity',local);
});

router.get('/detail', function (req, res, next) {
    var num_iid = req.query.num_iid;
    var detailJson = '';
    var detailJsonArr = myCache.get(`detailJsonArr`);
    if(detailJsonArr === undefined || detailJsonArr === []){
        myCache.set( `detailJsonArr`, []);
        detailJsonArr = [];
    }
    if (!req.query.num_iid) {
        res.send({ err: '已经搜索不到更多的宝贝了' });
    }
    else {
        if(req.session.detailJson === undefined ||req.session.detailJson =='' ){
            for (var index = 0; index < detailJsonArr.length; index++) {
                var element = detailJsonArr[index];
                if(num_iid === element.num_iid){
                    detailJson = element;
                }
            }
        }else{
            detailJson = req.session.detailJson;
        }
        // tdt.getRecommend(
        //     detailJson.num_iid,
        //     10
        //     ,
        //     (err, data) => {
        //         if(err){
        //             console.log(err);
        //         }else{
        //             var local = {
        //                 detailJson: detailJson,
        //                 relevant: data
        //             }
        //             res.render('detail', local);
        //         }
        //     }
        //   );
        tdt.FindCouponsByFilter(
            {
                'cat': detailJson.category,
                page_size: 10,
                page_no: 1,
                q: detailJson.title.slice(0, detailJson.title.length / 2).replace(/(\s*)/g, "")
            },
            (err, data) => {
                let res_data = {}
                if (err) {
                    data=[];
                    res_data.err = '已经搜索不到更多的宝贝了';
                }
                else {
                }
                var local = {
                    detailJson: detailJson,
                    relevant: data
                }
                res.render('detail', local);
            }
        );
    }
});


/**通过类别获取宝贝*/
/**通过关键字搜索*/
router.get('/category', function (req, res, next) {

    if (!req.query.id) {
        var error = {
            status: 404,
            stack: "error"
        }
        var local = {
            message: "没有查找到相关宝贝信息",
            error: error
        }
        res.render('error', local);
    }
    else {
        var local = {
            category: req.query.id
        }
        res.render('category', local);
    }
})

router.get('/miaosha', function (req, res, next) {
    res.render('miaosha');
});


router.post('/miaosha',checkCategores, function (req, res) {
    if (!req.body.page || !req.body.page_size) {
        res.send({ err: '已经搜索不到更多的宝贝了' });
    }
    else {
        var miaoshaData = myCache.get(`miaosha_data`);
        if(miaoshaData == undefined  || miaoshaData === []){
            myCache.set( `miaosha_data`, []);
            miaoshaData = [];
        }
        if (miaoshaData.length > 0) {
            res.send({ data: miaoshaData });
        } else {
            var hot = tdt.GetHotCommoditiesInCache();
            res.send({ data: tdt.GetHotCommoditiesInCache() });
        }
    }
})

router.post('/category', function (req, res) {
    console.log('``````````````',req.body.category)
    if (!req.body.category || !req.body.page || !req.body.page_size) {
        res.send({ err: '已经搜索不到更多的宝贝了' });
    }
    else {
        var categoryData = myCache.get(`category_${req.body.category}_data`);
        var miaoshaData = myCache.get(`miaosha_data`);
        if(miaoshaData === undefined || miaoshaData === []){
            myCache.set( `miaosha_data`, []);
            miaoshaData = [];
        }
        if(categoryData == undefined || categoryData === []){
            myCache.set( `category_${req.body.category}_data`, []);
            categoryData = [];
        }
        var page = parseInt(req.body.page);
        var page_size = parseInt(req.body.page_size);
        if (categoryData != undefined && categoryData.length >= 80) {
            if (miaoshaData === undefined || miaoshaData === []) {
                myCache.set( `miaosha_data`, categoryData.sort(getSortFun('desc', 'discount')).slice(0, 10));
            }
            res.send({ data: categoryData.slice((page - 1) * page_size, page_size * page - 1) });
        } else {
            tdt.FindCommoditiesByCat(req.body.category, req.body.page, req.body.page_size, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send({ err: '没有查找到相关宝贝信息' });
                }
                else {
                    if (data.length >= 80) {
                        myCache.set( `category_${req.body.category}_data`, data);
                    }
                    if (data.length >= 30) {
                        
                        if (miaoshaData === undefined || miaoshaData.length<=0 || miaoshaData == []) {
                            myCache.set( `miaosha_data`, data.sort(getSortFun('desc', 'discount')).slice(0, 10));
                        } else {
                            myCache.set( `miaosha_data`, myCache.get(`miaosha_data`).concat(data.sort(getSortFun('desc', 'discount')).slice(0, 10)));
                        }
                    }
                    res.send({ data: data });
                }
            });
        }
    }
})

/**通过关键字搜索*/
router.get('/search', function (req, res, next) {
    var page = 1;
    var page_size = 10;
    if (!req.query.keyword) {
        var error = {
            status: 404,
            stack: "error"
        }
        var local = {
            message: "没有查找到相关宝贝信息",
            error: error
        }
        res.render('error', local);
    }
    else {
        var local = {
            keyword: req.query.keyword
        }
        res.render('search', local);
    }
})

router.post('/search', function (req, res) {
    let res_data = {}
    if (!req.body.keyword || !req.body.page || !req.body.page_size) {
        res_data.err = '已经搜索不到更多的宝贝了';
        res.send(res_data);
    }
    else {
        tdt.FindCommoditiesByTitle(req.body.keyword, req.body.page, req.body.page_size, function (err, data) {
            
            if (err) {
                console.log(err,'已经搜索不到更多的宝贝了');
                //res_data.err = '已经搜索不到更多的宝贝了';
                tdt.FindCommoditiesByTitle(req.body.keyword, req.body.page, 10, function (err, data) {
                    if (err) {
                        console.log(err,'已经搜索不到更多的宝贝了');
                        res_data.err = '已经搜索不到更多的宝贝了';
                        
                    }
                    else {
                        
                    }
                    res_data.data = data;
                    res.send(res_data);
                })
            }
            else {
                tdt.AddSearchKeyword(req.body.keyword);
                res_data.data = data;
                res.send(res_data);
            }
            
        })
    }
});

router.post('/detail', function (req, res, next) {
    var detailJson = {
        num_iid: req.body.num_iid,
        user_type: req.body.user_type,
        title: req.body.title,
        disprice: req.body.disprice,
        price: req.body.price,
        volume: req.body.volume,
        coupon_val: req.body.coupon_val,
        coupon_start_time: req.body.coupon_start_time,
        coupon_end_time: req.body.coupon_end_time,
        coupon_url: req.body.coupon_url,
        limit: req.body.limit,
        img: req.body.img,
        category: req.body.category,
        tpwd: ''
    }
    if (!req.body.num_iid || !req.body.coupon_url || !req.body.title || !req.body.img) {
        res.send({ err: '已经搜索不到更多的宝贝了' });
    }
    else {
        tdt.urlToTpwd(req.body.coupon_url, req.body.title, req.body.img, function (err, data) {
            if (err) {
                console.log("err:", err);
                req.session.detailJson = detailJson;
                res.send({ err: err });
            } else {
                detailJson.tpwd = data.model;
                req.session.detailJson = detailJson;
                var detailJsonArr = myCache.get(`detailJsonArr`);
                if(detailJsonArr === undefined || detailJsonArr === []){
                    myCache.set( `detailJsonArr`, []);
                    detailJsonArr = [];
                }
                if(detailJsonArr.length >= 200){
                    detailJsonArr.shift();
                }

                detailJsonArr.push(detailJson);

                detailJsonArr = makeUnique(detailJsonArr); //去重
                myCache.set( `detailJsonArr`, detailJsonArr);
                res.send({ data: 'success' });
            }
        })
    }

})

module.exports = router;
