// ==UserScript==
// @name        refererChanger
// @include     main
// @include     chrome://browser/content/browser.xul
// @version     1.0.3
// @description Refererの内容を柔軟に書き換えるUserScriptです。
// ==/UserScript==
// ◆設定方法
//   スクリプト内のsites配列（ハッシュ配列）にリファラーを書き換えたいサイトと書き換え方法を指定すれば次回userChrome.jsロード時から書き換えてくれます。
//   sites配列の書き方はハッシュのkeyに書き換え対象のドメインを、valueに書き換え方法を指定して下さい。
// ◇sites配列のvalue指定方法
//   @NORMAL：リファラを変更しない
//   @FORGE：開こうとしているサーバのルートに
//   @ORIGINAL：開こうとしているサイトのURLを送信する
//   @BLOCK : リファラを空にして送信
//   無指定：開こうとしているサーバが別サーバだとそのサーバのルートに、ドキュメントと同じサーバーから開かれたようにする
//   それ以外 : 指定された内容にリファラを書き換える。

var refererChanger = {};
refererChanger.state = false; /* 启动时是否启用 */
refererChanger.addMenu = false; /* 是否添加到菜单工具栏 */
refererChanger.enabledTip = "【图片反外链】\u5904\u4E8E\u542F\u7528\u72B6\u6001";
refererChanger.disabledTip = "【图片反外链】\u5904\u4E8E\u7981\u7528\u72B6\u6001";
refererChanger.enabledSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyxJREFUeNpUU02IHEUU/qr6b7pnpqdnZ3Z3ZmezLtFoViJiWCMBFxXFg4II8ZBLEIPxIiooCF48eBTP6sWD4EWWBASjRC+RgIqnuCEoq4njriyb7Pxs9/RfdVVX2TPuDljwqqhX732v3s9HlFK4QAjGy/VKiIX0ykwsc1N72NP1BylgCyU3oWm/OiV9s7sX3rEK+xMnV/Dazzeg42CpQgr96VlLf6s1W3qB+dwegUAWSiqLAKaGXKlrhkE/UVx+WZjLsd8EYBzf0Ohq29IvPWVbrc7KUaTdPq6H+7jFGASTkLYBfz9bq5XNtSwW9ZxnH4996XgLAcf27A8qlLTahoGm3cCRxQ4WHQszjgmvVpxlijlToRozWHXzw2prsT4FmHOrnZDgke2Oh0xx9H+7hQ1HYSdI4MQ5GgseTtTm8aLuYO25U/AhyqfOnrt/CnD2jVcdj+Tk0fMvo/P6GVSIDtndBk1zuAyo9iIsD4Cll57EyY/eRavWRGt5qTYFyLdvKrdawnJZh/7m27j9xD2QAUdj5RgaS21Uqy1sYIDhhWcBFhXl4/ju4qVkWsRfvr7KuWvzb79Yx7yTgi+VcGVlDo8FDE0k+HHBRdPrwNi8ia8uX0eYc2x9/008acB4Dl6pue0Fj16Rc5WHdlOKumWCdWbxjCMwQ3NcFTb+6Q7gsBjCIDgSRzLbDh54P2B/TlKou+6AZ3KrlWZwqgYSy8DTf99FWTqInVmsFi29V+XYKzpyXDHE+6y/FWY70xRyljKRZj/0NTy/KnJU5l2Eu330hsFkwjSe4b52GUcpxV+7IVKBG4apx9MiskEfWcIvEktXw+I+6IXgxxogKQMZBNAWq/B1ir0ogbBNjEbsc6JPXA+6kBci5O00ZJ8FiYQ/TEGLQknXgpyvgJQoomGEfV8gTsTvLBXracwxTUGj/5Fp1E/fUzV13JixH7+7FYBwCVq8Df8oflIrIUz5zijMzlsGTQ45RA+5MBYlVU+y/Fw0TD/1Mxn5QmHIcoxyJRM/vVyQ6Uxh89MYlB4EnbIRh0gKXR7zd6hOrzXr9mmpE0tGbGPQi9eJZ98B+Z8H/hVgAH7LbLOlMMxnAAAAAElFTkSuQmCC";
refererChanger.disabledSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoVJREFUeNpcU7tvknEUvbxfpbyhLZIwEGPsIBIT0oT+A5C4GEYH/AccnFwdHRjVhcHRNBpI6tbFNMQYJnUxDSHUobzklZZ3Ac/5Bb4YSS6/L7/vnnPPufd+uvV6LYlEQnQ6nTgcDpnP526j0RhdrVYP7Hb7fb1eb7u9vb3A+d1isVy02+2WwWCQw8NDKRQKYpTNj0QgOdrZ2Xm+u7v7GEQ2hLoHWAgC6TnI3+L8AMiKOEXA6kh4BOCnWCy2F41G5fr6Wmq1mqCiQIEAKKPR6BiqjkHswd0bYvX8G4/HdpvN9spsNu+5XC4JBAISDofF4/GI0+lUAaAKKoGV136/36Mp8Pl8YbA+nM1mslgs5PLyUknv9/sKQAKSUSnAcnZ25kin03cB/aYU5HI5O17oMpmMJJNJgRoZDoeKBKpUD9xut8TjcclmsxIMBqnQpVlotVprTsDr9UoqlWKzZLlcSiQSkVAopO7r9bocHBxwSurd6enpRLNQLpcXuFyUSiWxWq2qYqPRkP39fWWh0+koVd1uV4rFokynU6lUKmONAC8G8NkfDAZ38vm8YJTKK5WYTCY1hWq1qoK2QLYCZqhZwPh6UPCbVaiAQPpk19kD+mewMps5mUy6aPCVpgCdxwBmXzD7DCaiug41agrsPKtSFXZEms0m839iL8aaAi4NLj/C+xo7oSZAC2wWq/KZI+b9Zm/es08awabrNSQXmHhzc6PumMQeUAW2UAXe/0KxE+ZpFrZsYH6J4x7kpnq9nmzXnECuMkBX8P8Mz5PtN6TfJm28/oGSp0h6hxhRPi3hXCE+Q9UT5HxlwW1R7Wv851fHsrwA4Tk6fwSABZJ/wNYJKrf+T/4rwADlZG4UFnCBYQAAAABJRU5ErkJggg==";

