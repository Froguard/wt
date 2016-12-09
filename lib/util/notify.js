'use strict';
/*
 * Created by hzwangfei3 on 2016/12/5.
 */
const path = require('path');
let notifier = require("node-notifier");
let icons = [
    path.join(__dirname, "../../img/error.png"),
    path.join(__dirname, "../../img/correct.png"),
    path.join(__dirname, "../../img/bazinga.png")
];

function doNotify(options) {
    options = options || {};
    let title = options.title;
    let message = options.message;
    let sound = options.sound;
    let type = parseInt(options.type) || 0;
    let icon = icons[type];
    let openUrl = options.openUrl || false;
    let time = options.time;
    let nc = {
        title: title || "提示",
        message: message || "提示内容",
        sound: sound || false,
        icon: icon,
        wait: !!options.wait,
        time: time || 3000
    };
    if(openUrl){ nc.open = openUrl; }
    // console.dir(nc);
    notifier.notify(nc, function (err,response) {
        err && console.error(err);
    });
}

module.exports = doNotify;