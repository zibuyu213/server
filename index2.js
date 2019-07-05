var request = require('request');//发送请求的库
var cheerio = require('cheerio');//解析html的库
var path = require('path');//路径
var fs = require('fs');//文件系统
var url = "https://www.mzitu.com/taiwan/";
var responsestr = 'error';



//发送请求
async function getHtmlByUrl(href) {
    request(href, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            console.log(responsestr);
			 var $ = cheerio.load(body);
             var list = $('img').toArray();
             //console.log(list[0].attribs['data-original']);
             //保存当页图片--start---
             let list1 = [];
             for (var i = 0; i < list.length; i++) {
                 if(list[i].attribs.class=='lazy'){
                     list1.push(list[i]);
                 }
             }
             for (var i = 0; i < list1.length; i++) {
                // console.log(href+'-------'+list1[i].attribs['data-original']+'-------'+'./'+list1[i].attribs.alt+'.jpg');
                 download(href,list1[i].attribs['data-original'],'./台湾妹子/'+list1[i].attribs.alt.replace('/',"").replace('\\',"").replace('?',"").replace('\r',"").replace('\n',"").replace('\t',"")+'.jpg');
             }
              //保存当页图片--end---

              //返回url--start---
               var list2 = $('a').toArray();
               let aa = '';
             // console.log(list2[0].attribs.href);
              for (var i = 0; i < list2.length; i++) {
                  if(list2[i].attribs.class=='next page-numbers'){
                      aa = list2[i].attribs.href;
                      responsestr = aa;
                  }
              }
              if(aa!=''){
                  setTimeout(function(){getHtmlByUrl(responsestr)},3000);
              }else{
                  console.log('结束');
              }
              //if(){}
              //返回url--end---


			// console.log(meizi[0].attribs);
        } else {
            setTimeout(function(){getHtmlByUrl(responsestr)},2000);
        }
    }

);
}

// console.log(url!='error');
// while(url!='error'){
//     url = getHtmlByUrl(url);
// }
// //getHtmlByUrl(url);
getHtmlByUrl(url);
//保存图片
function download(baseurl,url,saveurl){
    let headers = {
        "Host": "i.meizitu.net",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": baseurl,
        "DNT": 1,
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": 1,
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "TE": "Trailers",
    };
    request({
        url: url,
        resolveWithFullResponse: true,
        headers
    }).pipe(fs.createWriteStream(saveurl));
}

//
// var laoshi = {
//     name:'',
//     age:'',
// }
// laoshi.name = '23';
// baocun
// duchulai
//
// console.log(laoshi.name);

//字符串转对象
// var obj = eval('(' + str + ')');
// var last = obj.toJSONString();
// var obj = eval('(' + last + ')');
