var request = require('request');//发送请求的库
var cheerio = require('cheerio');//解析html的库
var path = require('path');//路径
var fs = require('fs');//文件系统
var iconv = require("iconv-lite");
var Buffer = require('buffer').Buffer;
var url = 'http://www.biquge001.com/Book/16/16368/';
var url1 = 'http://www.biquge001.com';
var bookname = '';
var slog = require('single-line-log').stdout;
var _ = require('lodash')._;
var loading = ['—','—','\\','\\','|','|','/','/'];

getHtmlByUrl(url);

function getHtmlByUrl(href) {
    request({uri: href,encoding: 'binary'}, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            let $ = cheerio.load(iconv.decode(body, 'gb2312').toString());
            let fiction = $('dd').toArray();
            let list = [];
            for (let i = 0; i < fiction.length; i++) {
                list.push(url1+fiction[i].children[0].attribs.href);//章节地址
            }
            let bookname1 = $('h1').toArray();
            bookname = bookname1[0].children[0].data;//书名
            let wrlist = [];
            let denominator = list.length;//进度百分比的分母
            let numerator = 1;//进度百分比的分子
            let quan = 0;//loading的下标
            for (let i = 0; i < list.length; i++) {
                wrlist[i] =  new Promise(function (resolve, reject) {
                    request({uri: list[i],encoding: 'binary'}, function(err, response, body) {
                        if (!err && response.statusCode == 200) {
                            let $ = cheerio.load(iconv.decode(body, 'gb2312').toString());
                            let headline = $('h1').toArray();
                            let title = headline[0].children[0].data+'\r\n';//章节标题
                            let content = $('div').toArray();
                            let chapter=[];
                            let neirong = '';
                            for (let i = 0; i < content.length; i++) {
                                if (content[i].attribs.id == 'content') {
                                    chapter.push(content[i].children);
                                }
                            }
                            for (let i = 0; i < chapter[0].length; i++) {
                                if (chapter[0][i].type == 'text') {
                                    neirong = neirong + chapter[0][i].data+'\r\n';//章节内容
                                }
                            }
                            resolve({title:title,content:neirong});
                            process.stdout.write('\r');
                            let progress = '[';
                            for (var i = 0; i < ((numerator/denominator) * 50); i++) {
                                progress += '#';
                            }
                            for (var i = 0; i < (50-((numerator/denominator) * 50)); i++) {
                                progress += ' ';
                            }
                            progress += ']';
                            quan = quan+1;
                            if(quan >= 8){
                                quan = 0;
                            }
                            process.stdout.write(loading[quan]);//loading。。。
                            process.stdout.write(progress);//进度条
                            process.stdout.write(_.ceil(((numerator/denominator) * 100), 0) + '%');//进度百分比
                            numerator = numerator + 1;
                        } else {

                        }
                    });
                });
            }
            Promise.all(wrlist).then(function (results) {
                write(results);
            });
        } else {
            console.log('get page error url => ' + href);
        }
    });
}

function write(value){
    process.stdout.write('\r');
    let xierustr = '';
    const writerStream = fs.createWriteStream('./'+bookname+'.txt');
    for (let i = 0; i < value.length; i++) {
        xierustr = xierustr + value[i].title+'\r\n'+value[i].content;
    }
    writerStream.write(xierustr);
    writerStream.end();
    writerStream.on('finish',function(){
        process.stdout.write('\r\n写入完成');
    })
    writerStream.on('error',function(){
        process.stdout.write('\r\n写入失败');
    })
}
