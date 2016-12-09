'use strict';
const path = require('path');
const fs = require('fs');
const fileExistSync = fs.existsSync || path.existsSync;
const Type = require('./lib/util/typeOf');//这里不适用node-util检查，因为官方提示很多isXXX方法会过时
const STATIONS = require('./lib/station');
const Watcher = require('./lib/watcher');
const gaze = require('gaze');
const colors = require('./lib/util/colorful');

/**
 * 通过中文站名获取到对应key
 * @param name
 * @returns {*|string}
 */
function getKeyByStationName(name){
    if(!STATIONS[name||'']){
        throw new Error(`没有找到名字叫'${name}'的车站！`);
    }
    return STATIONS[name||''] || name || 'undefined';
}

/**
 * 将中文配置转换为配置
 * @param config
 * @returns {Object}
 */
function cvtConfig(config){
    config = config || {};
    let pollInt = parseInt(config["监控频率(分钟)"]) || 0;
    pollInt = pollInt < 1 ? 1 : pollInt;
    return {
        name: config.name || "未命名",
        from: getKeyByStationName(config['出发站']),
        to: getKeyByStationName(config['到达站']),
        date: config['出发时间'],
        condition:{
            purposeCode: config['成人票'] ? 'ADULT' : '0X00',
            showPrice: !!config['显示票价'],
            onlyShowHighSpeedRail: !!config['仅显示高铁']
        },
        pollinterval: pollInt * 60 * 1000,
        info:{
            from: config["出发站"],
            to: config["到达站"],
            date: config['出发时间'],
            purposeCode: config['成人票'] ? '成人票' : '学生票',
            onlyShowHighSpeedRail: config['仅显示高铁']?"高铁":"普通"
        }
    };
}

/**
 * 通过
 * @param dir directory path
 * @returns {Array}
 */
function getConfigs(dir){
    dir = Type.isString(dir) ? path.normalize(dir) : "./targets/";
    if(!fileExistSync(dir)){
        console.warn(`The directory '${dir}' is not existed!`);
        return [];
    }
    let configs = [];
    let dirs = fs.readdirSync(dir);
    dirs.forEach((item)=>{
        let curPath = path.join(dir,item);
        let stat = fs.statSync(curPath);
        if(stat.isFile() && curPath.match(/(\.json[3,5]?)$/)){
            console.log(`Watch-json: ${colors.gray(curPath.replace(/\\/g,"/"))}`);
            try{
                let config = JSON.parse(fs.readFileSync(curPath), 'utf8');
                config.name = path.basename(curPath);
                configs.push(cvtConfig(config));
            }catch(e){
                console.warn(`Get config via '${curPath}' failed!`);
                console.error(e);
            }
        }
    });
    return configs;
}

let WTS = {};
/**
 * 开始监视工作
 * @param configs
 * @param dir
 */
function watch(configs,dir){
    if(configs.length==0){
        console.log("启动失败！");
        return;
    }
    configs.forEach((it)=>{
        WTS[it.name] = new Watcher(it);
        WTS[it.name].start();
    });
    gaze(path.join(dir,"*.json"),null, function(err,watcher){
        this.on('all', function(event, filepath) {
            let target = path.basename(filepath);
            // console.log(`${target} is ${event}`);
            try{
                let newConfig = JSON.parse(fs.readFileSync(filepath), 'utf8');
                try{
                    WTS[target].restart(cvtConfig(newConfig));
                }catch(e2){
                    console.error(`重启监视器'${target}'失败!配置的json文件有问题\r\n:`,e2);
                }
            }catch(e1){
                console.error(`获取配置'${target}'失败!配置的json文件有问题\r\n:`,e1);
            }
        });
    });

}

// watch(getConfigs());

module.exports = {
    start: (dir) => {
        dir = dir||"./targets";
        console.log(`Watch-dir: ${colors.gray(dir.replace(/\\/g,"/"))}`);
        watch(getConfigs(dir),dir);
    }
};