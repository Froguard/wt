'use strict';
/*
 * Created by hzwangfei3 on 2016/12/5.
 */

let notifier = require("node-notifier");
let icons = [
    "../img/error.png",
    "../img/correct.png",
    "../img/baginza.png"
];

function doNotify(options) {
    options = options || {};
    let title = options.title;
    let message = options.message;
    let sound = options.sound;
    let type = parseInt(options.type) || 0;
    let icon = icons[type];
    notifier.notify({
        title: title || "提示",
        message: message || "提示内容",
        sound: sound || false,
        icon: icon
    }, function (err,response) {
        err && console.error(err);
    });
}

module.exports = doNotify;