export function setMobile() {
    var win = window,
        resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
        doc = document,
        recalc = function () {
            var deviceWidth = doc.documentElement.clientWidth;
            if (deviceWidth > 750) return;
            doc.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
        };
    recalc();
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}
setMobile();