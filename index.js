'use strict';
const path = require('path');
const fs = require('fs');
const fileExistSync = fs.existsSync || path.existsSync;
const STATIONS = require('./lib/station');
const Type = require('./lib/typeOf');//这里不适用node-util检查，因为官方提示很多isXXX方法会过时
const Watcher = require('./lib/watcher');

/**
 * 通过中文站名获取到对应key
 * @param name
 * @returns {*|string}
 */
function getKeyByStationName(name){
    !STATIONS[name||''] && console.log(`无次车站'${name}'`);
    return STATIONS[name||''] || name || 'undefined';
}

/**
 * 将中文配置转换为配置
 * @param config
 * @returns {Object}
 */
function cvtConfig(config){
    config = config || {};
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
        pollinterval: (parseInt(config["监控频率(分钟)"]) || 3) * 60 * 1000,
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
 */
function watch(configs){
    configs.forEach((it)=>{
        WTS[it.name] = new Watcher(it);
        WTS[it.name].start();
    });

}

watch(getConfigs());

// module.exports = {
//     start: (dir) => {
//         watch(getConfigs(dir));
//     }
// };