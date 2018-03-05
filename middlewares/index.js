const NodeCache = require("node-cache");
const superagent = require("superagent");
//stdTTL:缓存有效时间，单位秒。
const myCache = new NodeCache({ stdTTL: 60 * 60 * 24, checkperiod: 0 });

var getSortFun = function (order, sortBy) {
  var ordAlpah = order == "asc" ? ">" : "<";
  var sortFun = new Function(
    "a",
    "b",
    "return a." + sortBy + ordAlpah + "b." + sortBy + "?1:-1"
  );
  return sortFun;
};

module.exports = {
  checkCategores: function checkCategores(req, res, next) {
    for (var index = 1; index < 13; index++) {
      var categoryData = myCache.get(`category_${index}_data`);
      var miaoshaData = myCache.get(`miaosha_data`);
      if (miaoshaData === undefined || miaoshaData === []) {
        myCache.set(`miaosha_data`, []);
        miaoshaData = [];
      }
      if (categoryData == undefined || categoryData === []) {
        myCache.set(`category_${index}_data`, []);
        categoryData = [];
      }
      if (categoryData != undefined && categoryData.length >= 10) {
        if (miaoshaData === undefined || miaoshaData === []) {
          myCache.set(
            `miaosha_data`,
            categoryData.sort(getSortFun("desc", "discount")).slice(0, 10)
          );
        }
      }
    }
    next();
  }
};
