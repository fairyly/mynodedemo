const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');


var url = 'http://pub.alimama.com/myunion.htm?spm=a219t.7900221/1.1998910419.dd403b0ca.5c2e1a8dVrAUhA#!/promo/self/activity?spm=a219t.7900221%2F1.1998910419.dd403b0ca.5c2e1a8dVrAUhA&toPage=1&platformType=2';
var file = '../../data/activity.html';
var fileJson ='../../data/activity.json';
class Crawler{
  getCodeBody(url) {
    return new Promise(function (resolve,reject) {
      superagent.get(url)
      .end(function (err, res) {
          if (res) {
              resolve(null);
          } else {
              
          }
      });
    })
  }
  getCodeBodyByFile(file){
    return fs.readFileSync(path.join(__dirname,file));
  }
  analysis(html){
    var $ = cheerio.load(html);
    var arr = $("#J_act_table").find('tr');
    var title = '';
    var user_type = '';
    var platform = '';
    var img = '';
    var url = '';
    var start_time = '';
    var end_time = '';
    var activityJson = {
      activity: []
    }
    for (var index = 0; index < arr.length; index++) {
      var item = arr[index];
      img = $(item).find('img').attr('src');
      title = $(item).find('.title a').attr('title');

      var temp = $($(item).find('ul li')[1]).text();
      user_type = temp.slice(temp.length-2);
      platform = $($(item).find('td')[1]).text();
      start_time = $($($(item).find('td')[3]).find('p')[0]).text().slice(2);;
      end_time = $($($(item).find('td')[3]).find('p')[1]).text().slice(2);
      var Json = {
        "img": img,
        'title': title,
        'user_type': user_type,
        "platform": platform,
        "url": url,
        "tpwd": "",
        "start_time": start_time,
        "end_time": end_time
       }
       activityJson.activity.push(Json);
    }
    fs.writeFile(path.join(__dirname,fileJson),JSON.stringify(activityJson,null,2))
  }
}

var crawler = new Crawler();

crawler.analysis(crawler.getCodeBodyByFile(file));