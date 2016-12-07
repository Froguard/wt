/*
 * Created by hzwangfei3 on 2016/12/5.
 */
const colors = require('./lib/colorful');
const notify = require('./lib/notify');
const query = require('./lib/req');
const Type = require('./lib/typeOf');
const columnify = require('columnify');

function genUid(opt){
    let cur = Date.now();
    return [opt.name || "未命名", cur.getMinutes(), cur.getSeconds(), (cur.getMilliseconds() % 100)].join("-") ;
}

let PrintQueue = [];
function printRes(log){
    PrintQueue.unshift(log);//加进队列首
    setTimeout(()=>{
        while(PrintQueue.pop()){//推出队列的尾部
            console.log();
        }
    },0);
}

function doQuery(config,uid){
    // 查询一条
    let promise = query(config.from, config.to, config.date, config.condition);
    promise.then(
        (res) => {
            console.log(`监视器${colors.magenta(uid)}成功查询到 ${colors.cyan(res.length)} 条数据！`);
        },
        (err) => {
            console.log(err);
        }
    );
}

function Watcher(option){
    this.uid = genUid(option);
    this.from = option.from || "HZH";
    this.to = option.to || "GIW";
    this.date = Type.isDate(option.date) ? option.date : Date.now();
    this.pollinterval = Type.isRealNumber(option.pollinterval) ? option.pollinterval : (3*60*1000);//3min
    this.condition = Type.isObject(option.condition) ? option.condition : {};
    this.timer = null;
}
Watcher.prototype = {
    reset: (option)=>{
        option = Type.isObject(option) ? option : {};
        this.from = option.from || this.from;
        this.to = option.to || this.to;
        this.date = Type.isDate(option.date) ? option.date : this.date;
        this.pollinterval = Type.isRealNumber(option.pollinterval) ? option.pollinterval : this.pollinterval;
        this.condition = Type.isObject(option.condition) ? option.condition : this.condition;
    },
    start: () => {
        let self = this;
        self.start();
        self.timer = setInterval(()=>{
            doQuery(self.option,self.uid);
        },self.pollinterval)
    },
    restart: (option) => {
        option && this.reset(option);
        this.start();
    },
    stop: () => {
        this.timer && clearInterval(this.timer);
    }
};

module.exports = Watcher;