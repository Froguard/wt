'use strict';
/*
 * Created by hzwangfei3 on 2016/12/5.
 */

const request = require("request");
const Type = require("./typeOf");
const promiseUtil = require('./promiseUtil');
const co = require('co');

/**
 * 生成意向新的item数据
 * @param isTimeoutType
 * @returns {Object}
 */
function genEmptyItem(isTimeoutType){
    let arr;
    switch(isTimeoutType){
        case 1: {
            arr = "票价查询超时".split("");
            break;
        }
        case 2: {
            arr = "票价查询失败".split("");
            break;
        }
        case 3: {
            arr = "无此票价信息".split("");
            break;
        }
        case 0:
        default: {
            arr = [" "," "," "," "," "]
        }
    }
    return {
        "train_no": " ",
        "station_train_code": " ",
        "start_station_telecode": " ",
        "start_station_name": " ",
        "end_station_telecode": " ",
        "end_station_name": " ",
        "from_station_telecode": " ",
        "from_station_name": " ",
        "to_station_telecode": " ",
        "to_station_name": " ",
        "start_time": " ",
        "arrive_time": " ",
        "day_difference": " ",
        "train_class_name": " ",
        "lishi": " ",
        "canWebBuy": " ",
        "lishiValue": " ",
        "yp_info": " ",
        "control_train_day": " ",
        "start_train_date": " ",
        "seat_feature": " ",
        "yp_ex": " ",
        "train_seat_feature": " ",
        "seat_types": " ",
        "location_code": " ",
        "from_station_no": " ",
        "to_station_no": " ",
        "control_day": " ",
        "sale_time": " ",
        "is_support_card": " ",
        "controlled_train_flag": " ",
        "gg_num": " ",
        "yb_num": " ",
        "note": " ",
        "swz_num": arr[0],  //商务座
        "tz_num": arr[1],   //特等座
        "zy_num": arr[2],   //一等座
        "ze_num": arr[3],   //二等座
        "gr_num": arr[4],   //高铁软卧
        "rw_num": arr[5],   //软卧
        "yw_num": " ",      //硬卧
        "rz_num": " ",      //软座
        "yz_num": " ",      //硬座
        "wz_num": " ",      //无座
        "qt_num": " ",      //其他
        "controlled_train_message": " "//备注
    };
}

/**
 * 根据已有的list，给每一项添加价格信息，并生成新的list
 * @param list 列表
 * @param date 时间
 * @returns {Array}
 */
function * addPrice2List(list,date){
    let listP = [];
    let i, iLen = list.length;
    for(i=0; i<iLen; i++){// 这里不能使用forEach，否则yield失效
        let item = list[i];
        listP.push(item);
        let urlP = "https://kyfw.12306.cn/otn/leftTicket/queryTicketPrice?"
            + `train_no=${item.train_no}`
            + `&from_station_no=${item.from_station_no}`
            + `&to_station_no=${item.to_station_no}`
            + ( item.seat_types ? `&seat_types=${item.seat_types}` : "" )//非必须查询条件
            + `&train_date=${date}`;
        let priceItem = yield promiseUtil.timeoutPromise(5000, new Promise((res,rej) => {
                console.log(urlP);
                request({
                        url: urlP,
                        headers: {
                            'If-Modified-Since': 0,
                            'Cache-Control': 'no-cache'
                        },
                        strictSSL: false // 严格的ssl认证会导致12306请求出现循环依赖认证，而失败，原因不明
                    },
                    (err,resp,bd)=>{
                        if (!err && resp.statusCode == 200) {
                            let pData = JSON.parse(bd) || false;
                            // console.dir(pData);
                            let emptyPriceItem;
                            if(pData===-1){
                                emptyPriceItem = genEmptyItem(3);
                            }else{
                                let prices = (pData && pData.data) || {};
                                emptyPriceItem = genEmptyItem(0);
                                emptyPriceItem.swz_num = prices.A9 || emptyPriceItem.swz_num;
                                emptyPriceItem.tz_num =  prices.P  || emptyPriceItem.tz_num;
                                emptyPriceItem.zy_num =  prices.M  || emptyPriceItem.zy_num;
                                emptyPriceItem.ze_num =  prices.O  || emptyPriceItem.ze_num;
                                emptyPriceItem.gr_num =  prices.A6 || emptyPriceItem.gr_num;
                                emptyPriceItem.rw_num =  prices.A4 || emptyPriceItem.rw_num;
                                emptyPriceItem.yw_num =  prices.A3 || emptyPriceItem.yw_num;
                                emptyPriceItem.rz_num =  prices.A2 || emptyPriceItem.rz_num;
                                emptyPriceItem.yz_num =  prices.A1 || emptyPriceItem.yz_num;
                                emptyPriceItem.wz_num =  prices.WZ || emptyPriceItem.wz_num;
                            }
                            res(emptyPriceItem);
                        }else{
                            console.log("reject-queryTicketPrice:\r\n",err);
                            rej(genEmptyItem(2));
                        }
                    });
            })
        ).catch((err)=>{
            console.log("出错了：" + err);
            return genEmptyItem(err.toString().match(/promise timeout with (\d+)ms/g)?1:2);
        });
        // 添加票价信息
        listP.push(priceItem);
    }
    return listP;
}

module.exports = (from,to,date,condition) => {

    let doQuery = new Promise((resolve, reject) => {
        if(!Type.isString(from) || !Type.isString(to) || !Type.isString(date)){
            reject("传参有问题！")

        }else{
            condition = condition || {};
            condition.purposeCode = condition.purposeCode ? condition.purposeCode : "ADULT";
            condition.showPrice = condition.showPrice || false;
            condition.onlyShowHighSpeedRail = condition.onlyShowHighSpeedRail || false;
            const url = "https://kyfw.12306.cn/otn/lcxxcx/query?"
                + `purpose_codes=${condition.purposeCode}`
                + `&queryDate=${date}`
                + `&from_station=${from}`
                + `&to_station=${to}`;
            // console.log(url);

            request({
                    url: url,
                    headers: {
                        'If-Modified-Since': 0,
                        'Cache-Control': 'no-cache'
                    },
                    strictSSL: false
                },
                (error,response,body) => {
                    if (!error && response.statusCode == 200) {
                        let res = JSON.parse(body) || false;
                        let data = (res && res.data) || false;
                        let list = (data && data.datas) || [];
                        // 筛选高铁
                        if(condition.onlyShowHighSpeedRail){
                            list = list.filter((item)=>{
                                return item.station_train_code.match(/G|D|C/g);
                            });
                        }
                        // 增加票价信息
                        if(condition.showPrice){
                            co(function *(){
                                let newList = yield addPrice2List(list,date);
                                resolve(newList);
                            });
                        }else{
                            resolve(list);
                        }

                    }else{
                        console.log("reject-query:\r\n",error);
                        reject(error);
                    }
                }
            );
        }

    });
    return promiseUtil.timeoutPromise(8000, doQuery);
};

