'use strict';

module.exports = {

    timeoutPromise: (t, promise) => {

        t = parseInt(t) || 0;//默认不设限制

        return new Promise((resolve, reject) => {

            let toutId = !t ? false : setTimeout(function(){
                reject(new Error(`promise timeout with ${t}ms.`));
            }, t);

            promise.then(
                (res) => {
                    toutId && clearTimeout(toutId);
                    resolve(res);
                },
                (err) => {
                    toutId && clearTimeout(toutId);
                    reject(err);
                }
            );
        });
    }

};