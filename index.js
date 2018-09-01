"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./node_modules/@types/node/index.d.ts"/>
const https = __importStar(require("https"));
const util_1 = require("util");
const per_page = 100;
const now = new Date();
const sevenDaysAgo = new Date((new Date()).setDate(now.getDate() - 7));
const oneDayAgo = new Date((new Date()).setDate(now.getDate() - 1));
const searchStopDate = oneDayAgo;
var pageNum = 1;
getQiitaItems(pageNum, per_page);
function getQiitaItems(pageNum, per_page) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. record executed DateTime
        var nowTime = (new Date()).getTime();
        //console.log(`nowTime: ${nowTime}`)
        // 2. Call API get Qiita Item in the form of Json.
        var URL = `https://qiita.com/api/v2/items?page=${pageNum}&per_page=${per_page}`;
        console.log(URL);
        let json = yield getJson(URL);
        if (util_1.isUndefined(json)) {
            return;
        }
        // 3. get the minimum "created_at" Date from Qiita Item Json.
        let minCreatedAt = getMinimumCreatedAt(json);
        // 4. repeat if not reach the stop date
        if (minCreatedAt.getTime() > searchStopDate.getTime()) {
            // limit 1 request per 3.6 second
            var offset = (nowTime - (new Date()).getTime()) + 3600;
            //console.log(`offset : ${offset}`)
            setTimeout(() => {
                getQiitaItems(pageNum + 1, per_page);
            }, offset);
        }
    });
}
function getJson(url) {
    return new Promise(resolve => {
        https.get(url, { headers: { Authorization: `Bearer ${process.env.Authorization}` } }, function (res) {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', (res) => {
                res = JSON.parse(body);
                resolve(res);
            });
        }).on('error', (e) => {
            console.log(e.message);
            resolve(undefined);
        });
    });
}
function getMinimumCreatedAt(json) {
    let createdAtArray = json.map(function (o) { return new Date(o.created_at); });
    return new Date(Math.min.apply(null, createdAtArray));
}
//# sourceMappingURL=index.js.map