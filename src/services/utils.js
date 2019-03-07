import moment from 'moment';

//手机号码
export function isMobile(val) {
    return /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/.test(val);
};

function uzStorage() {
    return window.localStorage;
}

export function setStorage(key, value) {
    if (arguments.length === 2) {
        var v = value;
        if (typeof v == 'object') {
            v = JSON.stringify(v);
            v = 'obj-' + v;
        } else {
            v = 'str-' + v;
        }
        var ls = uzStorage();
        if (ls) {
            ls.setItem(key, v);
        }
    }
};

export function getStorage(key) {
    var ls = uzStorage();
    if (ls) {
        var v = ls.getItem(key);
        if (!v) {
            return;
        }
        if (v.indexOf('obj-') === 0) {
            v = v.slice(4);
            return JSON.parse(v);
        } else if (v.indexOf('str-') === 0) {
            return v.slice(4);
        }
    }
};

export function rmStorage(key) {
    var ls = uzStorage();
    if (ls && key) {
        ls.removeItem(key);
    }
};

export function clearStorage() {
    var ls = uzStorage();
    if (ls) {
        ls.clear();
    }
};

//根据 年月日时分秒毫秒的数字 返回标准moment格式
export function getMoment(time) {
    time = time.toString();
    return moment([time.substr(0, 4), Number(time.substr(4, 2)) - 1, time.substr(6, 2), time.substr(8, 2), time.substr(10, 2), time.substr(12, 2), time.substr(14, 3)])
}

export function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
}