refererChanger.sites = {
    'image.itmedia.co.jp' : '@FORGE',
    '2ch.net' : '@FORGE',
    'imepita.jp' : '@ORIGINAL',
    'tumblr.com' : '@FORGE',
    'fc2.com' : '@BLOCK',
    'blogs.yahoo.co.jp' : '@BLOCK',
    'hentaiverse.net': '@BLOCK',
    'rakuten-static.com': '@NORMAL',
    'rakuten.co.jp': '@NORMAL',
    'api.e-map.ne.jp': '@NORMAL',
    '9lala.com' : '@NORMAL',
    '19disk.com' : '@NORMAL', 
    '115cdn.com' : '@NORMAL',
    'imgchili.com' : '@NORMAL',
    'turboimagehost.com' : '@NORMAL',
    'yytcdn.com' : '@NORMAL',
    'xiami.net' : '@NORMAL',
    'pixhost.org' : '@NORMAL',
    'vip.xunlei.com' : '@NORMAL',
    'kuaipan.cn' : '@NORMAL',
    'disqus.com' : '@NORMAL',
    'tgbusdata.cn' : '@NORMAL',
    'dbank.com' : '@NORMAL',
    'stooorage.com' : '@NORMAL',
    'googlecode.com' : '@NORMAL',
    'keycaptcha.com' : '@NORMAL',
    'vod.xunlei.com' : '@NORMAL',
    'photo.sina.com.cn':'@BLOCK',
    'qlogo.cn':'@BLOCK',
    'qpic.cn':'@BLOCK',
    'bdstatic.com' : 'http://tieba.baidu.com/',
    'space.wenxuecity.com' : 'http://bbs.wenxuecity.com/',
    'fmn.rrfmn.com' : '@BLOCK',
    'www.autoimg.cn' : 'http://club.autohome.com.cn/',
    'kkkmh.com' : 'http://www.kkkmh.com/',
    'nonie.1ting.com' : 'http://www.1ting.com/',
    'sinaimg.cn' : 'http://blog.sina.com.cn/',
    'yyets.com' : 'http://www.yyets.com/',
    'img.knb.im' : 'http://www.kenengba.com/',
    'tianya.cn' : 'http://www.tianya.cn/',
    'baidu-img.cn' : 'http://www.baidu.com/',
    'xici.net' : 'http://www.xici.net/',
    'media.chinagate.com' : 'http://www.wenxuecity.com/',
    'jdstatic.tankr.net' : 'http://jandan.net/',
    'sankakustatic.com' : 'http://chan.sankakucomplex.com/',
    //115
    '183.60' : '@NORMAL',
    '119.147' : '@NORMAL',
    '112.91' : '@NORMAL',
    '60.221' : '@NORMAL',
    '113.105' : '@NORMAL',
    '58.253' : '@NORMAL',
    '125.211' : '@NORMAL',
    '218.29' : '@NORMAL',

    //下はデバッグ用
    //'taruo.net' : 'example.co.jp',

};
refererChanger.init = function () {
    if (this.addMenu) {
        var menuitem = document.createElement("menuitem");
        menuitem.setAttribute("id", "refererChangerToggle");
        menuitem.setAttribute("label", "RefererChanger Toggle");
        menuitem.setAttribute("type", "checkbox");
        menuitem.setAttribute("autocheck", "false");
        menuitem.setAttribute("checked", this.state);
        menuitem.setAttribute("oncommand", "refererChanger.RCToggle();");
        document.getElementById("devToolsSeparator").parentNode.insertBefore(menuitem, document.getElementById("devToolsSeparator"));
    }
    var tooltiptext = this.state ? this.enabledTip : this.disabledTip;
    var src = this.state ? this.enabledSrc : this.disabledSrc;
    var statusbarpanel = document.createElement("statusbarpanel");
    statusbarpanel.setAttribute("id", "refererChangerTogglePanel");
    statusbarpanel.setAttribute("label", "RC(ON)");
    statusbarpanel.setAttribute("tooltiptext", tooltiptext);
    statusbarpanel.setAttribute("class", "statusbarpanel-iconic");
    statusbarpanel.setAttribute("src", src);
    statusbarpanel.setAttribute("onclick", "refererChanger.RCToggle();"); 
    document.getElementById("status-bar").appendChild(statusbarpanel);
    var os = Cc['@mozilla.org/observer-service;1'].getService(
        Ci.nsIObserverService);
    os.addObserver(this, 'http-on-modify-request', false);

};
refererChanger.RCToggle = function () {
    this.state = !this.state;
    let statusbarpanel = document.getElementById('refererChangerTogglePanel');
    let menuitem = document.getElementById('refererChangerToggle');
    try{
        if (this.addMenu)
            menuitem.setAttribute("checked", !(menuitem.getAttribute("checked") == "true"));
        var tooltiptext = this.state ? this.enabledTip : this.disabledTip;
        var src = this.state ? this.enabledSrc : this.disabledSrc;
        statusbarpanel.setAttribute("tooltiptext", tooltiptext);
        statusbarpanel.setAttribute("src", src);
    }catch(e){}
};
// *********Config End**********
//var statusbarHidden = true;
refererChanger.adjustRef = function (http, site) {
    try {
        var sRef;
        var refAction = undefined;
        for (var i in this.sites) {
            if(site.indexOf(i) != -1){
                refAction = this.sites[i];
                break;
            }
        }

        if (refAction == undefined)
            return false;
        if (refAction.charAt(0) == '@'){
            //下はデバッグ用
            //logs.logStringMessage("ReferrerChanger:  " + http.originalURI.spec + " : "+refAction);
            //logs.logStringMessage("ReferrerChanger:  OriginalReferrer: "+http.referrer.spec);

            switch (refAction){
            case '@NORMAL':
                return true;
                break;
            case '@FORGE':
                sRef = http.URI.scheme + "://" + http.URI.hostPort + "/";
                break;
            case '@BLOCK':
                sRef = "";
                break;
            case '@AUTO':
                return false;
            case '@ORIGINAL':
                sRef = window.content.document.location.href;
                break;
            default:
                //return false;
                break;
            }
        }else if(refAction.length == 0) {
            return false;
        }else{
            sRef= refAction;
        }
        http.setRequestHeader("Referer", sRef, false);
        if (http.referrer)
            http.referrer.spec = sRef;
        return true;
    } catch (e) {}
    return false;
};

refererChanger.observe = function (aSubject, aTopic, aData) {
    if (aTopic != 'http-on-modify-request') return;
    if (!this.state) return;
    var http = aSubject.QueryInterface(Ci.nsIHttpChannel);
    for (var s = http.URI.host; s != ""; s = s.replace(/^.*?(\.|$)/, "")){
        if (this.adjustRef(http, s))
            return;
    }
    if (http.referrer && http.referrer.host != http.originalURI.host)
        http.setRequestHeader('Referer',
            http.originalURI.spec.replace(/[^/]+$/,''), false);
};

refererChanger.unregister = function () {
    var os = Cc['@mozilla.org/observer-service;1'].getService(
        Ci.nsIObserverService);
    os.removeObserver(this, 'http-on-modify-request', false);
};

var added = false;
if (location == "chrome://browser/content/browser.xul") {
    added = true;
    refererChanger.init();
}
window.addEventListener("unload", function () {
    if (location == "chrome://browser/content/browser.xul")
    if (added)
    refererChanger.unregister();
}, false);

