'use strict';
/*
 * Created by hzwangfei3 on 2016/12/5.
 */
const colors = require('./util/colorful');
const notify = require('./util/notify');
const Type = require('./util/typeOf');
const query = require('./req');
const columnify = require('columnify');

function cvn(n){
    return n < 10 ? ("0" + n) : n;
}
function getCurT(){
    let res,cur = new Date();
    res = "[" + colors.gray([cvn(cur.getHours()),cvn(cur.getMinutes()),cvn(cur.getSeconds())].join(":")) + "]";
    return res;
}
function genUid(opt){
    let cur = new Date();
    let h = cur.getHours();
    let m =cur.getMinutes();
    let s = cur.getSeconds();
    h = h >= 10 ? h : ("0"+h);
    m = m >= 10 ? m : ("0"+m);
    s = s >= 10 ? s : ("0"+s);
    return ((opt.from+"->"+opt.to) || "未命名") + " " + [h, m, s, (cur.getMilliseconds() % 1000)].join(":") ;
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
    tz_num: '特等座',
    zy_num: '一等座',
    ze_num: '二等座',
    gr_num: '高铁软卧',
    rw_num: '软卧',
    yw_num: '硬卧',
    rz_num: '软座',
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
                return colors.gray.bold(headers[heading]) + "\r\n" + colors.gray(repeatChar("-", headers[heading].length*2));
            }
        }
    });
    return config;
})();

const CANT_BUY = "还不能买";
// 精简字段
function simplifyData(data){
    let res = {count:0};
    res.list = data.map((item) => {
        let canWebBuy = !item.canWebBuy || item.canWebBuy.toUpperCase()!=="N";
        res.count += canWebBuy ? 1 : 0;
        return {
            station_train_code: item.station_train_code,
            from_station_name: item.from_station_name,
            to_station_name: item.to_station_name,
            start_time: item.controlled_train_flag === '0' ? item.start_time : "--",
            arrive_time: item.controlled_train_flag === '0' ? item.arrive_time : "--",
            lishi: item.lishi,
            swz_num: item.swz_num,
            tz_num: item.tz_num,
            zy_num: item.zy_num,
            ze_num: item.ze_num,
            gr_num: item.gr_num,
            rw_num: item.rw_num,
            yw_num: item.yw_num,
            rz_num: item.rz_num,
            yz_num: item.yz_num,
            wz_num: item.wz_num,
            qt_num: item.qt_num,
            controlled_train_message: item.controlled_train_flag === '1' ? item.controlled_train_message : (!canWebBuy? item.note.replace(/<br\/>/g,"") || canWebBuy : "" )
        };
    });
    res.hasTicket = res.count;
    res.from = res.list[0].from_station_name;
    res.to = res.list[0].to_station_name;
    return res;
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
    if(!data || !data.length){
        return;
    }
    // 转换结果
    let res= simplifyData(data);
    // 弹窗通知
    res.hasTicket && notify({
        title: res.hasTicket?"有票啦！":"查票完毕",
        message: `${res.from} => ${res.to} ${res.hasTicket?"有票啦！":"无票可买！"}`,
        sound: res.hasTicket || false,
        type: res.hasTicket ? 2 : 0,
        wait: res.hasTicket,
        time: res.hasTicket ? 30000 : 3000,
        openUrl: res.hasTicket ? "https://kyfw.12306.cn/otn/lcxxcx/init" : 0
    });
    // 控制台列表输出
    console.log(columnify(res.list, {
        columnSplitter: colors.gray('|'),
        preserveNewLines: true,
        dataTransform: function(data) {
            let mutLine = data.split("\n");
            if(Type.isUndefinedOrNull(data)){
                //空数据
                return "";
            }else if(mutLine.length<2 && data.match(/(--)|(无)|(列车停运)|(起售)/)){
                //--,列车停运,无
                return colors.gray(data);
            }else if(data.match(/^[A-Za-z]\d+/)){
                //车次
                return colors.green.bold(data);
            }else if(mutLine.length>=2){
                let l0 = mutLine[0];
                let l1 = mutLine[1];
                let noData = !!l0.match(/(--)|(无)|(\*)/);
                l0 = colors[noData?"gray":"cyan"](l0);
                l1 = colors[(noData||l1.match(/(--)|(无)|(\*)/))?"gray":"yellow"](l1);
                //票数+票价
                return `${l0}\r\n${l1}`;
            }else if(data.match(/\d+:\d+/)){
                //时间
                return colors.cyan(data);
            }else if(data.match(/\d+/)){
                //只有票数
                return colors.cyan(data);
            }else if(~data.indexOf(CANT_BUY)){
                //不能买
                return colors.gray(data);
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
    })+'\r\n');
}

function doQuery(config,uid){
    // 查询一条
    let promise = query(config.from, config.to, config.date, config.condition);
    promise.then(
        (res) => {
            let chineseInfo = config.info||{};
            let info = colors.gray("("+chineseInfo.from+"->"+chineseInfo.to+","+chineseInfo.date+","+chineseInfo.onlyShowHighSpeedRail+chineseInfo.purposeCode+")");
            console.log(`\r\n${getCurT()} ${colors.cyan(">>>")} 监视器 ${colors.magenta(uid)} 成功查询到 ${colors.cyan(res.length)} 条数据！ ${info}\r\n`);
            printOut(res);
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
    this.option.date = Type.isString(option.date) ? option.date : "2017-01-28";//getToday();
    this.option.date = formatDate(this.option.date);
    this.option.pollinterval = Type.isRealNumber(option.pollinterval) ? option.pollinterval : (3*60*1000);//3min
    this.option.condition = Type.isObject(option.condition) ? option.condition : {};
    this.option.condition.showPrice = 1;
    this.option.info = option.info;
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
        this.option.info = Type.isObject(option.info) ? option.info : this.option.info;
    },
    start: function(isRestart){
        let self = this;
        self.stop();
        let chineseInfo = self.option.info||{};
        let info = colors.gray("("+chineseInfo.from+"->"+chineseInfo.to+","+chineseInfo.date+","+chineseInfo.onlyShowHighSpeedRail+chineseInfo.purposeCode+")");
        console.log(`\r\n${getCurT()} ${!isRestart?"开启":"重新开启"}监视器 ${colors.magenta(self.uid)} ${info}`);
        doQuery(self.option,self.uid);// do at once
        self.timer = setInterval(()=>{
            doQuery(self.option,self.uid);
        },self.option.pollinterval)
    },
    restart: function(option){
        option && this.reset(option);
        // console.log(`${colors.magenta(this.uid)} is restart!`);
        this.start(1);
    },
    stop: function(){
        this.timer && clearInterval(this.timer);
    }
};

module.exports = Watcher;