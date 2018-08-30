'use strict'

let http = require('https');
const per_page = 100;
const now = new Date();
const sevenDaysAgo = new Date((new Date()).setDate(now.getDate() - 7));
var pageNum = 1;
getQiitaItems(pageNum, per_page);

async function getQiitaItems(pageNum, per_page){
    var nowTime = (new Date()).getTime()
    //console.log(`nowTime: ${nowTime}`)
    var URL = `https://qiita.com/api/v2/items?page=${pageNum}&per_page=${per_page}`;
    console.log(URL);
    let json = await getJson(URL)
    let minCreatedAt = getMinimumCreatedAt(json);
    if (minCreatedAt.getTime() > sevenDaysAgo.getTime()){
        var offset = (nowTime - (new Date()).getTime()) + 3600
        //console.log(`offset : ${offset}`)
        setTimeout(() => {
            getQiitaItems(pageNum + 1, per_page);
        }, offset);
    }
}

function getJson(url){
    return new Promise(resolve => {
        http.get(url,{headers : {Authorization : `Bearer ${process.env.Authorization}`}}, function(res){
            let body = '';
            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                body += chunk;
            })

            res.on('end', (res) => {
                res = JSON.parse(body);
                resolve(res);
            });
        }).on('error', (e) => {
            console.log(e.message);
            resolve(e);
        });
    });
}

function getMinimumCreatedAt(json){
    let createdAtArray = json.map(function(o){return new Date(o.created_at);});
    return new Date(Math.min.apply(null, createdAtArray));
}