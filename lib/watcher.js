'use strict';
/*
 * Created by hzwangfei3 on 2016/12/5.
 */
const colors = require('./colorful');
const notify = require('./notify');
const query = require('./req');
const Type = require('./typeOf');
const columnify = require('columnify');

function genUid(opt){
    let cur = new Date();
    let m =cur.getMinutes();
    let s = cur.getSeconds();
    m = m >= 10 ? m : ("0"+m);
    s = s >= 10 ? s : ("0"+s);
    return ((opt.from+"->"+opt.to) || "未命名") + " " + [m, s, (cur.getMilliseconds() % 100)].join(":") ;
}
// today 2016-07-08
function getToday(){
    let cur = new Date();
    return [cur.getFullYear(), cur.getMonth()+1, cur.getDate()].join("-");
}
// 2016-7-8 → 2016-07-08
function formatDate(dt){
    return dt.split("-").map((it)=>{
        return it.length >= 4 ? it : (it.length===1?("0"+it):it);
    }).join("-");
}

let headers = {
    station_train_code: '车次',
    from_station_name: '出发站',
    to_station_name: '到达站',
    start_time: '出发时',
    arrive_time: '到达时',
    lishi: '历时',
    swz_num: '商务座',
    zy_num: '一等座',
    ze_num: '二等座',
    rw_num: '软卧',
    yw_num: '硬卧',
    yz_num: '硬座',
    wz_num: '无座',
    qt_num: '其它',
    controlled_train_message: '备注'
};
let headersConfig = (()=>{
    let config = {};
    Object.keys(headers).forEach(col=>{
        config[col] = {
            headingTransform: function(heading) {
                return colors.white.bgCyan.bold(headers[heading]) + "\r\n" + colors.gray(repeatChar("-", headers[heading].length*2));
            }
        }
    });
    return config;
})();


// 精简字段
function simplifyData(data){
    return data.map((item) => {
        return {
            station_train_code: item.station_train_code,
            from_station_name: item.from_station_name,
            to_station_name: item.to_station_name,
            start_time: item.controlled_train_flag === '0' ? item.start_time : "--",
            arrive_time: item.controlled_train_flag === '0' ? item.arrive_time : "--",
            lishi: item.lishi,
            swz_num: item.swz_num,
            zy_num: item.zy_num,
            ze_num: item.ze_num,
            rw_num: item.rw_num,
            yw_num: item.yw_num,
            yz_num: item.yz_num,
            wz_num: item.wz_num,
            qt_num: item.qt_num,
            controlled_train_message: item.controlled_train_flag === '1' ? item.controlled_train_message : ""
        };
   });
}

// 重复产生n和char并组成字符串返回
function repeatChar(char,n){
    let res = "";
    char = Type.isChar(char) ? char : "*";
    n = parseInt(n) || 0;
    n = n > 0 ? n : 0;
    if(n>0) while(n--) res += char;
    return res;
}

// 输出
function printOut(data){
    console.log(columnify(simplifyData(data), {
        columnSplitter: colors.gray('|'),
        preserveNewLines: true,
        dataTransform: function(data) {
            let mutLine = data.split("\n");
            if(~data.indexOf("--")){//--
                return colors.gray("--");
            }else if(Type.isUndefinedOrNull(data)){//空数据
                return "";
            }else if(data.match(/^[A-Za-z]\d+/)){//车次
                return colors.green.bold(data);
            }else if(mutLine.length>=2){//票数+票价
                return colors.cyan(mutLine[0])+"\r\n"+colors.yellow(mutLine[1]);
            }else if(data.match(/\d+:\d+/)){//时间
                return colors.cyan(data);
            }else if(data.match(/\d+/)){//只有票数
                return colors.cyan(data);
            }else{
                return data;
            }
        },
        widths: {
            controlled_train_message: {
                maxWidth: 150
            }
        },
        config: headersConfig
    }));
}


function doQuery(config,uid){
    // 查询一条
    let promise = query(config.from, config.to, config.date, config.condition);
    promise.then(
        (res) => {
            console.log(`> 监视器 ${colors.magenta(uid)} 成功查询到 ${colors.cyan(res.length)} 条数据！\n`);
            printOut(res);
            console.log('');
        },
        (err) => {
            console.log(err);
        }
    );
}


function Watcher(option){
    option = option || {};
    this.option = {};
    this.option.from = option.from || "HZH";
    this.option.to = option.to || "ZIW";
    this.option.date = Type.isString(option.date) ? option.date : getToday();
    this.option.date = formatDate(this.option.date);
    this.option.pollinterval = Type.isRealNumber(option.pollinterval) ? option.pollinterval : (3*60*1000);//3min
    this.option.condition = Type.isObject(option.condition) ? option.condition : {};
    this.option.condition.showPrice = 1;
    this.uid = genUid(this.option);
    this.timer = null;
}
Watcher.prototype = {
    reset: function(option){
        option = Type.isObject(option) ? option : {};
        this.option.from = option.from || this.option.from;
        this.option.to = option.to || this.option.to;
        this.option.date = Type.isString(option.date) ? option.date : this.option.date;
        this.option.date = formatDate(this.option.date);
        this.option.pollinterval = Type.isRealNumber(option.pollinterval) ? option.pollinterval : this.option.pollinterval;
        this.option.condition = Type.isObject(option.condition) ? option.condition : this.option.condition;
    },
    start: function(){
        let self = this;
        self.stop();
        // do at once
        doQuery(self.option,self.uid);
        self.timer = setInterval(()=>{
            doQuery(self.option,self.uid);
        },self.option.pollinterval)
    },
    restart: function(option){
        option && this.reset(option);
        this.start();
    },
    stop: function(){
        this.timer && clearInterval(this.timer);
    }
};

let w = new Watcher();
w.start();

module.exports = Watcher;