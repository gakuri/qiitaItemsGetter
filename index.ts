/// <reference path="./node_modules/@types/node/index.d.ts"/>
import * as https from 'https';
import { isUndefined } from 'util';
import { ClientResponse } from 'http';

const per_page : number = 100;
const now : Date = new Date();
const sevenDaysAgo : Date = new Date((new Date()).setDate(now.getDate() - 7));
const oneDayAgo : Date = new Date((new Date()).setDate(now.getDate() - 1));
const searchStopDate : Date = oneDayAgo;

var pageNum : number = 1;
getQiitaItems(pageNum, per_page);

async function getQiitaItems(pageNum: number, per_page: number) : Promise<void> {
	// 1. record executed DateTime
    var nowTime : number = (new Date()).getTime()
	//console.log(`nowTime: ${nowTime}`)
	
	// 2. Call API get Qiita Item in the form of Json.
    var URL = `https://qiita.com/api/v2/items?page=${pageNum}&per_page=${per_page}`;
	console.log(URL);
    let json : Array<QiitaItem> = await getJson(URL)
	if (isUndefined(json)){ return;}
	
	// 3. get the minimum "created_at" Date from Qiita Item Json.
	let minCreatedAt = getMinimumCreatedAt(json);
	
	// 4. repeat if not reach the stop date
    if (minCreatedAt.getTime() > searchStopDate.getTime()){

		// limit 1 request per 3.6 second
        var offset = (nowTime - (new Date()).getTime()) + 3600
        //console.log(`offset : ${offset}`)
        setTimeout(() => {
            getQiitaItems(pageNum + 1, per_page);
        }, offset);
    }
}

function getJson(url : string) :Promise<Array<QiitaItem>>{
    return new Promise(resolve => {
        https.get(url,{headers : {Authorization : `Bearer ${process.env.Authorization}`}}, function(res: ClientResponse){
            let body : string = '';
            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                body += chunk;
            })

            res.on('end', (res: any) => {
                res = JSON.parse(body);
                resolve(res);
            });
        }).on('error', (e) => {
            console.log(e.message);
            resolve(undefined);
        });
    });
}

function getMinimumCreatedAt(json : Array<QiitaItem>): Date {
    let createdAtArray: Array<Date> = json.map(function(o: QiitaItem){return new Date(o.created_at);});
    return new Date(Math.min.apply(null, createdAtArray));
}

interface QiitaItem{
	rendered_body: string,
	body: string,
	coediting: boolean,
	comments_count: number,
	created_at: Date,
	group: string,
	id: string,
	likes_count: number,
	private: boolean,
	reactions_count: number,
	tags: [
		{
			name: string,
			versions: Array<string>
		}
	],
	title: string,
	updated_at: Date,
	url: string,
	user: {
		description: string,
		facebook_id: string,
		followees_count: number,
		followers_count: number,
		github_login_name: string,
		id: string,
		items_count: number,
		linkedin_id: string,
		location: string,
		name: string,
		organization: string,
		permanent_id: number,
		profile_image_url: string,
		twitter_screen_name: string,
		website_url: string
	},
	page_views_count: number
}