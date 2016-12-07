'use strict';
let config = require('./targets/target1.json');
const STATIONS = require('./lib/station');

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
        from: getKeyByStationName(config['出发站']),
        to: getKeyByStationName(config['到达站']),
        date: config['出发时间'],
        condition:{
            purposeCode: config['成人票'] ? 'ADULT' : '0X00',
            showPrice: !!config['显示票价'],
            onlyShowHighSpeedRail: !!config['仅显示高铁']
        },
        pollinterval: (parseInt(config["监控屏率(分钟)"]) || 3) * 60 * 1000
    };
}

