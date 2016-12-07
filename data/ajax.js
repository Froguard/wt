/*!
 * 对jquery的ajax的封装，支持请求本地数据和请求远程http服务 该js必须放在jquery.js后面 同时还负责初始化各种js变量
 * ots_global.calendarLang 初始化calendar组件的国际化信息。
 */
var alertWarningMsg;
var alertWarningMsgByHeader;
var alertWarningMsgByTit_header;
(function () {
    var e = null;
    $(document).ready(function () {
        e = b()
    });
    var a = null;
    if (typeof globalRepeatSubmitToken != "undefined") {
        a = globalRepeatSubmitToken
    }
    var j = null;
    var l = "_json_att";
    var d = "_es_hiddenform";
    var k = "<form  method='post' id='" + d + "'><input type='hidden' name='" + l + "'></input></form>";
    var h = $.ajax;
    ots_global = {};
    $.ajax = function (o, n) {
        if (typeof o == "object") {
            n = o;
            o = undefined
        }
        n = n || {};
        var m = n.isAlert || true;
        if (n.success) {
            var p = n.success;
            n.success = function (y, s, x) {
                if (y && y.c_url) {
                    window[y.c_name] = y.c_url
                }
                if (y && y.validateMessagesShowId) {
                    var w = y.messages;
                    if (w && w.length > 0) {
                        var v = "";
                        for (var u = 0; u < w.length; u++) {
                            v += w[u] + "\n"
                        }
                        dhtmlx.alert({
                            title: w["message.info"],
                            ok: w["button.ok"],
                            text: v,
                            callback: function () {
                                if (y.url) {
                                    window.location = ctx + y.url
                                }
                            }
                        })
                    }
                    var z = y.validateMessages;
                    var v = "";
                    for (var t in z) {
                        v += t + " :" + z[t] + "</br>"
                    }
                    if (y.attributes) {
                        j = y.attributes
                    }
                    if (y.repeatSubmitToken && y.repeatSubmitToken != "") {
                        a = y.repeatSubmitToken
                    }
                    if (v) {
                        if (m) {
                            dhtmlx.alert({
                                title: w["message.info"],
                                ok: w["button.ok"],
                                text: v,
                                callback: function () {
                                    p.call(this, y, s, x)
                                }
                            })
                        } else {
                            $("#" + y.validateMessagesShowId).html(v).show();
                            p.call(this, y, s, x)
                        }
                    } else {
                        $("#" + y.validateMessagesShowId).html("").hide();
                        p.call(this, y, s, x)
                    }
                } else {
                    p.call(this, y, s, x)
                }
            }
        }
        var r = n.data || {};
        var q = true;
        if (n.isTakeParam == false) {
            q = false
        }
        if (q) {
            if (j) {
                r[l] = j
            } else {
                r[l] = $("input[name=_json_att]").val()
            }
        }
        if ("undefined" != typeof (a) && a != null) {
            r.REPEAT_SUBMIT_TOKEN = a
        }
        n.data = r;
        h.call(this, o, n)
    };
    if (typeof otsRedirect == "undefined") {
        otsRedirect = function (r, o, p, q) {
            p = p || {};
            if (r && r == "post") {
                if ($("#" + d).length == 0) {
                    $(document.body).append(k)
                }
                if (j) {
                    $("#" + d + " input[name='" + l + "']").val(j)
                }
                $("#" + d + " input[name='" + l + "'] ~ input").remove();
                if (a != null) {
                    $("#" + d).append("<input type='hidden' name='REPEAT_SUBMIT_TOKEN'></input>");
                    $("#" + d + " input[name='REPEAT_SUBMIT_TOKEN']").val(a)
                }
                if (p) {
                    for (var n in p) {
                        var m = "<input type='hidden' name='" + n + "'></input>";
                        $("#" + d).append(m);
                        $("#" + d + " input[name='" + n + "']").val(p[n])
                    }
                }
                if (q != null) {
                    $("#" + d).attr("target", q)
                } else {
                    $("#" + d).removeAttr("target")
                }
                $("#" + d).attr("action", o);
                $("#" + d).submit()
            } else {
                if (j) {
                    if (o.indexOf("?") > 0) {
                        o += "&" + l + "=" + j
                    } else {
                        o += "?" + l + "=" + j
                    }
                }
                if (p) {
                    for (var n in p) {
                        if (o.indexOf("?") > 0) {
                            o += "&" + n + "=" + p[n]
                        } else {
                            o += "?" + n + "=" + p[n]
                        }
                    }
                }
                switch (q) {
                    case "_blank":
                        window.open(o);
                        break;
                    default:
                        window.location.href = o
                }
            }
        }
    }(function () {
        var m = {
            dateformat: "%Y-%m-%d",
            monthesFNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            monthesSNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            daysFNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            daysSNames: ["日", "一", "二", "三", "四", "五", "六"],
            weekstart: 1
        };
        ots_global.calendarLang = ots_global.calendarLang || {};
        ots_global.calendarLang.zh_CN = m
    })();

    function b() {
        var m = new dhtmlXWindows();
        m.enableAutoViewport(true);
        m.setSkin("dhx_terrace");
        m.setImagePath(ctx + "resources/js/rich/windows/imgs/");
        return m
    }
    alertWarningMsgByHeader = function (m) {
        alertWarningMsg(messages["message.info"], m, "", messages["button.ok"])
    };
    alertWarningMsgByTit_header = function (m, n) {
        alertWarningMsg(m, n, "", messages["button.ok"])
    };
    alertWarningMsg = function (p, s, n) {
        i(p, s, n, messages["button.ok"]);
        $("#qd_closeDefaultWarningWindowDialog_id").click(function () {
            f()
        });
        $("#gb_closeDefaultWarningWindowDialog_id").click(function () {
            f()
        });
        var r = "defaultwarningAlert_id";
        var o = c(r);
        var m = $(window).width() / 2 - 300;
        var q = g() + ($(window).height() / 2 - 200);
        o.setDimension($("#content_" + r).width(), $("#content_" + r).height() + 10);
        $(".dhtmlx_window_active").height($("#content_" + r).height());
        $(".dhtmlx_window_active").css({
            left: m + "px",
            top: q + "px"
        })
    };

    function g() {
        if ("pageYOffset" in window) {
            return window.pageYOffset
        } else {
            if (document.compatMode == "BackCompat") {
                return document.body.scrollTop
            } else {
                return document.documentElement.scrollTop
            }
        }
    }
    function i(o, q, m, p) {
        var n =
            '<div id="defaultwarningAlert_id" style="display:none;" ><div class="mark"></div><div class="up-box w600" id="content_defaultwarningAlert_id"><div class="up-box-hd" ><span id="content_defaultwarningAlert_title">' +
            o +
            '</span><a href="#nogo"id="gb_closeDefaultWarningWindowDialog_id">关闭</a></div><div class="up-box-bd"><div class="up-con clearfix"><span class="icon i-warn"></span> <div class="r-txt"><div class="tit" id="content_defaultwarningAlert_hearder" >' +
            q + '</div><P  id="content_defaultwarningAlert_body">' + m +
            '</P></div></div> <div class="lay-btn"><a href="#nogo" id="qd_closeDefaultWarningWindowDialog_id" class="btn92s">' +
            p + "</a></div></div></div></div>";
        $("body").append(n)
    }
    function c(n) {
        var m = e.createWindow(n + "_", 50, 10, 660, 100);
        m.attachObject(n);
        m.clearIcon();
        m.denyResize();
        m.setModal(true);
        m.center();
        m.button("park").hide();
        m.button("minmax1").hide();
        m.hideHeader();
        return m
    }
    function f() {
        var m = "defaultwarningAlert_id";
        if (e.isWindow(m + "_")) {
            e.window(m + "_").close()
        }
    }
})();
var refreshImg = null;
var _top_;
var isDebug = false;
var two_isOpenClick = ["93", "95", "97", "99"];
var other_isOpenClick = ["93", "98", "99", "91", "95", "97"];
isCanGP = function (c, b) {
    if ("1" == c) {
        var a = two_isOpenClick.length;
        for (var d = 0; d < a; d++) {
            if (b == two_isOpenClick[d]) {
                return true
            }
        }
        return false
    } else {
        var a = other_isOpenClick.length;
        for (var d = 0; d < a; d++) {
            if (b == other_isOpenClick[d]) {
                return true
            }
        }
        return false
    }
};

function isLogin() {
    if ("undefined" != typeof (sessionInit) && (sessionInit) && (null != sessionInit)) {
        $("#login_user").attr("href", ctx + "index/initMy12306");
        $("#login_user").prev("span").html("您好，");
        $("#login_user").html(sessionInit);
        $("#regist_out").attr("href", ctx + "login/loginOut");
        $("#regist_out").html("退出")
    } else {
        $("#login_user").attr("href", ctx + "login/init");
        $("#login_user").prev("span").html("您好，请 ");
        $("#login_user").html("登录");
        $("#regist_out").attr("href", ctx + "regist/init");
        $("#regist_out").html("注册")
    }
}
function loginAsyn(a) {
    if (a != null) {
        $("#login_user").attr("href", ctx + "index/initMy12306");
        $("#login_user").prev("span").html(
            "意见反馈:<a class='cursor colorA' href='mailto:12306yjfk@rails.com.cn'>12306yjfk@rails.com.cn</a> 您好，");
        $("#login_user").html(a);
        $("#regist_out").attr("href", ctx + "login/loginOut");
        $("#regist_out").html("退出")
    } else {
        $("#login_user").attr("href", ctx + "login/init");
        $("#login_user").prev("span").html(
            "意见反馈:<a class='cursor colorA' href='mailto:12306yjfk@rails.com.cn'>12306yjfk@rails.com.cn</a> 您好，请 ");
        $("#login_user").html("登录");
        $("#regist_out").attr("href", ctx + "regist/init");
        $("#regist_out").html("注册")
    }
}
function _initGuideShow(b) {
    var a = $(".nav-list a");
    a.removeClass("on");
    $("#js-xd").find(".nav-list").show();
    $("#js-xd").unbind("mouseout");
    $("#js-xd").unbind("mouseover");
    $.each(a, function (c) {
        if (c == b) {
            $(a[c]).addClass("on");
            return
        }
    })
}
function checkHover(b, a) {
    if (getEvent(b).type == "mouseover") {
        return !contains(a, getEvent(b).relatedTarget || getEvent(b).fromElement) && !((getEvent(b).relatedTarget ||
            getEvent(b).fromElement) === a)
    } else {
        return !contains(a, getEvent(b).relatedTarget || getEvent(b).toElement) && !((getEvent(b).relatedTarget ||
            getEvent(b).toElement) === a)
    }
}
function getEvent(a) {
    return a || window.event
}
function contains(a, b) {
    if (a.contains) {
        return a != b && a.contains(b)
    } else {
        return !!(a.compareDocumentPosition(b) & 16)
    }
}
function initPageTitle(b) {
    $(".nav ul li").not("#js-xd li").eq(b).children("a").addClass("current");
    var c = $(".nav ul li a").not(".nav-list a");
    for (var a = 0; a < c.length; a++) {
        if (b != a) {
            c.eq(a).on("mouseenter", function () {
                $(this).addClass("current")
            }).on("mouseleave", function () {
                $(this).removeClass("current")
            })
        }
    }
}
function initNameNotice() {
    $("#name_rule").mouseenter(function (c) {
        var a = c.pageY + 10;
        var b = c.pageX;
        $(".name-tips").eq(0).css({
            top: a,
            left: b
        });
        $(".name-tips").eq(0).show()
    });
    $("#name_rule").mouseleave(function () {
        $(".name-tips").hide()
    })
}
clickCheckBoxName = function () {
    $("input[class='check']").each(function () {
        var c = $(this);
        var a = c.next("label").attr("for");
        var b = c.attr("id");
        if (null == b || "" == b || "undefined" == b) {
            var b = "checkbox_" + generateMixed();
            c.attr("id", b)
        }
        c.next("label").attr("for", b).css("cursor", "pointer")
    })
};

function generateMixed() {
    var b = "";
    var c = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
        "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f",
        "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    for (var a = 0; a < 10; a++) {
        var d = Math.ceil(Math.random() * 61);
        b += c[d]
    }
    return b
}
function showHelpName() {
    $.ajax({
        url: "../login/existUser",
        type: "POST",
        success: function (a) {
            if (a.success) {
                sessionInit = a.name;
                if ("undefined" != typeof (sessionInit) && (sessionInit) && (null != sessionInit)) {
                    $("#login_user").attr("href", "../index/initMy12306");
                    $("#login_user").prev("span").html(
                        "意见反馈:<a class='cursor colorA' href='mailto:12306yjfk@rails.com.cn'>12306yjfk@rails.com.cn</a> 您好，");
                    $("#login_user").html(sessionInit);
                    $("#regist_out").attr("href", "../login/loginOut");
                    $("#regist_out").html("退出")
                } else {
                    $("#login_user").attr("href", "../login/init");
                    $("#login_user").prev("span").html(
                        "意见反馈:<a class='cursor colorA' href='mailto:12306yjfk@rails.com.cn'>12306yjfk@rails.com.cn</a> 您好，请 ");
                    $("#login_user").html("登录");
                    $("#regist_out").attr("href", "../regist/init");
                    $("#regist_out").html("注册")
                }
            }
        }
    })
}
function controContentHeight() {
    var e = 0;
    var b = 0;
    if (window.attachEvent) {
        var a = navigator.appVersion;
        if (a.indexOf("MSIE 7.0") >= 0) {
            e = 53
        } else {
            e = 80;
            if (!document.getElementById("forget_password_id")) {
                b = 12
            }
        }
    } else {
        e = 78;
        if (!document.getElementById("forget_password_id")) {
            b = 15
        }
    }
    var c = 0;
    if (!$(".nav-list").is(":hidden")) {
        c = $(".nav-list").height()
    }
    var d = $(window).height() - $(".header").height() - $(".footer").height() - e + b - c;
    if (d > 400) {
        if ($("#scroll").css("display") == "block") {
            $(".content").css("min-height", d - 30)
        } else {
            $(".content").css("min-height", d)
        }
    }
}
jQuery.extend({
    showNotice: function () {
        if ("undefined" == typeof (isShowNotice) || "N" != isShowNotice) {
            $("#scroll").css("display", "block");
            var c = "<li><a >“网上购票”可购买预售期内不晚于开车前30分钟的列车车票；“网上订票”可预订4至20日列车车票。</a></li>";
            if (noticeContent && "undefined" != typeof (noticeContent)) {
                var b = noticeContent.length;
                if (b > 0) {
                    for (var a = 0; a < b; a++) {
                        c += "<li><a>" + noticeContent[a] + "</a></li>"
                    }
                }
            }
            $("#scroll .notice_in ul").html(c)
        } else {
            if ("N" == isShowNotice) {
                $("#scroll").hide();
                $("div.ban-area").hide()
            }
        }
    }
});
$(function () {
    var d = 0;
    $(document).ready(function () {
        if ("undefined" == typeof (sessionInit)) {
            showHelpName()
        } else {}
        controContentHeight();
        $(".menu-list").on("mouseover", function (e) {
            if (checkHover(e, this)) {
                d = 1
            }
        }).on("mouseleave", function () {
            d = 0;
            $(".menu-list").hide()
        });
        $(".nav>ul>li>a").click(function () {
            $(".nav>ul>li").removeClass();
            $(this).parent().addClass("current")
        });
        $(".notice_in ul a").click(function () {
            otsRedirect("post", ctx + "index/showAnnouncement")
        });
        if ($(".phone-link").html() == undefined) {
            $(".login-info").prepend("<div class='phone-link'><a href='../appDownload/init'>手机版</a></div>")
        }
        b()
    });

    function b() {
        document.body.appendChild($(
            '<a href="#" id="_return_top" class="return-top" title="返回顶部" style="display: block;"></a>')[0]);
        var e = !window.XMLHttpRequest;
        $("#_return_top").css({
            position: e ? "absolute" : "fixed",
            bottom: "30px",
            right: "30px"
        }).goToTop(5);
        $(window).on("scroll resize", function () {
            $("#_return_top").goToTop(5)
        })
    }
    $("#js-my").on("mouseover", function () {
        if (a) {
            clearTimeout(a)
        }
        $(".menu-list").show()
    });
    var a = null;
    $("#js-my").on("mouseout", function () {
        a = setTimeout(function () {
            if (d != 1) {
                d = 0;
                $(".menu-list").hide()
            }
        }, 120)
    });
    $("#js-xd").on("mouseover", function () {
        if (c) {
            clearTimeout(c)
        }
        $("#js-xd").addClass("nav-guide");
        $(this).find(".nav-list").show()
    });
    var c = null;
    $("#js-xd").on("mouseout", function (e) {
        var f = $(this);
        c = setTimeout(function () {
            f.find(".nav-list").hide()
        }, 120)
    });
    $(".pos-rel input").focus(function () {
        $(this).next().show();
        $(this).css("border", "1px solid #2D8DCF")
    });
    $(".pos-rel input").blur(function () {
        $(this).next().hide();
        $(this).css("border", "1px solid #CFCDC7")
    });
    $("#scroll>a:last").click(function () {
        $.ajax({
            url: ctx + "Notice/showNotice",
            type: "POST",
            success: function (e) {
                if (e.status) {
                    $("#scroll").hide();
                    $("div.ban-area").hide()
                }
            }
        })
    });
    if (!window.debug) {
        window.debug = function (f) {
            try {
                if (!window.console) {
                    window.console = {};
                    window.console.log = function () {
                        return
                    }
                }
                if (isDebug) {
                    window.console.log(f + " ")
                }
            } catch (g) {}
        }
    }
});
(function (a) {
    a.fn.goToTop = function (d) {
        var e = a(window);
        var c = a(this);
        var b = (e.scrollTop() > d) ? true : false;
        if (b) {
            c.stop().show()
        } else {
            c.stop().hide()
        }
        return this
    };
    a.fn.headerFloat = function () {
        var b = function (c) {
            var d = false;
            a(window).on("scroll resize", function () {
                var e = a(this).scrollTop();
                if (!d) {
                    d = c.position().left - 1
                }
                _top_ = c.position().top;
                if (e > _top_ + 30) {
                    if (!(navigator.appVersion.indexOf("MSIE 6") > -1)) {
                        a("#floatTable")[0].style.position = "fixed";
                        a("#floatTable")[0].style.top = 0;
                        a("#floatTable").css("z-index", "1900");
                        a("#floatTable").css("left", d)
                    } else {
                        a("#floatTable").css({
                            position: "absolute",
                            top: e,
                            left: d
                        })
                    }
                    a("#floatTable").show()
                } else {
                    a("#floatTable").css({
                        top: _top_
                    });
                    a("#floatTable").hide()
                }
            })
        };
        return a(this).each(function () {
            b(a(this))
        })
    }
})(jQuery);
(function (C) {
    jQuery.extend({
        ht_getcookie: function (W) {
            var k = document.cookie.indexOf(W);
            var i = document.cookie.indexOf(";", k);
            return k == -1 ? "" : unescape(document.cookie.substring(k + W.length + 1, (i > k ? i : document.cookie.length)))
        },
        ht_setcookie: function (aa, Z, Y, X, k, W) {
            var i = new Date();
            i.setTime(i.getTime() + Y * 1000);
            document.cookie = escape(aa) + "=" + escape(Z) + (i ? "; expires=" + i.toGMTString() : "") + (X ? "; path=" +
                X : "; path=/") + (k ? "; domain=" + k : "") + (W ? "; secure" : "")
        },
        textFocus: function (W) {
            var k, i, W = W === undefined ? 0 : parseInt(W);
            this.each(function () {
                if (!this.setSelectionRange) {
                    k = this.createTextRange();
                    W === 0 ? k.collapse(false) : k.move("character", W);
                    k.select()
                } else {
                    i = this.value.length;
                    W === 0 ? this.setSelectionRange(i, i) : this.setSelectionRange(W, W)
                }
                this.focus()
            });
            return this
        }
    });
    var w = [];
    var D = [];
    var E = [];
    var G = [];
    var v = 0;
    var y = 0;
    var A = 0;
    var S = 0;
    var U = false;
    var g = false;
    var H = false;
    var z = 0;
    var I = null;
    var m = -1;
    var N = {};
    var f = [];
    var e = [];
    var d = [];
    var b = [];
    var V = [];
    var F = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
        "t", "u", "v", "w", "x", "y", "z");
    var j = [];
    var x = false;
    var c = [];
    for (var R = 0; R < 26; R++) {
        c[R] = []
    }
    var P = [];
    for (var T = 0; T < 5; T++) {
        P[T] = []
    }
    var t = [];
    var s = [];
    var q = [];
    var p = [];
    var o = [];
    var K = [];
    var a = false;
    var L = true;
    var u = 12;
    var h = "简码/汉字";
    var n = "简码/汉字";
    var r = "inp-txt_select";
    var l = "inp-txt";
    var B = false;
    var J = null;
    var Q = null;
    var M = false;
    var O = C.ht_getcookie("hj_favcity");
    C.stationFor12306 = {
        bindInputs: [],
        get_initInputValue: function () {
            return h
        },
        get_initTopInputValue: function () {
            return n
        },
        city_Bind: function (k) {
            if (k.length == 0) {
                return
            }
            var i = "";
            C.each(k, function (W) {
                if (O == k[W][2]) {
                    i += "<div class='cityline' id='citem_" + W + "' cturn='" + k[W][6] + "'><span class='ralign'><b>" +
                        k[W][1] + "</b></span></div>\n"
                } else {
                    i += "<div class='cityline' id='citem_" + W + "' cturn='" + k[W][6] + "'><span class='ralign'>" + k[
                            W][1] + "</span><span style='float:right;' class='ralign'>" + k[W][3] + "</span></div>\n"
                }
            });
            C("#panel_cities").html(i);
            C(".cityline").mouseover(function () {
                C.stationFor12306.city_shiftSelect(this)
            }).click(function () {
                C.stationFor12306.city_confirmSelect();
                E = C.stationFor12306.filterCity("");
                C.stationFor12306.city_showlist(0)
            });
            C.stationFor12306.city_shiftSelect(C("#citem_0"))
        },
        city_changeSelectIndex: function (i) {
            var k = A + i;
            if (k == -1) {
                C.stationFor12306.city_showlist(z - 1);
                C.stationFor12306.city_shiftSelect(C("#citem_" + (G.length - 1)))
            } else {
                if (k == G.length) {
                    C.stationFor12306.city_showlist(z + 1);
                    C.stationFor12306.city_shiftSelect(C("#citem_0"))
                } else {
                    C.stationFor12306.city_shiftSelect(C("#citem_" + k))
                }
            }
        },
        city_confirmSelect: function () {
            I.val(S[1]);
            curObjCode.val(S[2]);
            if (B) {
                C.stationFor12306.setStationInCookies(S[1], S[2])
            }
            C("#form_cities").css("display", "none");
            C("#form_cities2").css("display", "none");
            C("#form_cities3").css("display", "none");
            m = -1;
            y = 0;
            C.stationFor12306.setStationStyle();
            if (L) {
                C.stationFor12306.LoadJS(S[2])
            }
            if (J) {
                J(I, curObjCode)
            }
        },
        city_shiftSelect: function (k) {
            if (v != k) {
                if (v != 0) {
                    C(v).removeClass("citylineover").addClass("cityline").css("backgroundColor", "white")
                }
                if (k != 0) {
                    try {
                        v = k;
                        var i = C(v).removeClass("cityline").addClass("citylineover").css("backgroundColor", "#c8e3fc");
                        A = Number(i.attr("id").split("_")[1]);
                        S = w[Number(i.attr("cturn"))];
                        C("#cityid").val(S[2])
                    } catch (W) {}
                }
            }
        },
        city_shiftSelectInLi: function (i) {
            if (y != i) {
                if (y != 0) {
                    C(y).removeClass("ac_over").addClass("ac_odd")
                }
                if (i != 0) {
                    try {
                        y = i;
                        C(y).removeClass("ac_odd").addClass("ac_over")
                    } catch (k) {}
                }
            }
        },
        js: function (W) {
            var k;
            for (k = 1; k <= 7; k++) {
                if (C("#nav_list" + k).attr("class")) {
                    C("#ul_list" + k).css("display", "none");
                    C("#nav_list" + k).removeClass("action")
                }
            }
            for (k = 1; k <= 7; k++) {
                if (k == W) {
                    C("#ul_list" + k).css("display", "block");
                    C("#nav_list" + k).addClass("action");
                    if (k == 1 || k == 7) {
                        C("#flip_cities2").css("display", "none")
                    }
                    if (k > 1 && k < 7) {
                        var Y = C.stationFor12306.tHtmlGetCityName(W - 1, -1, 0);
                        if (Y > u) {
                            var X = Math.ceil(Y / u);
                            if (X > 1) {
                                C.stationFor12306.pageDesigh(X, 0, k)
                            }
                            C("#flip_cities2").css("display", "block")
                        } else {
                            C("#flip_cities2").css("display", "none")
                        }
                    } else {
                        I.focus()
                    }
                } else {
                    C("#ul_list" + k).css("display", "none");
                    C("#nav_list" + k).removeClass("action")
                }
            }
            if (1 != W) {
                C(".ac_even").on("mouseover", function () {
                    C.stationFor12306.city_shiftSelectInLi(this)
                }).on("click", function () {
                    I.val(C(this).text());
                    curObjCode.val(C(this).attr("data"));
                    if (B) {
                        C.stationFor12306.setStationInCookies(C(this).text(), C(this).attr("data"))
                    }
                    C("#form_cities2").css("display", "none");
                    m = -1;
                    y = 0;
                    C.stationFor12306.setStationStyle();
                    if (L) {
                        C.stationFor12306.LoadJS(C(this).attr("data"))
                    }
                    if (J) {
                        J(I, curObjCode)
                    }
                })
            }
        },
        tHtmlGetCityName: function (k, i, X) {
            switch (k) {
                case 0:
                    if (i == -1) {
                        return D.length
                    }
                    if (i == -2) {
                        return D
                    }
                    return D[i];
                    break;
                case 1:
                    if (i == -1) {
                        return c[3].length
                    }
                    if (i == -2) {
                        return f
                    }
                    if (f.length > u) {
                        var W = Math.ceil((f.length) / u);
                        if (W > 1) {
                            t = f.slice(u * (X), Math.min(u * (X + 1), f.length));
                            return t[i]
                        }
                    }
                    return f[i];
                    break;
                case 2:
                    if (i == -1) {
                        return c[7].length
                    }
                    if (i == -2) {
                        return e
                    }
                    if (e.length > u) {
                        var W = Math.ceil((e.length) / u);
                        if (W > 1) {
                            s = e.slice(u * (X), Math.min(u * (X + 1), e.length));
                            return s[i]
                        }
                    }
                    return e[i];
                    break;
                case 3:
                    if (i == -1) {
                        return c[11].length
                    }
                    if (i == -2) {
                        return d
                    }
                    if (d.length > u) {
                        var W = Math.ceil((d.length) / u);
                        if (W > 1) {
                            q = d.slice(u * (X), Math.min(u * (X + 1), d.length));
                            return q[i]
                        }
                    }
                    return d[i];
                    break;
                case 4:
                    if (i == -1) {
                        return c[18].length
                    }
                    if (i == -2) {
                        return b
                    }
                    if (b.length > u) {
                        var W = Math.ceil((b.length) / u);
                        if (W > 1) {
                            p = b.slice(u * (X), Math.min(u * (X + 1), b.length));
                            return p[i]
                        }
                    }
                    return b[i];
                    break;
                case 5:
                    if (i == -1) {
                        return c[24].length
                    }
                    if (i == -2) {
                        return V
                    }
                    if (V.length > u) {
                        var W = Math.ceil((V.length) / u);
                        if (W > 1) {
                            o = V.slice(u * (X), Math.min(u * (X + 1), V.length));
                            return o[i]
                        }
                    }
                    return V[i];
                    break;
                default:
                    return "error";
                    break
            }
        },
        closeShowCity: function () {
            C("#form_cities2").css("display", "none");
            m = -1;
            y = 0;
            C.each(C.stationFor12306.bindInputs, function (Y, X) {
                var W = "#" + X;
                var k = "#" + X + "Text";
                var i = C(k).val();
                if ("" == i) {
                    C(k).val(h);
                    C.stationFor12306.from_to_station_class_gray(C(k));
                    C(W).val("")
                }
            })
        },
        showAllCity: function () {
            var ab = "";
            var k = "440px";
            if (B) {
                k = "400px"
            }
            ab = '<div class="com_hotresults" id="thetable" style="width:' + k +
                '"><div style="width:100%;"><div class="ac_title"><span>拼音支持首字母输入</span><a class="ac_close" style="cursor:pointer" title="关闭" onclick="$.stationFor12306.closeShowCity()"></a></div><ul class="AbcSearch clx" id="abc">';
            if (B) {
                ab = ab +
                    '<li class="action" index="7" method="liHotTab"  onclick="$.stationFor12306.js(7)" id="nav_list7">常用</li>'
            }
            ab = ab +
                '<li index="1" method="liHotTab"  onclick="$.stationFor12306.js(1)" id="nav_list1">热门</li><li index="2" method="liHotTab"  onclick="$.stationFor12306.js(2)" id="nav_list2">ABCDE</li><li index="3" method="liHotTab"  onclick="$.stationFor12306.js(3)" id="nav_list3">FGHIJ</li><li index="4" method="liHotTab"  onclick="$.stationFor12306.js(4)" id="nav_list4">KLMNO</li><li index="5" method="liHotTab"  onclick="$.stationFor12306.js(5)" id="nav_list5">PQRST</li><li index="6" method="liHotTab"  onclick="$.stationFor12306.js(6)" id="nav_list6">UVWXYZ</li></ul>';
            if (B) {
                ab +=
                    '<ul class="popcitylist" style="overflow: auto;max-height: 280px;height: 191px;" method="hotData" id="ul_list7">';
                var ac = C.stationFor12306.getStationInCookies();
                var Y = ac.length;
                if (Y > 2) {
                    M = true;
                    for (var ad = 0; ad < Y; ad++) {
                        ab += '<li class="ac_even"   title="' + ac[ad][0] + '" data="' + ac[ad][1] + '">' + ac[ad][0] +
                            "</li>"
                    }
                }
                ab += "</ul>"
            }
            ab +=
                '<ul class="popcitylist" style="overflow: auto;max-height: 280px;height: 191px;display:none;" method="hotData" id="ul_list1">';
            var X = C.stationFor12306.tHtmlGetCityName(0, -1, 0);
            var aa = "";
            if (!B) {
                aa = " openLi"
            }
            for (var ad = 0; ad < X; ad++) {
                ab += '<li class="ac_even' + aa + '"   title="' + C.stationFor12306.tHtmlGetCityName(0, ad, 0)[1] +
                    '" data="' + C.stationFor12306.tHtmlGetCityName(0, ad, 0)[2] + '">' + C.stationFor12306.tHtmlGetCityName(
                        0, ad, 0)[1] + "</li>"
            }
            ab += "</ul>";
            for (var ae = 2; ae <= 6; ae++) {
                var Z = ae - 1;
                var i = C.stationFor12306.tHtmlGetCityName(Z, -1, 0);
                if (i > u) {
                    var W = Math.ceil((i) / u);
                    if (W > 1) {
                        ab += '<div id="ul_list' + ae + '">';
                        C.stationFor12306.pageDesigh(W, 0, ae)
                    }
                    C("#flip_cities2").css("display", "block")
                } else {
                    ab +=
                        '<ul  class="popcitylist" style="overflow: auto; max-height: 260px; height: 191px;display:none;" id="ul_list' +
                        ae + '">';
                    C("#flip_cities2").css("display", "none");
                    var aa = "";
                    if (!B) {
                        aa = " openLi"
                    }
                    for (var ad = 0; ad < C.stationFor12306.tHtmlGetCityName(Z, -1, 0); ad++) {
                        ab += '<li class="ac_even' + aa + '"   title="' + C.stationFor12306.tHtmlGetCityName(Z, ad, 0)[
                                1] + '" data="' + C.stationFor12306.tHtmlGetCityName(Z, ad, 0)[2] + '">' + C.stationFor12306
                                .tHtmlGetCityName(Z, ad, 0)[1] + "</li>"
                    }
                }
                ab += "</div>"
            }
            ab += '<div id="flip_cities2"> 翻页控制区</div>';
            ab += "</div>";
            C("#panel_cities2").html(ab);
            C("#thetable").on("click", function () {
                if (C("#form_cities2").css("display") == "block") {
                    if (m == 1 | m == 0) {
                        m == -1
                    }
                    I.select()
                }
            });
            C("#form_cities").on("click", function () {
                if (C("#form_cities").css("display") == "block") {
                    if (m == 1 | m == 0) {
                        m == -1
                    }
                    I.select()
                }
            });
            C(".ac_even").on("mouseover", function () {
                C.stationFor12306.city_shiftSelectInLi(this)
            }).on("click", function () {
                I.val(C(this).text());
                curObjCode.val(C(this).attr("data"));
                if (B) {
                    C.stationFor12306.setStationInCookies(C(this).text(), C(this).attr("data"))
                }
                C("#form_cities2").css("display", "none");
                m = -1;
                y = 0;
                C.stationFor12306.setStationStyle();
                if (L) {
                    C.stationFor12306.LoadJS(C(this).attr("data"))
                }
                if (J) {
                    J(I, curObjCode)
                }
            });
            C("#flip_cities2").css("display", "none");
            return w
        },
        LoadJS: function (W) {
            if (((typeof (mm_addjs) != "undefined")) && ("" != mm_addjs) && (mm_addjs == 1)) {
                var k = document.getElementsByTagName("HEAD").item(0);
                var i = document.createElement("SCRIPT");
                i.src = mm_srcjs + W + ".js";
                i.type = "text/javascript";
                k.appendChild(i)
            }
        },
        addZMHtml: function (X, Y) {
            var W = "";
            if (X && X.length > 0) {
                var Z = X[0][0].charAt(0);
                W += '<ul  class="popcitylist" style="overflow: auto; max-height: 260px; " >';
                W += '<li class="ac_letter">' + Z.toUpperCase() + "</li>";
                for (var i = 0; i < 12; i++) {
                    var k = X[i];
                    if (k) {
                        W += '<li class="ac_even' + Y + '"   title="' + k[1] + '" data="' + k[2] + '">' + k[1] +
                            "</li>"
                    } else {
                        W += '<li class="ac_even' + Y + '" </li>'
                    }
                }
                W += "</ul>"
            }
            return W
        },
        pageDesigh: function (Z, ac, ad) {
            var W = "";
            if (Z > 1) {
                if (ac == -1) {
                    ac = (Z - 1)
                } else {
                    if (ac == Z) {
                        ac = 0
                    }
                }
                var ab = "";
                if (!B) {
                    ab = " openLi"
                }
                for (var X = 2; X <= 6; X++) {
                    if (X == ad) {
                        var aa = P[X - 2];
                        for (var i = 0; i < aa.length; i++) {
                            K = aa[i].slice(ac * u, (ac + 1) * u);
                            W += C.stationFor12306.addZMHtml(K, ab)
                        }
                    }
                }
                C("#ul_list" + ad).html(W);
                C("#ul_list" + ad).css("height", 270);
                if (W) {
                    var Y = (ac == 0) ? "« 上一页" :
                    "<a style='cursor:pointer'    class='cityflip' onclick='$.stationFor12306.pageDesigh(" + Z +
                    "," + (ac - 1) + "," + ad + ");return false;'>« 上一页</a>";
                    Y += "     |    ";
                    Y += (ac == Z - 1) ? "下一页 »" :
                    "<a style='cursor:pointer' class='cityflip'  onclick='$.stationFor12306.pageDesigh(" + Z + "," +
                    (ac + 1) + "," + ad + ")'>下一页 »</a>";
                    C("#flip_cities2").html(Y)
                } else {
                    C("#flip_cities2").html("")
                } if (m == 1 | m == 0 | m == 2) {
                    m == -1
                }
                if (I) {
                    I.select()
                }
            } else {}
            C(".ac_even").on("mouseover", function () {
                C.stationFor12306.city_shiftSelectInLi(this)
            }).on("click", function () {
                I.val(C(this).text());
                curObjCode.val(C(this).attr("data"));
                if (B) {
                    C.stationFor12306.setStationInCookies(C(this).text(), C(this).attr("data"))
                }
                C("#form_cities2").css("display", "none");
                m = -1;
                y = 0;
                C.stationFor12306.setStationStyle();
                if (L) {
                    C.stationFor12306.LoadJS(C(this).attr("data"))
                }
                if (J) {
                    J(I, curObjCode)
                }
            })
        },
        filterCity: function (Z) {
            if (Z.length == 0) {
                C("#top_cities").html(n);
                return w
            }
            var Y = /<\/?[^>]*>/g;
            Z = Z.replace(Y, "");
            var W = [];
            var k = /[^A-z]/.test(Z);
            for (var X = 0; X < w.length; X++) {
                if (C.stationFor12306.isMatchCity(w[X], Z, k)) {
                    W.push(w[X])
                }
            }
            if (W.length > 0) {
                C("#top_cities").html('按"<font color=red>' + Z + '</font>"检索：');
                return W
            } else {
                C("#top_cities").html("无法匹配:<font color=red>" + Z + "</font>");
                return []
            }
        },
        replaceChar: function (i, W, k) {
            return i.substr(0, W) + k + i.substr(W + 1, i.length - 1)
        },
        isMatchCity: function (Z, ac, W) {
            var ac = ac.toLowerCase();
            var k = [Z[4].toLowerCase(), Z[1], Z[3].toLowerCase()];
            var ab = -1;
            var Y = -1;
            if (W) {
                ac = ac.split("");
                for (var X = 0; X < ac.length; X++) {
                    var ae = k[1].indexOf(ac[X]);
                    if (ae > ab && ae <= X) {
                        k[1] = C.stationFor12306.replaceChar(k[1], ae, "-");
                        ab = ae
                    } else {
                        return false
                    }
                }
            } else {
                ac = ac.split("");
                var i = true;
                var aa = true;
                for (var X = 0; X < ac.length; X++) {
                    var ae = k[0].indexOf(ac[X]);
                    if (ae > ab && ae <= X) {
                        k[0] = C.stationFor12306.replaceChar(k[0], ae, "-");
                        ab = ae
                    } else {
                        i = false;
                        break
                    }
                }
                for (var X = 0; X < ac.length; X++) {
                    var ad = k[2].indexOf(ac[X]);
                    if (ad > Y && ad <= X) {
                        k[2] = C.stationFor12306.replaceChar(k[2], ad, "-");
                        Y = ad
                    } else {
                        aa = false;
                        break
                    }
                }
                if ((i == false) && (aa == false)) {
                    return false
                }
            }
            return true
        },
        city_showlist_page: function (ad, Y) {
            var Z = "";
            Z += '<div class="citypage">';
            Z += (ad == 0) ? "" : '<a href="#" class="pagetxt" onclick="$.stationFor12306.city_showlist(' + (ad - 1) +
            ');return false;"><<</a>';
            var ae = ad + 1;
            var aa = Y;
            var ab = 2;
            var ac = 5;
            var k = (ae - ab) > 0 ? (ae + ab > aa ? aa - ac + 1 : ae - ab) : 1;
            var W = k + ac > aa ? aa + 1 : k + ac;
            if (aa < ac) {
                for (var X = 1; X < aa + 1; X++) {
                    if (ae == X) {
                        Z += "<a href='' class='cur' onclick='$.stationFor12306.city_showlist(" + (X - 1) +
                            ");return false;'>" + (X) + "</a>"
                    } else {
                        Z += "<a href='' onclick='$.stationFor12306.city_showlist(" + (X - 1) + ");return false;'>" + (
                                X) + "</a>"
                    }
                }
            } else {
                for (var X = k; X < W; X++) {
                    if (ae == X) {
                        Z += "<a href='' class='cur' onclick='$.stationFor12306.city_showlist(" + (X - 1) +
                            ");return false;'>" + (X) + "</a>"
                    } else {
                        Z += "<a href='' onclick='$.stationFor12306.city_showlist(" + (X - 1) + ");return false;'>" + (
                                X) + "</a>"
                    }
                }
            }
            Z += (ad == Y - 1) ? "" : '<a href="" class="pagetxt" onclick="$.stationFor12306.city_showlist(' + (ad + 1) +
            ');return false;">>></a>';
            Z += "</div>";
            return Z
        },
        city_showlist: function (W) {
            if (E.length > 6) {
                var k = Math.ceil((E.length) / 6);
                if (W == -1) {
                    W = (k - 1)
                } else {
                    if (W == k) {
                        W = 0
                    }
                }
                G = E.slice(6 * (W), Math.min(6 * (W + 1), E.length));
                C.stationFor12306.city_Bind(G);
                var i = "";
                i += C.stationFor12306.city_showlist_page(W, k);
                C("#flip_cities").html(i);
                C("#flip_cities").css("display", "block")
            } else {
                W = 0;
                G = E;
                C.stationFor12306.city_Bind(G);
                C("#flip_cities").css("display", "none")
            }
            z = W;
            if (C("#form_cities").css("display") == "block") {
                a = true;
                I.focus()
            }
        },
        fixDivBugInIE6: function (i) {
            try {
                i.bgiframe();
                if (i.width() > C("> ul", i).width()) {
                    i.css("overflow", "hidden")
                } else {
                    C("> iframe.bgiframe", i).width(C("> ul", i).width());
                    i.css("overflow", "scroll")
                } if (i.height() > C("> ul", i).height()) {
                    i.css("overflow", "hidden")
                } else {
                    C("> iframe.bgiframe", i).height(C("> ul", i).height());
                    i.css("overflow", "scroll")
                }
            } catch (k) {}
        },
        clearStation: function (i) {
            m = -1;
            var W = I.val();
            var X = curObjCode.val();
            if (W == "" || X == "") {
                I.val("");
                curObjCode.val("")
            } else {
                var k = W + "|" + X;
                if (typeof (station_names) != "undefined") {
                    if (station_names.indexOf(k) == -1) {
                        I.val("");
                        curObjCode.val("")
                    } else {
                        if ("click" == i) {
                            I.select();
                            if (C("#form_cities").is(":hidden")) {
                                C("#form_cities2").css("display", "block")
                            }
                        }
                    }
                } else {
                    I.val("");
                    curObjCode.val("")
                }
            }
        },
        MapCityID: function (W) {
            for (var k = 0; k < w.length; k++) {
                if (w[k][1] == W) {
                    return w[k][2]
                }
            }
            return 0
        },
        MapCityName: function (k) {
            for (var W = 0; W < w.length; W++) {
                if (w[W][2] == k) {
                    return w[W][1]
                }
            }
            return ""
        },
        SetISPos: function (Y) {
            if (Q) {
                Q(C("#form_cities"), C("#form_cities2"))
            } else {
                C("#form_cities").css("left", Y.position().left);
                C("#form_cities").css("top", Y.position().top + Y.height() + 12);
                C("#form_cities2").css("left", Y.position().left);
                C("#form_cities2").css("top", Y.position().top + Y.height() + 12)
            }
            var X = Y.offset().top;
            var i = C("#search_div");
            var k = C("#choice_div");
            i.css("top", X);
            k.css("top", X);
            var W = Y.offset().left;
            i.css("left", W);
            k.css("left", W)
        },
        myHandlerFg: function (i) {
            if (i == null) {
                i.keyCode = 9
            } else {
                if (!i.which && i.which == 13) {
                    i.preventDefault()
                } else {
                    if (i.which && i.keyCode == 13) {
                        i.which = 9
                    }
                }
            }
        },
        myHandler2: function (i) {
            if (i == null) {
                i = window.event;
                i.returnValue = false
            } else {
                if (i.which && i.which == 13) {
                    var W = document.getElementById("Upload_Data3");
                    if (document.createEvent) {
                        var k = document.createEvent("MouseEvents");
                        k.initEvent("click", true, false);
                        W.dispatchEvent(k)
                    } else {
                        if (document.createEventObject) {
                            W.fireEvent("onclick")
                        }
                    }
                } else {
                    if (!i.which && i.which == 13) {
                        i.preventDefault()
                    }
                }
            }
        },
        from_to_station_class_plain: function (i) {
            if (l && l != "") {
                i.removeClass(l)
            }
            if (r && r != "") {
                i.addClass(r)
            }
        },
        from_to_station_class_gray: function (i) {
            if (r && r != "") {
                i.removeClass(r)
            }
            if (l && l != "") {
                i.addClass(l)
            }
        },
        setStationStyle: function () {
            var i = I.val();
            if (i == "") {
                I.val(h);
                C.stationFor12306.from_to_station_class_gray(I);
                curObjCode.val("")
            } else {
                C.stationFor12306.from_to_station_class_plain(I)
            }
        },
        setCurValue: function () {
            I.val(S[1]);
            curObjCode.val(S[2])
        },
        bindEvent: function (i) {
            var W = "#" + i;
            var k = "#" + i + "Text";
            C(k).keydown(function (Y) {
                I = C(k);
                curObjCode = C(W);
                m = 0;
                a = true;
                L = true;
                C("#form_cities2").css("display", "none");
                y = 0;
                var X = C(k).width();
                if (-[1, ]) {
                    X = X - 4
                }
                X = X < 220 ? 220 : X;
                C("#form_cities").css("width", X);
                C("#form_cities").css("display", "block");
                C(".AbcSearch li").removeClass("action");
                C(".popcitylist").css("display", "none");
                if (M && B) {
                    C("#ul_list7").css("display", "block");
                    C("#nav_list7").addClass("action")
                } else {
                    C("#nav_list1").addClass("action");
                    C("#ul_list1").css("display", "block")
                }
                C("#flip_cities2").css("display", "none");
                C(".ac_even").removeClass("ac_over").addClass("ac_odd");
                Y = Y || window.event;
                if (Y.keyCode == 40) {
                    C.stationFor12306.city_changeSelectIndex(1);
                    C("#form_cities").css("display", "block");
                    C.stationFor12306.SetISPos(I);
                    C.stationFor12306.setCurValue()
                } else {
                    if (Y.keyCode == 38) {
                        C.stationFor12306.city_changeSelectIndex(-1);
                        C.stationFor12306.setCurValue();
                        C("#form_cities").css("display", "block");
                        C.stationFor12306.SetISPos(I)
                    } else {
                        if (Y.keyCode == 13) {
                            C.stationFor12306.city_confirmSelect();
                            if (document.addEventListener) {
                                document.addEventListener("keypress", C.stationFor12306.myHandlerFg, true)
                            } else {
                                evt = window.event;
                                evt.keyCode = 9
                            }
                        }
                    }
                }
            }).focus(function () {
                L = true;
                if (a) {
                    C("#form_cities2").css("display", "none");
                    y = 0;
                    a = false;
                    m = -1
                } else {
                    if (m == -1) {
                        C(".AbcSearch li").removeClass("action");
                        C(".popcitylist").css("display", "none");
                        C("#flip_cities2").css("display", "none");
                        if (M && B) {
                            C("#ul_list7").css("display", "block");
                            C("#nav_list7").addClass("action")
                        } else {
                            C("#nav_list1").addClass("action");
                            C("#ul_list1").css("display", "block")
                        }
                        C(".ac_even").removeClass("ac_over").addClass("ac_odd");
                        C("#form_cities2").css("display", "block");
                        for (var X = 2; X <= 6; X++) {
                            C("#ul_list" + X).css("height", 0)
                        }
                    }
                }
                I = C(k);
                curObjCode = C(W);
                m = 0;
                U = true;
                C.stationFor12306.SetISPos(I)
            }).blur(function () {
                I = C(k);
                curObjCode = C(W);
                m = 0;
                a = false;
                L = true;
                if (!g && !H) {
                    C.stationFor12306.clearStation("blur");
                    U = false;
                    C("#form_cities").css("display", "none");
                    C("#form_cities2").css("display", "none");
                    m = -1;
                    y = 0;
                    E = C.stationFor12306.filterCity("");
                    C.stationFor12306.city_showlist(0);
                    C.stationFor12306.setStationStyle()
                }
            }).keyup(function (X) {
                I = C(k);
                curObjCode = C(W);
                m = 0;
                a = true;
                X = X || window.event;
                if (X.keyCode != 40 && X.keyCode != 38 && X.keyCode != 37 && X.keyCode != 39 && X.keyCode != 13 && X.keyCode !=
                    9) {
                    E = C.stationFor12306.filterCity(I.val());
                    C.stationFor12306.city_showlist(0)
                }
            }).click(function () {
                C.stationFor12306.clearStation("click")
            });
            C.stationFor12306.bindInputs.push(i)
        },
        getStationInCookies: function () {
            var W = [];
            var k = C.ht_getcookie("_city_name_save_station");
            if (k) {
                var i = k.split(",");
                if (i && i.length > 0) {
                    C.each(i, function (aa, Z) {
                        var X = Z.split("#");
                        var Y = [];
                        Y[0] = X[0];
                        Y[1] = X[1];
                        W[aa] = Y
                    })
                }
            }
            return W
        },
        setStationInCookies: function (af, W) {
            var ac = C.stationFor12306.getStationInCookies();
            var Z = [];
            var ag = ac.length;
            var Y = true;
            var ah = 10;
            for (var aa = 0; aa < ag; aa++) {
                if (ac[aa][0] == af && ac[aa][1] == W) {
                    Y = false
                }
                Z.push(ac[aa])
            }
            if (Y) {
                Z.push([af, W])
            }
            var ab = Z;
            var X = "";
            var ad = ab.length;
            var aa = 0;
            if (ad > ah) {
                aa = 1
            }
            var i = aa;
            if (ad > 1) {
                C("#ul_list7").html("");
                M = true
            }
            var ae = "";
            for (; aa < ad; aa++) {
                if (aa > i) {
                    X += ","
                }
                X += ab[aa][0] + "#" + ab[aa][1];
                if (M && B) {
                    ae +=
                        '<li class="ac_even" onmouseover="$.stationFor12306.city_shiftSelectInLi(this);" onclick="$.stationFor12306.li_click(this);"   title="' +
                        ab[aa][0] + '" data="' + ab[aa][1] + '">' + ab[aa][0] + "</li>"
                }
            }
            if (M && B) {
                C("#ul_list7").html(ae)
            }
            C.ht_setcookie("_city_name_save_station", X, 365 * 24 * 60 * 60)
        },
        li_click: function (i) {
            I.val(C(i).text());
            curObjCode.val(C(i).attr("data"));
            if (B) {
                C.stationFor12306.setStationInCookies(C(i).text(), C(i).attr("data"))
            }
            C("#form_cities2").css("display", "none");
            m = -1;
            y = 0;
            C.stationFor12306.setStationStyle();
            if (L) {
                C.stationFor12306.LoadJS(C(i).attr("data"))
            }
            if (J) {
                J(I, curObjCode)
            }
        },
        init: function (ac, ad) {
            if (typeof (ad) != "undefined") {
                if (typeof (ad._init_input) != "undefined") {
                    h = ad._init_input
                }
                if (typeof (ad._top_4_initInput) != "undefined") {
                    n = ad._top_4_initInput
                }
                if (typeof (ad.confirmCallBack) != "undefined") {
                    J = ad.confirmCallBack
                }
                if (typeof (ad._selected_class) != "undefined") {
                    r = ad._selected_class
                }
                if (typeof (ad._unselected_class) != "undefined") {
                    l = ad._unselected_class
                }
                if (typeof (ad._12306_openFavorite) != "undefined") {
                    B = ad._12306_openFavorite
                }
                if (typeof (ad.position) != "undefined") {
                    Q = ad.position
                }
            }
            if (typeof (station_names) != "undefined") {
                var Z = station_names.split("@");
                for (var Y = 0; Y < Z.length; Y++) {
                    var ab = Z[Y];
                    var aa = ab.toString().charAt(0);
                    for (var X in F) {
                        if (aa == F[X]) {
                            c[X].push(ab.split("|"))
                        }
                    }
                    if (ab.length > 0) {
                        ab = ab.split("|");
                        if (O != "" && ab[2] == O) {
                            favcity = ab;
                            w.unshift(ab);
                            if (Y > 6) {
                                w.push(ab)
                            }
                        } else {
                            w.push(ab)
                        }
                    }
                }
                f = c[0].concat(c[1]).concat(c[2]).concat(c[3]).concat(c[4]);
                e = c[5].concat(c[6]).concat(c[7]).concat(c[8]).concat(c[9]);
                d = c[10].concat(c[11]).concat(c[12]).concat(c[13]).concat(c[14]);
                b = c[15].concat(c[16]).concat(c[17]).concat(c[18]).concat(c[19]);
                V = c[20].concat(c[21]).concat(c[22]).concat(c[23]).concat(c[24]).concat(c[25]);
                P[0] = [c[0], c[1], c[2], c[3], c[4]];
                P[1] = [c[5], c[6], c[7], c[8], c[9]];
                P[2] = [c[10], c[11], c[12], c[13], c[14]];
                P[3] = [c[15], c[16], c[17], c[18], c[19]];
                P[4] = [c[20], c[22], c[23], c[24], c[25]];
                for (var Y = 0; Y < w.length; Y++) {
                    w[Y].push(Y)
                }
            }
            if (typeof (favorite_names) != "undefined") {
                var W = favorite_names.split("@");
                for (var Y = 0; Y < W.length; Y++) {
                    var ab = W[Y];
                    if (ab.length > 0) {
                        ab = ab.split("|");
                        D.push(ab)
                    }
                }
                for (var Y = 0; Y < D.length; Y++) {
                    D[Y].push(Y)
                }
            }
            E = C.stationFor12306.filterCity("");
            C.stationFor12306.city_showlist(0);
            C.stationFor12306.showAllCity();
            a = false;
            C.stationFor12306.fixDivBugInIE6(C("#form_cities"));
            C.stationFor12306.fixDivBugInIE6(C("#form_cities2"));
            if (ac && ac.length > 0) {
                C.each(ac, function (k, i) {
                    C.stationFor12306.bindEvent(i)
                })
            }
            C("#form_cities").mousedown(function () {
                g = true
            }).mouseup(function () {
                g = false
            });
            C("#form_cities2").mousedown(function () {
                H = true
            }).mouseup(function () {
                H = false
            })
        }
    }
})(jQuery);
(function (a) {
    a.jsearch = function (c, b) {
        var d = this;
        d.$el = a(c);
        d.el = c;
        d.init = function () {
            d.options = a.extend({}, a.jsearch.defaultOptions, b);
            d.options.current_datas = d.options.datas;
            if (d.options.initFilters) {
                d.options.initFilters(d)
            }
            if (d.options.initExeCallBack) {
                d.options.callback(d.excFilter(false))
            }
        };
        d.addFieldAllFilter = function (j, l, m, i, g, e) {
            if ("undefined" == typeof (j) || "undefined" == typeof (m) || "undefined" == typeof (i)) {
                throw "参数错误"
            }
            if (g && "undefined" != typeof (g) && "function" != typeof (g)) {
                throw "参数错误"
            }
            if ("undefined" == typeof (l) || l == "" || l == null) {
                l = j
            }
            if ("undefined" == typeof (e)) {
                e = true
            }
            if (m && m.length == 0) {
                return
            }
            if (!d.options.filters) {
                d.options.filters = []
            }
            var n = d.options.filters.length;
            var h = -1;
            for (var f = 0; f < n; f++) {
                if (l == d.options.filters[f]["key"]) {
                    h = f;
                    d.options.filters[f]["values"] = m;
                    d.options.filters[f]["type"] = i;
                    if (g) {
                        d.options.filters[f]["callFilter"] = g
                    }
                    break
                }
            }
            if (h < 0 || n == 0) {
                if (g) {
                    d.options.filters.push({
                        name: j,
                        key: l,
                        values: m,
                        isCheck: true,
                        type: i,
                        callFilter: g
                    })
                } else {
                    d.options.filters.push({
                        name: j,
                        key: l,
                        values: m,
                        isCheck: true,
                        type: i
                    })
                }
            }
            if (e) {
                return d.excFilter()
            }
        };
        d.removeFieldAllFilter = function (h) {
            if (!d.options.filters || d.options.filters.length <= 0) {
                return d.options.current_datas
            }
            var i = d.options.current_datas;
            var g = d.options.filters.length;
            var f = -1;
            var j = [];
            for (var e = 0; e < g; e++) {
                if (h == d.options.filters[e]["key"]) {
                    f = e
                } else {
                    j.push(d.options.filters[e])
                }
            }
            d.options.filters = j;
            if (f >= 0) {
                i = d.excFilter()
            }
            return i
        };
        d.addFilter = function (m, o, n, e, l, i, f) {
            if ("undefined" == typeof (m) || "undefined" == typeof (n) || "undefined" == typeof (e) || "undefined" ==
                typeof (l)) {
                throw "参数错误"
            }
            if (i && "undefined" != typeof (i) && "function" != typeof (i)) {
                throw "参数错误"
            }
            if ("undefined" == typeof (o) || o == "" || o == null) {
                o = m
            }
            if ("undefined" == typeof (f)) {
                f = true
            }
            if (!d.options.filters) {
                d.options.filters = []
            }
            var p = d.options.filters.length;
            var j = -1;
            for (var h = 0; h < p; h++) {
                if (o == d.options.filters[h]["key"]) {
                    j = h;
                    if (e) {
                        var g = d.options.filters[h]["values"];
                        if (!g) {
                            g = []
                        }
                        g.push(n)
                    } else {
                        d.options.filters[h]["values"] = n
                    }
                    d.options.filters[h]["type"] = l;
                    if (i) {
                        d.options.filters[h]["callFilter"] = i
                    }
                    break
                }
            }
            if (p == 0 || j < 0) {
                if (e) {
                    var g = [n];
                    if (i) {
                        d.options.filters.push({
                            name: m,
                            key: o,
                            values: g,
                            isCheck: true,
                            type: l,
                            callFilter: i
                        })
                    } else {
                        d.options.filters.push({
                            name: m,
                            key: o,
                            values: g,
                            isCheck: true,
                            type: l
                        })
                    }
                } else {
                    if (i) {
                        d.options.filters.push({
                            name: m,
                            key: o,
                            values: n,
                            isCheck: false,
                            type: l,
                            callFilter: i
                        })
                    } else {
                        d.options.filters.push({
                            name: m,
                            key: o,
                            values: n,
                            isCheck: false,
                            type: l
                        })
                    }
                }
            }
            if (f) {
                return d.excFilter()
            }
        };
        d.removeFilter = function (n, m, e) {
            if (!d.options.filters) {
                return d.options.current_datas
            }
            var o = d.options.current_datas;
            var q = d.options.filters.length;
            var j = -1;
            var l = [];
            for (var g = 0; g < q; g++) {
                if (n == d.options.filters[g]["key"]) {
                    j = g;
                    if (e) {
                        var p = [];
                        var f = d.options.filters[g]["values"];
                        if (f) {
                            for (var h = 0; h < f.length; h++) {
                                if (m != f[h]) {
                                    p.push(f[h])
                                }
                            }
                            if (p.length > 0) {
                                d.options.filters[g]["values"] = p;
                                l.push(d.options.filters[g])
                            }
                        }
                    }
                } else {
                    l.push(d.options.filters[g])
                }
            }
            d.options.filters = l;
            if (j >= 0) {
                o = d.excFilter()
            }
            return o
        };
        d.equals = function (f, e) {
            if (equalsField) {
                return f[equalsField] == e[equalsField]
            }
            return false
        };
        d.excFilter = function (h) {
            if ("undefined" == typeof (h)) {
                h = true
            }
            var i = new Date().getTime();
            var e = [];
            var g = d.options.datas.length;
            for (var f = 0; f < g; f++) {
                if (d.needNotFilter(d.options.datas[f])) {
                    e.push(d.options.datas[f])
                }
            }
            debug("计算耗时:" + (new Date().getTime() - i) + "毫秒");
            i = new Date().getTime();
            d.options.current_datas = e;
            if (h) {
                d.options.callback(d.options.current_datas)
            }
            debug("渲染耗时:" + (new Date().getTime() - i) + "毫秒");
            return d.options.current_datas
        };
        d.needNotFilter = function (p) {
            if (d.options.filters) {
                var y = d.options.filters;
                var j = y.length;
                if (j == 0) {
                    return true
                }
                for (var t = 0; t < j; t++) {
                    var x = y[t];
                    var s = x.name;
                    var w = x.type;
                    var q = x.callFilter;
                    if (!q) {
                        if (x.isCheck) {
                            var h = x.values;
                            var r = h.length;
                            if (r == 0) {
                                return true
                            }
                            var m = false;
                            var n = p[s];
                            if (w == "trainType") {
                                var z = n.charAt(0);
                                for (var v = 0; v < r; v++) {
                                    if ("QT" == h[v]) {
                                        if (z != "G" && z != "C" && z != "D" && z != "Z" && z != "T" && z != "K") {
                                            m = true;
                                            break
                                        }
                                    } else {
                                        if (z == "C" && h[v] == "G") {
                                            m = true;
                                            break
                                        } else {
                                            if (z == h[v]) {
                                                m = true;
                                                break
                                            }
                                        }
                                    }
                                }
                                if (!m) {
                                    return false
                                }
                            } else {
                                if (w == "between") {
                                    for (var v = 0; v < r; v++) {
                                        var A = parseInt(n.replace(":", ""), 10);
                                        var f = parseInt(h[v].substring(0, 4), 10);
                                        var g = parseInt(h[v].substring(4, 8), 10);
                                        if (A >= f && A <= g) {
                                            m = true;
                                            break
                                        }
                                    }
                                    if (!m) {
                                        return false
                                    }
                                } else {
                                    if (w == "seatType") {
                                        for (var v = 0; v < r; v++) {
                                            var u = p[h[v].toLowerCase() + "_num"];
                                            if (u != "--" && u != "无") {
                                                m = true;
                                                break
                                            }
                                        }
                                        if (!m) {
                                            return false
                                        }
                                    } else {
                                        if (w == "stationStarting") {
                                            if (!((a("#sf").is(":checked") && a("#gl").is(":checked")) || (!a("#sf").is(
                                                    ":checked") && !a("#gl").is(":checked")))) {
                                                var u = p.start_station_name;
                                                if (a("#sf").is(":checked")) {
                                                    for (var v = 0; v < r; v++) {
                                                        if (h[v] == u) {
                                                            m = true;
                                                            break
                                                        }
                                                    }
                                                } else {
                                                    if (a("#gl").is(":checked")) {
                                                        var e = true;
                                                        for (var v = 0; v < r; v++) {
                                                            if (h[v] == u) {
                                                                e = false;
                                                                break
                                                            }
                                                        }
                                                        m = e
                                                    }
                                                }
                                            }
                                            if (!m) {
                                                return false
                                            }
                                        } else {
                                            for (var v = 0; v < r; v++) {
                                                if (h[v] == "" || h[v] == n) {
                                                    m = true;
                                                    break
                                                }
                                            }
                                            if (!m) {
                                                return false
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            var l = x.values;
                            if (w == "like") {
                                var n = p[s];
                                if (l == "" || n.indexOf(l) >= 0) {
                                    m = true;
                                    break
                                } else {
                                    return false
                                }
                            } else {
                                if (l != p[s]) {
                                    return false
                                }
                            }
                        }
                    } else {
                        var o = [];
                        if (x.isCheck) {
                            o = x.values
                        } else {
                            o.push(x.values)
                        }
                        return q(p, o)
                    }
                }
            }
            return true
        };
        d.removeSameElem = function () {
            for (var f = 0; f < d.options.current_datas.length; f++) {
                for (var e = f + 1; e < d.options.current_datas.length; e++) {
                    if (d.equals(d.options.current_datas[f], d.options.current_datas[e])) {
                        d.options.current_datas = removeElement(e, d.options.current_datas);
                        f = -1;
                        break
                    }
                }
            }
            return d.options.current_datas
        };
        d.descSort = function (g, e, f) {
            if ("undefined" == typeof (g)) {
                throw "参数错误"
            }
            if (!f && "function" != typeof (f)) {
                f = function (i, h) {
                    if (i[g] > h[g]) {
                        return -1
                    } else {
                        return 1
                    }
                }
            }
            d.options.current_datas.sort(f);
            if (e) {
                d.options.callback(d.options.current_datas)
            }
        };
        d.ascSort = function (g, e, f) {
            if ("undefined" == typeof (g)) {
                throw "参数错误"
            }
            if (!f && "function" != typeof (f)) {
                f = function (i, h) {
                    if (i[g] > h[g]) {
                        return 1
                    } else {
                        return -1
                    }
                }
            }
            d.options.current_datas.sort(f);
            if (e) {
                d.options.callback(d.options.current_datas)
            }
        };
        d.destroy = function () {
            if (d.options.datas) {
                d.options.datas.splice(0, 100000000)
            }
            if (d.options.current_datas) {
                d.options.current_datas.splice(0, 100000000)
            }
            if (d.options.filters) {
                d.options.filters.splice(0, 100000000)
            }
        };
        d.init();
        return d
    };
    a.jsearch.defaultOptions = {
        datas: [],
        equalsField: null,
        cacheField: null,
        initExeCallBack: false,
        initFilters: function () {},
        callback: function () {}
    };
    a.fn.jsearch = function () {
        var b = Array.prototype.slice.call(arguments);
        return (new a.jsearch(this, b[0]))
    }
})(jQuery);
var lcxxcx_messages = {
    to_station_request: "请输入目的地!",
    from_station_request: "请输入出发地!",
    jianma_hanzi: "简拼/全拼/汉字",
    trainDate_request: "请输入出发日期!",
    trainDate_error: "请输入合法的出发日期(1970-01-01)!",
    backTrainDate_request: "请输入返程日期!",
    backTrainDate_error: "请输入合法的返程日期(1970-01-01)!",
    error_date: "请输入合法的往返日期(返程日期不能小于出发日期)!"
};
(function (e) {
    var c;
    var g = false;
    var b = 1;
    var d = 20;
    var f = 0;
    var a = [];
    jQuery.extend({
        quick_time_search_init: function (q, k) {
            var p = e("#date_range>ul>li");
            var i;
            for (var j = 0; j < p.length; j++) {
                var m = fullDateArr[j];
                var l = new Date(Date.parse(m.replace(/-/g, "/")));
                var o = p.eq(j).find("span[class=hide]");
                var h = o.text().substring(0, 5) + e.quick_time_search_caculateWeekDay(l);
                o.text(h);
                i = p.eq(j).children("span:first-child").html();
                a.push(i);
                f++
            }
            e.quick_time_search_setShowSomeDay(q, p);
            e.quick_time_search_addListener(p, k)
        },
        quick_time_search_setShowSomeDay: function (n, p) {
            var j = true;
            if (!p) {
                p = e("#date_range>ul>li")
            }
            if ("undefined" != typeof (n) && n != null) {
                p.removeClass("sel");
                p.removeAttr("alt");
                for (var l = 0; l < p.length; l++) {
                    var h = e(p[l]).children("span:first-child");
                    var o = h.text();
                    if (n.substr(5) == o) {
                        c = o;
                        e(p[l]).addClass("sel");
                        e(p[l]).attr("alt", "show");
                        e(p[l]).children("span:first-child").removeClass();
                        e(p[l]).children("span:last-child").removeClass();
                        e(p[l]).children("span:first-child").addClass("hide");
                        j = false;
                        break
                    }
                }
            }
            if (!n || j) {
                e(p.eq(0)).addClass("sel");
                e(p.eq(0)).attr("alt", "show");
                e(p.eq(0)).children("span:first-child").removeClass();
                e(p.eq(0)).children("span:last-child").removeClass();
                e(p.eq(0)).children("span:first-child").addClass("hide");
                c = e("#date_range>ul>li:nth-child(1)").children("span:first-child").text()
            }
            e(p.eq(0)).children().addClass("first");
            e(p.eq(19)).addClass("end");
            for (var m = d + 1; m <= f; m++) {
                e("#date_range>ul>li:nth-child(" + m + ")").hide()
            }
        },
        quick_time_search_caculateWeekDay: function (j) {
            var m = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            var l = 0;
            for (var k = 0; k < m.length; k++) {
                if (j.toString().indexOf(m[k]) > -1) {
                    l = k + 1;
                    break
                }
            }
            var h = "";
            switch (l) {
                case 1:
                    h = " 周一";
                    break;
                case 2:
                    h = " 周二";
                    break;
                case 3:
                    h = " 周三";
                    break;
                case 4:
                    h = " 周四";
                    break;
                case 5:
                    h = " 周五";
                    break;
                case 6:
                    h = " 周六";
                    break;
                case 7:
                    h = " 周日";
                    break
            }
            return h
        },
        quick_time_search_addListener: function (i, h) {
            i.bind("mouseover", function () {
                i.removeClass("sel");
                i.removeAttr("alt");
                e(this).addClass("sel");
                e(this).attr("alt", "show");
                e(i.eq(d - 1)).addClass("end");
                e(this).children("span:first-child").removeClass();
                e(this).children("span:last-child").removeClass();
                e(i.eq(b - 1)).children().addClass("first");
                e(this).children("span:first-child").addClass("hide")
            }).bind("mouseout", function () {
                if (g) {
                    return
                }
                i.each(function (j) {
                    e(this).children("span:first").removeClass();
                    e(this).children("span:last").addClass("hide")
                });
                e(i.eq(b - 1)).children().addClass("first")
            }).bind("click", function () {
                var l = new Date();
                var n = e(this).children("span:first-child").text();
                var m = "";
                var o = Number(n.substring(0, 2));
                var k = new Date().getMonth();
                var j = l.getFullYear();
                if (k > o) {
                    j = j + 1
                }
                m = j + "-" + n;
                e("#train_start_date").val(m);
                trainDate = m;
                querydate = trainDate;
                i.removeClass("sel");
                i.removeAttr("alt");
                e(this).addClass("sel");
                e(this).attr("alt", "show");
                e(i.eq(19)).addClass("end");
                e(this).children("span:first-child").removeClass();
                e(this).children("span:last-child").removeClass();
                e(i.eq(0)).children().addClass("first");
                e(this).children("span:first-child").addClass("hide");
                c = e(this).children("span:first-child").text();
                h()
            });
            e("#date_range").bind("mouseleave", function () {
                for (var j = b - 1; j <= d - 1; j++) {
                    var k = e(i.eq(j)).children("span:first-child").text();
                    if (c == k) {
                        i.removeClass("sel");
                        i.removeAttr("alt");
                        e(i.eq(j)).addClass("sel");
                        e(i.eq(j)).attr("alt", "show");
                        e(i.eq(j)).children("span:first-child").removeClass();
                        e(i.eq(j)).children("span:last-child").removeClass();
                        e(i.eq(j)).children("span:first-child").addClass("hide");
                        e(i.eq(b - 1)).children().addClass("first");
                        e(i.eq(d - 1)).addClass("end");
                        break
                    }
                }
            })
        },
        quick_time_search_lock: function () {
            g = true
        },
        quick_time_search_unLock: function () {
            g = false
        },
        changeQueryDateForTimeBar: function () {
            var h = 1;
            var o;
            var s;
            var k;
            var n = true;
            var m = true;
            var q = true;
            var t;
            var j;
            var r = false;
            k = f;
            var p = jQuery.inArray(e("#train_start_date").val().substring(5, 10), a);
            if (p != "-1") {
                p = p + 1;
                if (p >= b && p <= d) {
                    n = false;
                    m = false;
                    q = false;
                    s = d + 1
                } else {
                    t = b;
                    j = d;
                    r = true;
                    b = p;
                    d = b + 19;
                    if (d > f) {
                        d = f;
                        b = d - 19;
                        o = b - 1;
                        m = false
                    } else {
                        o = b - 1;
                        s = d + 1;
                        if (o < h) {
                            n = false
                        }
                    }
                } if (n) {
                    for (var l = h; l <= o; l++) {
                        e("#date_range>ul>li:nth-child(" + l + ")").hide()
                    }
                }
                if (m) {
                    for (var l = s; l <= k; l++) {
                        e("#date_range>ul>li:nth-child(" + l + ")").hide()
                    }
                }
                if (q) {
                    for (var l = b; l <= d; l++) {
                        e("#date_range>ul>li:nth-child(" + l + ")").show()
                    }
                }
                e("#date_range>ul>li").removeClass("sel");
                if (r) {
                    e("#date_range>ul>li:nth-child(" + t + ")").children("span:first").removeClass();
                    e("#date_range>ul>li:nth-child(" + t + ")").children("span:last").removeClass();
                    e("#date_range>ul>li:nth-child(" + j + ")").removeClass();
                    e("#date_range>ul>li:nth-child(" + b + ")").children("span:first").addClass("first");
                    e("#date_range>ul>li:nth-child(" + b + ")").children("span:last").addClass("first");
                    e("#date_range>ul>li:nth-child(" + b + ")").children().addClass("first");
                    e("#date_range>ul>li:nth-child(" + d + ")").addClass("end")
                }
                e("#date_range>ul>li:nth-child(" + p + ")").addClass("sel");
                e("#date_range>ul>li:nth-child(" + p + ")").children("span:last-child").removeClass();
                e("#date_range>ul>li:nth-child(" + p + ")").children("span:first-child").addClass("hide");
                c = e("#date_range>ul>li:nth-child(" + p + ")").children("span:first-child").text()
            }
        }
    })
})(jQuery);
(function () {
    $.stopStation = function (a) {
        var b = this;
        b.init = function () {
            b.options = $.extend({}, $.stopStation.defaultOptions, a);
            if (null == b.options.url || null == b.options.getSearchDate) {
                throw "error options,url can not be null"
            }
            b.options.mouseOnPanel = 0;
            if (!$("#" + b.options.showDivId)[0]) {
                var d = [];
                var c = -1;
                d[++c] = '<div class="station" style="display:none;" id="' + b.options.showDivId + '"><b></b>';
                d[++c] = '<div class="station-info" id="' + b.options.showTitleId + '"></div>';
                d[++c] =
                    '<div class="station-hd"><span class="zx">站序</span><span class="zm">站名</span><span class="dzsj">到站时间</span>';
                d[++c] = '<span class="cfsj">出发时间</span><span class="tlsj">停留时间</span>';
                d[++c] = '<a id="_stopStation_close_id" class="close" title="关闭" href="javascript:" </a></div>';
                d[++c] = '<div class="station-bd"><table><tbody id="' + b.options.showTableId +
                    '"></tbody></table></div></div>';
                $(d.join("")).appendTo($("body:eq(0)"));
                $("#_stopStation_close_id").on("click", b.close)
            }
            $("#" + b.options.showDivId).css("z-index", "20001");
            if (b.options.mouseOutClose) {
                $("#" + b.options.showDivId).on("mouseenter", function (e) {
                    b.options.mouseOnPanel = 1
                }).on("mouseleave", function () {
                    b.options.mouseOnPanel = 0;
                    $("#" + b.options.showDivId).hide().appendTo($("body:eq(0)"));
                    $("#" + b.options.showTableId).html("")
                })
            }
        };
        b.close = function () {
            $("#" + $.stopStation.defaultOptions.showDivId).closest("tr").removeAttr("style");
            $("#" + $.stopStation.defaultOptions.showDivId).removeAttr("style");
            b.options.mouseOnPanel = 0;
            $("#" + $.stopStation.defaultOptions.showDivId).hide().appendTo($("body:eq(0)"));
            $("#" + $.stopStation.defaultOptions.showTableId).html("")
        };
        b.open = function (f, j, h, e, i, c) {
            $("#" + $.stopStation.defaultOptions.showDivId).attr("style", "z-index:20001");
            if (a.timer) {
                clearTimeout(a.timer)
            }
            var g = a.getSearchDate();
            if (i && "" != i && null != i) {
                var d = formatDate(i);
                if ("-" != d) {
                    g = formatDate(i)
                } else {
                    g = a.getSearchDate()
                }
            } else {
                g = a.getSearchDate()
            }
            $.ajax({
                url: a.url,
                type: "get",
                isTakeParam: false,
                beforeSend: function (k) {
                    k.setRequestHeader("If-Modified-Since", "0");
                    k.setRequestHeader("Cache-Control", "no-cache")
                },
                data: {
                    train_no: j,
                    from_station_telecode: h,
                    to_station_telecode: e,
                    depart_date: g
                },
                success: function (p) {
                    var t = p.data.data;
                    if (t && t.length > 0) {
                        var r = [];
                        var u = -1;
                        for (var q = 0; q < t.length; q++) {
                            var l = t[q];
                            if (q == 0) {
                                var n = null;
                                n = l.train_class_name;
                                var s = l.service_type;
                                if ("0" == s) {
                                    c = "无空调"
                                } else {
                                    c = "有空调"
                                } if (!n) {
                                    n = "  "
                                }
                                $("#" + $.stopStation.defaultOptions.showTitleId).html('<span class="item1">' + l.station_train_code +
                                    '次      </span><span class="item2">' + l.start_station_name + "<em>--></em>" + l.end_station_name +
                                    '</span><span class="item3">' + n + '</span><span class="item4">' + c + "</span>").find(
                                    "span").css("color", "#333")
                            }
                            var m = "";
                            if (!l.isEnabled) {
                                m = " style='color: #999;' "
                            }
                            r[++u] = '<tr><td width="50" class="tc" ' + m + ">" + l.station_no + "</td>";
                            r[++u] = '<td width="75" ' + m + ">" + l.station_name + "</td>";
                            r[++u] = '<td width="75" ' + m + ">" + l.arrive_time + "</td>";
                            r[++u] = '<td width="75" ' + m + ">" + l.start_time + "</td>";
                            r[++u] = "<td " + m + ">" + l.stopover_time + "</td></tr>"
                        }
                        $("#" + $.stopStation.defaultOptions.showTableId).html(r.join(""));
                        var o = $("#" + $.stopStation.defaultOptions.appendTo + f);
                        $("#" + $.stopStation.defaultOptions.showDivId).appendTo(o).show();
                        $(".ticket-info").filter("div").attr("style", "");
                        o[0].style["z-index"] = 19999;
                        if (!(navigator.appVersion.indexOf("MSIE 6") > -1)) {} else {}
                    }
                }
            })
        };
        b.init();
        myStopStation = b;
        return b
    };
    $.fn.stopStation = function () {
        return (new $.stopStation(Array.prototype.slice.call(arguments)[0]))
    };
    $.stopStation.defaultOptions = {
        url: null,
        mouseOutClose: false,
        showDivId: "train_div_",
        showTableId: "train_table_",
        showTitleId: "train_span_",
        appendTo: "train_num_",
        getSearchDate: null
    }
})();
var myStopStation = function () {};
var formatDate = function (b) {
    if (b && (b.length == 8)) {
        var c = b.substring(0, 4);
        var d = b.substring(4, 6);
        var a = b.substring(6, 8);
        return c + "-" + d + "-" + a
    } else {
        return "-"
    }
};
var frameComplete = false;
var iframeOnload = function () {
    frameComplete = true
};
(function () {
    var b;
    var j = null;
    var p = [];
    var f = [];
    var a = [];
    var l = null;
    var m = null;
    var c = null;
    var h = null;
    var o = true;
    var i = null;
    var e = false;
    var k = 5000;
    var n = "https://ad.12306.cn/res/0005.html";
    $(document).ready(function () {
        $.init_ul4li();
        $._init_el_style();
        var q = new g("right");
        q.init();
        d();
        $("#train_start_date").val(initTrainDate);
        $("#train_start_date").focus(function () {
            $("#train_start_date").jcalendar({
                isSingle: false,
                startDate: initTrainDate,
                endDate: initToDate,
                onpicked: function () {
                    $("#train_start_date").css("color", "#333");
                    if ($("#train_start_date").hasClass("error")) {
                        $("#train_start_date").removeClass("error")
                    }
                    $("#train_start_date").blur();
                    var s = other_buy_date.split("&");
                    var r = stu_buy_date.split("&");
                    if ($("#train_start_date").val() > s[1] && $("#train_start_date").val() < r[1]) {
                        $("#_a_search_btn1").removeAttr("href");
                        $("#_a_search_btn1").addClass("btn-disabled");
                        $("#_a_search_btn1").attr("title", "当前日期仅可查询学生票")
                    } else {
                        $("#_a_search_btn1").attr("href", "javascript:$._to_search('ADULT','1')");
                        $("#_a_search_btn1").removeClass("btn-disabled");
                        $("#_a_search_btn1").removeAttr("title")
                    }
                    $.changeQueryDateForTimeBar()
                }
            })
        });
        $("#_date_btn").click(function () {
            $("#train_start_date").focus()
        });
        $._init_show_more();
        $.stationFor12306.init(["fromStation", "toStation"], {
            _init_input: lcxxcx_messages.jianma_hanzi,
            _top_4_initInput: lcxxcx_messages.jianpin_hanzi,
            _selected_class: "color333",
            _unselected_class: "error"
        });
        $("#from_station_imageB").click(function () {
            if ($("#fromStationText").val() == lcxxcx_messages.jianma_hanzi || $("#fromStationText").val() ==
                lcxxcx_messages.jianpin_hanzi) {
                $("#fromStationText").val("")
            }
            $("#fromStationText").focus()
        });
        $("#to_station_imageB").click(function () {
            if ($("#toStationText").val() == lcxxcx_messages.jianma_hanzi || $("#toStationText").val() ==
                lcxxcx_messages.jianpin_hanzi) {
                $("#toStationText").val("")
            }
            $("#toStationText").focus()
        });
        myStopStation = $.stopStation({
            url: ctx + "czxx/queryByTrainNo",
            getSearchDate: function () {
                return l
            }
        });
        $.initChangeStation();
        $.init_filter_event();
        $._init_sort_event();
        $._init_other_sort_event();
        $._init_templat();
        $._init_cookies_req();
        $.quick_time_search_init(index_train_date, function () {
            $._to_search("ADULT", "1")
        });
        $("#float").headerFloat();
        $.changeQueryDateForTimeBar()
    });
    var g = function (x) {
        var y, u = {}, z, v = this,
            t = false,
            r, w, s = {
                x: 10,
                y: 66
            }, q = {
                x: 5,
                y: 1
            };
        this.move = function () {
            r = r + q.x;
            w = w + q.y;
            if (r < s.x) {
                r = s.x;
                q.x = -q.x
            } else {
                if (r > u.dx) {
                    r = u.dx;
                    q.x = -q.x
                }
            } if (w < s.y) {
                w = s.y;
                q.y = -q.y
            } else {
                if (w > u.dy) {
                    w = u.dy;
                    q.y = -q.y
                }
            }
            z.css(x, r + "px").css("top", w + "px")
        };
        this.init = function () {
            if (t) {
                return
            }
            t = true;
            z = $(g.htmlTemplate);
            $(window).on("resize", v.resize);
            z.css(x, s.x + "px").css({
                top: s.y + "px"
            }).on("mouseenter", v.stop).on("mouseleave", v.resize).children("a.close").on("click", v.hidden);
            $("body").append(z);
            r = s.x;
            w = s.y;
            v.resize()
        };
        this.destory = function () {
            z.remove()
        };
        this.resize = function () {
            u.dx = ($(window).width() - $(".content").width()) / 2 - z.width();
            u.dy = ($(window).height()) - z.height();
            if (u.dx <= (s.x + Math.abs(q.x)) || u.dy <= (s.y + Math.abs(q.y))) {
                v.stop()
            } else {
                v.alive()
            }
        };
        this.show = function () {
            z.show();
            v.alive()
        };
        this.hidden = function () {
            v.stop();
            z.hide()
        };
        this.stop = function () {
            clearInterval(y)
        };
        this.alive = function () {
            v.stop();
            y = setInterval(v.move, 200)
        }
    };
    g.htmlTemplate =
        '<div id="myfix_yh" class="fix-yh" style="overflow: hidden;"><iframe onload="iframeOnload()" id="ad_frame_query" style="border:0;width:110%;height:110%;" src="' +
        n + '"></iframe></div>';

    function d() {
        setTimeout(function () {
            if (!frameComplete) {
                var r = $("#ad_frame_query");
                var q = r.get(0);
                var s = ctx + "resources/images/bg11.png";
                r.remove();
                $("#myfix_yh").css("background", "url(" + s + ") no-repeat");
                $("#myfix_yh").html('<a href="javascript:void(0);" class="close" title="关闭">关闭</a>');
                $("#myfix_yh").children("a.close").on("click", function () {
                    $(this).parent().hide()
                })
            }
        }, k)
    }
    jQuery.extend({
        _checkAll: function (s, u) {
            var r = $("input[name='" + s + "']");
            var t = $("input[name='" + s + "']:checked");
            if (r && t && t.length == r.length) {
                r.removeAttr("checked");
                $(u).removeClass("btn-all-sel");
                if (j) {
                    if ("cc_start_time" == s) {
                        j.removeFieldAllFilter("start_time")
                    } else {
                        if ("cc_arrive_time" == s) {
                            j.removeFieldAllFilter("arrive_time")
                        } else {
                            if ("stationStarting" == s) {
                                j.removeFieldAllFilter("_stationStarting")
                            } else {
                                j.removeFieldAllFilter(s)
                            }
                        }
                    }
                }
            } else {
                var q = [];
                $(u).removeClass("btn-all-sel");
                $.each(r, function (w, v) {
                    r[w]["checked"] = "checked";
                    q.push($(r[w]).val())
                });
                if (j) {
                    if ("station_train_code" == s) {
                        j.addFieldAllFilter("station_train_code", null, q, "trainType")
                    } else {
                        if ("cc_start_time" == s) {
                            j.addFieldAllFilter("start_time", null, q, "between")
                        } else {
                            if ("from_station_name" == s) {
                                j.addFieldAllFilter("from_station_name", null, q, "")
                            } else {
                                if ("to_station_name" == s) {
                                    j.addFieldAllFilter("to_station_name", null, q, "")
                                } else {
                                    if ("cc_arrive_time" == s) {
                                        j.addFieldAllFilter("arrive_time", null, q, "between")
                                    } else {
                                        if ("cc_seat_type" == s) {
                                            j.addFieldAllFilter("cc_seat_type", null, q, "seatType")
                                        } else {
                                            if ("stationStarting" == s) {
                                                j.removeFieldAllFilter("_stationStarting")
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        init_ul4li: function () {
            var q = [];
            var r = 0;
            q[r++] =
                '<li><input name="station_train_code" value="G" type="checkbox" class="check" /><label for="">GC-高铁/城际</label></li>';
            q[r++] =
                '<li><input name="station_train_code" value="D" type="checkbox" class="check" /><label for="">D-动车</label></li>';
            q[r++] =
                '<li><input name="station_train_code" value="Z" type="checkbox" class="check" /><label for="">Z-直达</label></li>';
            q[r++] =
                '<li><input name="station_train_code" value="T" type="checkbox" class="check" /><label for="">T-特快</label></li>';
            q[r++] =
                '<li><input name="station_train_code" value="K" type="checkbox" class="check" /><label for="">K-快速</label></li>';
            q[r++] =
                '<li><input name="station_train_code" value="QT" type="checkbox" class="check" /><label for="">其他</label></li>';
            $("#_ul_station_train_code").html(q.join(""));
            q = [];
            r = 0;
            q[r++] =
                '<li><input value="00000600" name="cc_start_time" type="checkbox" class="check" /><label for="">凌晨(0-6点)</label></li>';
            q[r++] =
                '<li><input value="06001200" name="cc_start_time" type="checkbox" class="check" /><label for="">上午(6-12点)</label></li>';
            q[r++] =
                '<li><input value="12001800" name="cc_start_time" type="checkbox" class="check" /><label for="">下午(12-18点)</label></li>';
            q[r++] =
                '<li><input value="18002400" name="cc_start_time" type="checkbox" class="check" /><label for="">晚上(18-24点)</label></li>';
            $("#_ul_cc_start_time").html(q.join(""));
            q = [];
            r = 0;
            q[r++] =
                '<li><input value="00000600" name="cc_arrive_time" type="checkbox" class="check" /><label for="">凌晨(0-6点)</label></li>';
            q[r++] =
                '<li><input value="06001200" name="cc_arrive_time" type="checkbox" class="check" /><label for="">上午(6-12点)</label></li>';
            q[r++] =
                '<li><input value="12001800" name="cc_arrive_time" type="checkbox" class="check" /><label for="">下午(12-18点)</label></li>';
            q[r++] =
                '<li><input value="18002400" name="cc_arrive_time" type="checkbox" class="check" /><label for="">晚上(18-24点)</label></li>';
            $("#_ul_cc_arrive_time").html(q.join(""));
            q = [];
            r = 0;
            q[r++] =
                '<li><input name="stationStarting" id="sf" type="checkbox" class="check" /><label for="sf">始发</label></li>';
            q[r++] =
                '<li><input name="stationStarting" id="gl" type="checkbox" class="check" /><label for="gl">过路</label></li>';
            $("#_ul_sf_gl").html(q.join(""));
            $("#startendtime").html(
                '<span class="b3" id="_span_starttime">出发时间</span><br /><span class="b2" id="_span_endtime">到达时间</span>');
            $("#floatstartendtime").html(
                '<span class="b3" id="other_span_starttime">出发时间</span><br /><span class="b2" id="other_span_endtime">到达时间</span>')
        },
        _init_el_style: function () {
            $("#img_rand_code").css("cursor", "pointer");
            $("#from_station_imageB").css("cursor", "pointer");
            $("#to_station_imageB").css("cursor", "pointer");
            $("#_date_btn").css("cursor", "pointer");
            $("#sear-sel-bd .btn-all").css("cursor", "pointer");
            initPageTitle(2)
        },
        initChangeStation: function () {
            $("#change_station").click(function () {
                var v = $("#fromStationText");
                var t = v.val();
                var q = $("#toStationText");
                var u = q.val();
                var s = $("#toStation").val();
                var r = $("#fromStation").val();
                v.val(u);
                q.val(t);
                if (u != "" && u != lcxxcx_messages.jianma_hanzi && u != lcxxcx_messages.jianpin_hanzi) {
                    v.addClass("color333")
                } else {
                    v.removeClass("color333")
                } if (t != "" && t != lcxxcx_messages.jianma_hanzi && t != lcxxcx_messages.jianpin_hanzi) {
                    q.addClass("color333")
                } else {
                    q.removeClass("color333")
                }
                $("#fromStation").val(s);
                $("#toStation").val(r)
            })
        },
        _init_cookies_req: function () {
            var s = $.jc_getFromStation();
            if (s) {
                var r = s.split(",");
                if (r && r.length == 2) {
                    $("#fromStationText").val(r[0]);
                    $("#fromStation").val(r[1])
                }
            }
            var t = $.jc_getToStation();
            if (s) {
                var r = t.split(",");
                if (r && r.length == 2) {
                    $("#toStationText").val(r[0]);
                    $("#toStation").val(r[1])
                }
            }
            var q = $.jc_getFromDate();
            if (q) {
                if (q >= initTrainDate && q <= initToDate) {
                    index_train_date = q;
                    $("#train_start_date").val(q)
                }
            }
        },
        _reset_cookies_values: function () {
            $.jc_setFromStation($("#fromStationText").val(), $("#fromStation").val());
            $.jc_setToStation($("#toStationText").val(), $("#toStation").val());
            $.jc_setFromDate($("#train_start_date").val());
            $.jc_setWfOrDc("dc")
        },
        _init_templat: function () {
            var q = $("#queryTemplate").html().replace("<!--", "").replace("-->", "");
            $.templates({
                leftTableTemplate: q
            })
        },
        init_filter_event: function () {
            $("#sear-sel-bd input[name='station_train_code']").on("click", function () {
                if ($(this).is(":checked")) {
                    var q = $("input[name='station_train_code']");
                    var r = $("input[name='station_train_code']:checked");
                    if (q && r && r.length == q.length) {
                        $("#span_station_train_code").removeClass("btn-all-sel")
                    } else {
                        $("#span_station_train_code").addClass("btn-all-sel")
                    } if (j) {
                        j.addFilter("station_train_code", null, $(this).val(), true, "trainType")
                    }
                } else {
                    if (j) {
                        j.removeFilter("station_train_code", $(this).val(), true)
                    }
                    if ($("input[name='station_train_code']:checked").length <= 0) {
                        $("#span_station_train_code").removeClass("btn-all-sel")
                    } else {
                        $("#span_station_train_code").addClass("btn-all-sel")
                    }
                }
            }).css("cursor", "pointer");
            $("#sear-sel-bd input[name='cc_start_time']").on("click", function () {
                if ($(this).is(":checked")) {
                    var q = $("input[name='cc_start_time']");
                    var r = $("input[name='cc_start_time']:checked");
                    if (q && r && r.length == q.length) {
                        $("#span_cc_start_time").removeClass("btn-all-sel")
                    } else {
                        $("#span_cc_start_time").addClass("btn-all-sel")
                    } if (j) {
                        j.addFilter("start_time", null, $(this).val(), true, "between")
                    }
                } else {
                    if (j) {
                        j.removeFilter("start_time", $(this).val(), true)
                    }
                    if ($("input[name='cc_start_time']:checked").length <= 0) {
                        $("#span_cc_start_time").removeClass("btn-all-sel")
                    } else {
                        $("#span_cc_start_time").addClass("btn-all-sel")
                    }
                }
            }).css("cursor", "pointer");
            $("#sear-sel-bd input[name='cc_arrive_time']").on("click", function () {
                if ($(this).is(":checked")) {
                    var q = $("input[name='cc_arrive_time']");
                    var r = $("input[name='cc_arrive_time']:checked");
                    if (q && r && r.length == q.length) {
                        $("#span_cc_arrive_time").removeClass("btn-all-sel")
                    } else {
                        $("#span_cc_arrive_time").addClass("btn-all-sel")
                    } if (j) {
                        j.addFilter("arrive_time", null, $(this).val(), true, "between")
                    }
                } else {
                    if (j) {
                        j.removeFilter("arrive_time", $(this).val(), true)
                    }
                    if ($("input[name='cc_arrive_time']:checked").length <= 0) {
                        $("#span_cc_arrive_time").removeClass("btn-all-sel")
                    } else {
                        $("#span_cc_arrive_time").addClass("btn-all-sel")
                    }
                }
            }).css("cursor", "pointer");
            $("#sear-sel-bd input[name='stationStarting']").on("click", function () {
                if ($("#sf").is(":checked") && $("#gl").is(":checked")) {
                    $("#span_sf_gl").removeClass("btn-all-sel")
                } else {
                    if ($("#sf").is(":checked") || $("#gl").is(":checked")) {
                        $("#span_sf_gl").addClass("btn-all-sel")
                    } else {
                        $("#span_sf_gl").removeClass("btn-all-sel")
                    }
                } if ($("#sf").is(":checked") || $("#gl").is(":checked")) {
                    if (j) {
                        j.addFieldAllFilter("stationStarting", "_stationStarting", p, "stationStarting")
                    }
                } else {
                    if (j) {
                        j.removeFieldAllFilter("_stationStarting")
                    }
                }
            }).css("cursor", "pointer")
        },
        _init_other_sort_event: function () {
            $("#other_span_starttime").on("click", function () {
                $("#_span_starttime").trigger("click")
            }).css("cursor", "pointer");
            $("#other_span_endtime").on("click", function () {
                $("#_span_endtime").trigger("click")
            }).css("cursor", "pointer");
            $("#other_span_lishi").on("click", function () {
                $("#_span_lishi").trigger("click")
            }).css("cursor", "pointer")
        },
        _init_sort_event: function () {
            $("#_span_starttime").on("click", function () {
                $("#_span_endtime").attr("class", "b2");
                $("#_span_lishi").attr("class", "b2");
                $("#other_span_endtime").attr("class", "b2");
                $("#other_span_lishi").attr("class", "b2");
                if ($(this).attr("class") == "b2" || $(this).attr("class") == "b3") {
                    $(this).attr("class", "b4");
                    $("#other_span_starttime").attr("class", "b4");
                    if (j) {
                        j.descSort("start_time", true, function (t, s) {
                            var r = Number(t.start_time.replace(":", ""));
                            var q = Number(s.start_time.replace(":", ""));
                            if (r > q) {
                                return -1
                            } else {
                                return 1
                            }
                        })
                    }
                } else {
                    $(this).attr("class", "b3");
                    $("#other_span_starttime").attr("class", "b3");
                    if (j) {
                        j.ascSort("start_time", true, function (t, s) {
                            var r = Number(t.start_time.replace(":", ""));
                            var q = Number(s.start_time.replace(":", ""));
                            if (r > q) {
                                return 1
                            } else {
                                return -1
                            }
                        })
                    }
                }
            }).css("cursor", "pointer");
            $("#_span_endtime").on("click", function () {
                $("#_span_starttime").attr("class", "b2");
                $("#_span_lishi").attr("class", "b2");
                $("#other_span_starttime").attr("class", "b2");
                $("#other_span_lishi").attr("class", "b2");
                if ($(this).attr("class") == "b2" || $(this).attr("class") == "b3") {
                    $(this).attr("class", "b4");
                    $("#other_span_endtime").attr("class", "b4");
                    if (j) {
                        j.descSort("arrive_time", true, function (t, s) {
                            var r = Number(t.arrive_time.replace(":", ""));
                            var q = Number(s.arrive_time.replace(":", ""));
                            if (r > q) {
                                return -1
                            } else {
                                return 1
                            }
                        })
                    }
                } else {
                    $(this).attr("class", "b3");
                    $("#other_span_endtime").attr("class", "b3");
                    if (j) {
                        j.ascSort("arrive_time", true, function (t, s) {
                            var r = Number(t.arrive_time.replace(":", ""));
                            var q = Number(s.arrive_time.replace(":", ""));
                            if (r > q) {
                                return 1
                            } else {
                                return -1
                            }
                        })
                    }
                }
            }).css("cursor", "pointer");
            $("#_span_lishi").on("click", function () {
                $("#_span_starttime").attr("class", "b2");
                $("#_span_endtime").attr("class", "b2");
                $("#other_span_starttime").attr("class", "b2");
                $("#other_span_endtime").attr("class", "b2");
                if ($(this).attr("class") == "b2" || $(this).attr("class") == "b3") {
                    $(this).attr("class", "b4");
                    $("#other_span_lishi").attr("class", "b4");
                    if (j) {
                        j.descSort("lishiValue", true, function (t, s) {
                            var r = Number(t.lishiValue);
                            var q = Number(s.lishiValue);
                            if (r > q) {
                                return -1
                            } else {
                                return 1
                            }
                        })
                    }
                } else {
                    $(this).attr("class", "b3");
                    $("#other_span_lishi").attr("class", "b3");
                    if (j) {
                        j.ascSort("lishiValue", true, function (t, s) {
                            var r = Number(t.lishiValue);
                            var q = Number(s.lishiValue);
                            if (r > q) {
                                return 1
                            } else {
                                return -1
                            }
                        })
                    }
                }
            }).css("cursor", "pointer")
        },
        _init_checked_data: function (q) {
            if ($("#_span_starttime").attr("class") == "b3" || $("#_span_starttime").attr("class") == "b4") {
                $("#_span_endtime").attr("class", "b2");
                $("#_span_lishi").attr("class", "b2");
                if ($("#_span_starttime").attr("class") == "b4") {
                    q.sort(function (u, t) {
                        var s = Number(u.start_time.replace(":", ""));
                        var r = Number(t.start_time.replace(":", ""));
                        if (s > r) {
                            return -1
                        } else {
                            return 1
                        }
                    })
                } else {
                    q.sort(function (u, t) {
                        var s = Number(u.start_time.replace(":", ""));
                        var r = Number(t.start_time.replace(":", ""));
                        if (s > r) {
                            return 1
                        } else {
                            return -1
                        }
                    })
                }
            } else {
                if ($("#_span_endtime").attr("class") == "b3" || $("#_span_endtime").attr("class") == "b4") {
                    $("#_span_starttime").attr("class", "b2");
                    $("#_span_lishi").attr("class", "b2");
                    if ($("#_span_endtime").attr("class") == "b4") {
                        q.sort(function (u, t) {
                            var s = Number(u.arrive_time.replace(":", ""));
                            var r = Number(t.arrive_time.replace(":", ""));
                            if (s > r) {
                                return -1
                            } else {
                                return 1
                            }
                        })
                    } else {
                        q.sort(function (u, t) {
                            var s = Number(u.arrive_time.replace(":", ""));
                            var r = Number(t.arrive_time.replace(":", ""));
                            if (s > r) {
                                return 1
                            } else {
                                return -1
                            }
                        })
                    }
                } else {
                    if ($("#_span_lishi").attr("class") == "b3" || $("#_span_lishi").attr("class") == "b4") {
                        $("#_span_starttime").attr("class", "b2");
                        $("#_span_endtime").attr("class", "b2");
                        if ($("#_span_lishi").attr("class") == "b4") {
                            q.sort(function (u, t) {
                                var s = Number(u.lishiValue);
                                var r = Number(t.lishiValue);
                                if (s > r) {
                                    return -1
                                } else {
                                    return 1
                                }
                            })
                        } else {
                            q.sort(function (u, t) {
                                var s = Number(u.lishiValue);
                                var r = Number(t.lishiValue);
                                if (s > r) {
                                    return 1
                                } else {
                                    return -1
                                }
                            })
                        }
                    }
                }
            }
            return q
        },
        _init_show_more: function () {
            $("#show_more").click(function () {
                if ($("#sear-sel-bd").height() == 44) {
                    var q = 0;
                    if (p && p.length > 7 && p.length <= 14) {
                        q = 1 + q
                    } else {
                        if (p && p.length > 14 && p.length <= 21) {
                            q = 2 + q
                        } else {
                            if (p.length > 21) {
                                q = 3 + q
                            }
                        }
                    } if (f && f.length > 7 && f.length <= 14) {
                        q = 1 + q
                    } else {
                        if (f && f.length > 14 && f.length <= 21) {
                            q = 2 + q
                        } else {
                            if (f && f.length > 21) {
                                q = 3 + q
                            }
                        }
                    } if (a && a.length > 7) {
                        q = 1 + q
                    }
                    var r = (154 + q * 22) + "px";
                    document.getElementById("sear-sel-bd").style.height = r;
                    $("#show_more").addClass("open");
                    $("#show_more").attr("title", "收缩")
                } else {
                    document.getElementById("sear-sel-bd").style.height = "44px";
                    $("#show_more").removeClass("open");
                    $("#show_more").attr("title", "展开")
                }
            })
        },
        _re_init_show_more: function () {
            if ($("#sear-sel-bd").height() != 44) {
                var q = 0;
                if (p && p.length > 7 && p.length <= 14) {
                    q = 1 + q
                } else {
                    if (p && p.length > 14 && p.length <= 21) {
                        q = 2 + q
                    } else {
                        if (p.length > 21) {
                            q = 3 + q
                        }
                    }
                } if (f && f.length > 7 && f.length <= 14) {
                    q = 1 + q
                } else {
                    if (f && f.length > 14 && f.length <= 21) {
                        q = 2 + q
                    } else {
                        if (f && f.length > 21) {
                            q = 3 + q
                        }
                    }
                } if (a && a.length > 7) {
                    q = 1 + q
                }
                var r = (154 + q * 22) + "px";
                document.getElementById("sear-sel-bd").style.height = r;
                $("#show_more").attr("title", "收缩")
            }
        },
        _to_search: function (r, q) {
            if (!o) {
                return
            }
            if ("" == $("#train_start_date").val()) {
                $("#train_start_date").addClass("error");
                return
            }
            if ("ADULT" == r) {
                var s = other_buy_date.split("&");
                if ($("#train_start_date").val() < s[0] || $("#train_start_date").val() > s[1]) {
                    $.alertError("出发日期不在预售期内！<br>" + s[0] + "到" + s[1], $("#train_start_date"));
                    return
                }
            } else {
                if ("0X00" == r) {
                    var s = stu_buy_date.split("&");
                    if ($("#train_start_date").val() < s[0] || $("#train_start_date").val() > s[1]) {
                        $.alertError("出发日期不在预售期内！<br>" + s[0] + "到" + s[1], $("#train_start_date"));
                        return
                    }
                } else {
                    if ($("#train_start_date").val() < initTrainDate || $("#train_start_date").val() > initToDate) {
                        $.alertError("出发日期不在预售期内！<br>" + initTrainDate + "到" + initToDate, $("#train_start_date"));
                        return
                    }
                }
            } if ("" == $("#fromStationText").val() || lcxxcx_messages.jianma_hanzi == $("#fromStationText").val() ||
                lcxxcx_messages.jianpin_hanzi == $("#fromStationText").val()) {
                $("#fromStationText").addClass("error");
                return
            }
            if ("" == $("#toStationText").val() || lcxxcx_messages.jianma_hanzi == $("#toStationText").val() ||
                lcxxcx_messages.jianpin_hanzi == $("#toStationText").val()) {
                $("#toStationText").addClass("error");
                return
            }
            $.execute_search(r, q)
        },
        execute_search: function (r, q) {
            $.quick_time_search_lock();
            $.quick_time_search_setShowSomeDay($("#train_start_date").val());
            $._reset_cookies_values();
            $._lock_btn(q);
            myStopStation.close();
            var s = dhtmlx.modalbox({
                targSrc: '<div><img src="' + ctx + 'resources/images/loading.gif"></img></div>'
            });
            $.ajax({
                url: ctx + "lcxxcx/query",
                type: "get",
                beforeSend: function (t) {
                    t.setRequestHeader("If-Modified-Since", "0");
                    t.setRequestHeader("Cache-Control", "no-cache")
                },
                data: {
                    purpose_codes: r,
                    queryDate: $("#train_start_date").val(),
                    from_station: $("#fromStation").val(),
                    to_station: $("#toStation").val()
                },
                success: function (t) {
                    dhtmlx.modalbox.hide(s);
                    c = $("#fromStationText").val();
                    h = $("#toStationText").val();
                    if (t.data.flag) {
                        var v = t.data.datas;
                        l = $("#train_start_date").val();
                        m = t.data.searchDate;
                        j = $("#_query_table_datas").jsearch({
                            datas: v,
                            equalsField: "station_train_code",
                            initExeCallBack: true,
                            initFilters: function (w) {
                                $._initFilter(w)
                            },
                            callback: function (w) {
                                $("#_query_table_datas").html($.render.leftTableTemplate($._init_checked_data(w)));
                                $._init_search_result(w.length);
                                $(".lookup").css("cursor", "pointer").attr("title", "查看票价");
                                $(".lookup b").css("cursor", "pointer")
                            }
                        });
                        $.initTrainOption(v);
                        $._re_init_show_more();
                        $("#_query_table_datas").show();
                        clickCheckBoxName()
                    } else {
                        var u = t.data.message;
                        if (!u) {
                            u = "查询失败！"
                        }
                        $.alertError(u, null, function () {})
                    }
                },
                error: function () {
                    dhtmlx.modalbox.hide(s)
                }
            })
        },
        _initRadioFilterDatas: function (s) {
            var r = $("input[name='" + s + "']:checked");
            var q = [];
            if (r.length > 0) {
                $.each(r, function (u, t) {
                    q.push($(r[u]).val())
                })
            }
            return q
        },
        _initFilter: function (q) {
            q.addFieldAllFilter("station_train_code", null, $._initRadioFilterDatas("station_train_code"), "trainType",
                null, false);
            q.addFieldAllFilter("start_time", null, $._initRadioFilterDatas("start_time"), "between", null, false);
            q.addFieldAllFilter("arrive_time", null, $._initRadioFilterDatas("arrive_time"), "between", null, false);
            q.removeFieldAllFilter("_stationStarting");
            $("#span_sf_gl").removeClass("btn-all-sel");
            var r = $("input[name='stationStarting']");
            if (r.is(":checked")) {
                r.removeAttr("checked")
            }
            q.removeFieldAllFilter("from_station_name");
            q.removeFieldAllFilter("to_station_name");
            q.removeFieldAllFilter("cc_seat_type")
        },
        search_fail: function () {
            $("#_query_table_datas").html("");
            $("#_sear_tips").html("").hide();
            $.initTrainOption([]);
            $._re_init_show_more()
        },
        alertError: function (s, q, r) {
            e = true;
            dhtmlx.alert({
                title: messages["message.error"],
                ok: messages["button.ok"],
                text: s,
                type: "alert-error",
                callback: function () {
                    if (q) {
                        if (q.val() == lcxxcx_messages.jianma_hanzi || q.val() == lcxxcx_messages.jianpin_hanzi) {
                            q.val("")
                        }
                        q.focus()
                    }
                    if ("function" == typeof (r)) {
                        r()
                    }
                    window.setTimeout(function () {
                        e = false
                    }, (o ? 500 : 5000))
                }
            })
        },
        initTrainOption: function (y) {
            dhtmlXCombo_defaultOption.prototype._DrawHeaderButton = function () {};
            $("#train_combo_box").hide();
            var B = [];
            var z = [];
            var A = [];
            var q = [];
            if (!b) {
                b = new dhtmlXCombo("train_combo_box_div", "cc", 90)
            } else {
                b.setComboText("")
            }
            b.clearAll();
            $(y).each(function () {
                B.push([this.station_train_code, this.station_train_code]);
                z.push(this.from_station_name);
                A.push(this.to_station_name);
                if (this.swz_num != "" && this.swz_num != "--" && this.swz_num != "无") {
                    q.push({
                        name: "商务座",
                        value: "SWZ",
                        index: 1
                    })
                }
                if (this.tz_num != "" && this.tz_num != "--" && this.tz_num != "无") {
                    q.push({
                        name: "特等座",
                        value: "TZ",
                        index: 2
                    })
                }
                if (this.zy_num != "" && this.zy_num != "--" && this.zy_num != "无") {
                    q.push({
                        name: "一等座",
                        value: "ZY",
                        index: 3
                    })
                }
                if (this.ze_num != "" && this.ze_num != "--" && this.ze_num != "无") {
                    q.push({
                        name: "二等座",
                        value: "ZE",
                        index: 4
                    })
                }
                if (this.gr_num != "" && this.gr_num != "--" && this.gr_num != "无") {
                    q.push({
                        name: "高级软卧",
                        value: "GR",
                        index: 5
                    })
                }
                if (this.rw_num != "" && this.rw_num != "--" && this.rw_num != "无") {
                    q.push({
                        name: "软卧",
                        value: "RW",
                        index: 6
                    })
                }
                if (this.yw_num != "" && this.yw_num != "--" && this.yw_num != "无") {
                    q.push({
                        name: "硬卧",
                        value: "YW",
                        index: 7
                    })
                }
                if (this.rz_num != "" && this.rz_num != "--" && this.rz_num != "无") {
                    q.push({
                        name: "软座",
                        value: "RZ",
                        index: 8
                    })
                }
                if (this.yz_num != "" && this.yz_num != "--" && this.yz_num != "无") {
                    q.push({
                        name: "硬座",
                        value: "YZ",
                        index: 9
                    })
                }
            });
            b.addOption($.removeSameElem(B));
            b.enableFilteringMode(true);
            b.attachEvent("onBlur", function () {
                if (b.getComboText() != "") {
                    if (j) {
                        j.addFilter("station_train_code", "combo_station_train_code", b.getComboText(), false, "")
                    }
                } else {
                    if (j) {
                        j.removeFilter("combo_station_train_code", b.getComboText(), false)
                    }
                }
            });
            b.attachEvent("onChange", function () {
                if (b.getComboText() != "") {
                    if ($("#iLcear").is(":hidden")) {
                        $("#iLcear").show()
                    }
                    if (j) {
                        j.addFilter("station_train_code", "combo_station_train_code", b.getComboText(), false, "")
                    }
                } else {
                    if (j) {
                        j.removeFilter("combo_station_train_code", b.getComboText(), false)
                    }
                }
            });
            $(".dhx_combo_input").css("text-transform", "uppercase");
            var w = [];
            for (var t = 0; t < z.length; t++) {
                var s = z[t];
                var v = true;
                for (var r = 0; r < w.length; r++) {
                    if (s == w[r]) {
                        v = false;
                        break
                    }
                }
                if (v) {
                    w.push(s)
                }
            }
            var x = [];
            for (var t = 0; t < A.length; t++) {
                var s = A[t];
                var v = true;
                for (var r = 0; r < x.length; r++) {
                    if (s == x[r]) {
                        v = false;
                        break
                    }
                }
                if (v) {
                    x.push(s)
                }
            }
            var u = [];
            for (var t = 0; t < q.length; t++) {
                var s = q[t];
                var v = true;
                for (var r = 0; r < u.length; r++) {
                    if (s.name == u[r]["name"]) {
                        v = false;
                        break
                    }
                }
                if (v) {
                    u.push(s)
                }
            }
            a = u;
            p = w;
            f = x;
            $("#_ul_station").html("");
            $.each(w, function (D, C) {
                $("<li><input name='from_station_name' value=\"" + C +
                    "\" type='checkbox' class='check' /><label for=''>" + C + "</label></li>").appendTo($(
                    "#_ul_station"))
            });
            $("#_ul_arrive_station").html("");
            $.each(x, function (D, C) {
                $("<li><input name='to_station_name' value=\"" + C +
                    "\" type='checkbox' class='check' /><label for=''>" + C + "</label></li>").appendTo($(
                    "#_ul_arrive_station"))
            });
            $("#_ul_xibie").html("");
            a.sort(function (D, C) {
                if (D.index > C.index) {
                    return 1
                } else {
                    return -1
                }
            });
            $.each(a, function (D, C) {
                $("<li><input type='checkbox' class='check' value='" + C.value +
                    "' name='cc_seat_type'></input><label>" + C.name + "</label></li>").appendTo($("#_ul_xibie"))
            });
            $("input[name='from_station_name']").on("click", function () {
                if ($(this).is(":checked")) {
                    var C = $("input[name='from_station_name']");
                    var D = $("input[name='from_station_name']:checked");
                    if (C && D && D.length == C.length) {
                        $("#span_from_station_name").removeClass("btn-all-sel")
                    } else {
                        $("#span_from_station_name").addClass("btn-all-sel")
                    } if (j) {
                        j.addFilter("from_station_name", null, $(this).val(), true, "")
                    }
                } else {
                    if (j) {
                        j.removeFilter("from_station_name", $(this).val(), true)
                    }
                    if ($("input[name='from_station_name']:checked").length <= 0) {
                        $("#span_from_station_name").removeClass("btn-all-sel")
                    } else {
                        $("#span_from_station_name").addClass("btn-all-sel")
                    }
                }
            }).css("cursor", "pointer");
            $("#span_from_station_name").removeClass("btn-all-sel");
            $("#_ul_station").show();
            $("input[name='to_station_name']").on("click", function () {
                if ($(this).is(":checked")) {
                    var C = $("input[name='to_station_name']");
                    var D = $("input[name='to_station_name']:checked");
                    if (C && D && D.length == C.length) {
                        $("#span_to_station_name").removeClass("btn-all-sel")
                    } else {
                        $("#span_to_station_name").addClass("btn-all-sel")
                    } if (j) {
                        j.addFilter("to_station_name", null, $(this).val(), true, "")
                    }
                } else {
                    if (j) {
                        j.removeFilter("to_station_name", $(this).val(), true)
                    }
                    if ($("input[name='to_station_name']:checked").length <= 0) {
                        $("#span_to_station_name").removeClass("btn-all-sel")
                    } else {
                        $("#span_to_station_name").addClass("btn-all-sel")
                    }
                }
            }).css("cursor", "pointer");
            $("#span_to_station_name").removeClass("btn-all-sel");
            $("#_ul_arrive_station").show();
            $("input[name='cc_seat_type']").on("click", function () {
                if ($(this).is(":checked")) {
                    var C = $("input[name='cc_seat_type']");
                    var D = $("input[name='cc_seat_type']:checked");
                    if (C && D && D.length == C.length) {
                        $("#span_cc_seat_type").removeClass("btn-all-sel")
                    } else {
                        $("#span_cc_seat_type").addClass("btn-all-sel")
                    } if (j) {
                        j.addFilter("cc_seat_type", null, $(this).val(), true, "seatType")
                    }
                } else {
                    if (j) {
                        j.removeFilter("cc_seat_type", $(this).val(), true)
                    }
                    if ($("input[name='cc_seat_type']:checked").length <= 0) {
                        $("#span_cc_seat_type").removeClass("btn-all-sel")
                    } else {
                        $("#span_cc_seat_type").addClass("btn-all-sel")
                    }
                }
            }).css("cursor", "pointer");
            $("#span_cc_seat_type").removeClass("btn-all-sel");
            $("#_ul_xibie").show();
            $(".dhx_combo_input").on("click", function () {
                if ($(this).val() != "") {
                    $(this).select()
                }
            });
            if (!$("#iLcear")[0]) {
                $(".dhx_combo_box ").append($(
                    '<span style="display: none;" class="i-clear dhx_combo_img_iClear" id="iLcear"></span>'));
                $("#iLcear").on("click", function () {
                    if (b) {
                        b.setComboText("");
                        $(this).hide()
                    }
                })
            }
            $(".dhx_combo_input").on("keyup", function () {
                if ($(this).val() == "") {
                    $("#iLcear").hide()
                } else {
                    if ($("#iLcear").is(":hidden")) {
                        $("#iLcear").show()
                    }
                }
            })
        },
        trim: function (q) {
            return q.replace(/(^\s*)|(\s*$)/g, "")
        },
        _init_search_result: function (q) {
            $("#_sear_tips").html("<p><strong>" + c + " -> " + h + "（" + m + "）</strong>共计<strong>" + q +
                "</strong>个车次</p>");
            $("#_sear_tips").show()
        },
        removeSameElem: function (v) {
            var s = [];
            for (var t = 0; t < v.length; t++) {
                var u = v[t];
                var q = true;
                for (var r = 0; r < s.length; r++) {
                    if (u[0] == s[r][0]) {
                        q = false;
                        break
                    }
                }
                if (q) {
                    s.push(u)
                }
            }
            return s
        },
        showTicketPrice: function (q, w, B) {
            if ("1" == B || "2" == B) {
                return
            }
            var y = $("#ticket_" + q);
            var s = $("#price_" + q);
            var A = y.children("td").children("div").children("div").children("span");
            var u = y.find(".lookup");
            var C = A.attr("id");
            var r = C.split("_");
            var x = r[0];
            var z = r[1];
            var t = r[2];
            var D = r[3];
            var v = u.find("b");
            v.css("cursor", "pointer");
            u.css("cursor", "pointer");
            if (v.attr("class") == "open") {
                u.html("<b></b>");
                s.hide();
                u.attr("title", "查看票价")
            } else {
                $.ajax({
                    type: "get",
                    beforeSend: function (E) {
                        E.setRequestHeader("If-Modified-Since", "0");
                        E.setRequestHeader("Cache-Control", "no-cache")
                    },
                    url: ctx + "leftTicket/queryTicketPrice",
                    data: {
                        train_no: x,
                        from_station_no: z,
                        to_station_no: t,
                        seat_types: D,
                        train_date: l
                    },
                    success: function (E) {
                        if (E.status) {
                            u.html("<b class='open'></b>");
                            u.attr("title", "收起票价");
                            s.html($._render_price(E.data, w));
                            s.show();
                            s.removeClass("bgc");
                            if (y.hasClass("bgc")) {
                                s.addClass("bgc")
                            }
                            if (E.data.PM != "--") {
                                $("#sleeper-price_" + E.data.train_no).mouseover(function () {
                                    $("#tp-list-price_" + E.data.train_no).show()
                                });
                                $("#sleeper-price_" + E.data.train_no).mouseout(function () {
                                    $("#tp-list-price_" + E.data.train_no).hide()
                                })
                            }
                        }
                    }
                })
            }
        },
        _render_price: function (s, u) {
            var t = '<td colspan="4"></td>';
            if (s.A9) {
                t += '<td width="46" align="center" class="p-num">' + [s.A9] + "</td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            if (s.P) {
                t += '<td width="46" align="center" class="p-num">' + (s.P) + "</td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            if (s.M) {
                t += '<td width="46" align="center" class="p-num">' + (s.M) + "</td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            if (s.O) {
                t += '<td width="46" align="center" class="p-num">' + (s.O) + "</td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            if (s.A6) {
                t += '<td width="46" align="center" class="p-num">' + (s.A6) + "</td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            if (s.A4) {
                t += '<td width="46" align="center" class="p-num">' + (s.A4) + "</td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            if (s.A3) {
                t += '<td width="46" align="center" class="p-num">' + (s.A3) + "</td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            if (s.A2) {
                t += '<td width="46" align="center" class="p-num">' + (s.A2) + "</td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            if (s.A1) {
                t += '<td width="46" align="center" class="p-num">' + (s.A1) + "</td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            if (u != "--" && s.WZ) {//无座
                t += '<td width="46" align="center" class="p-num">' + (s.WZ) + "</td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            if (s.MIN) {
                t += '<td width="51" align="center">';
                t += '<div class="sleeper" id="sleeper-price_' + s.train_no + '">';
                t += '<p class="p-num">' + s.MIN + "</p>";
                t += '<div class="tp-list" id="tp-list-price_' + s.train_no + '" style="display:none;">';
                t += "<b></b><ul>";
                var q = s.OT;
                for (var r = 0; r < q.length; r++) {
                    t += "<li>" + q[r] + "</li>"
                }
                t += "</ul></div></div></td>"
            } else {
                t += '<td width="46" align="center"></td>'
            }
            t += '<td class="last no-br"></td>';
            return t
        },
        _lock_btn: function (q) {
            o = false;
            $("#_a_search_btn1").addClass("btn-disabled");
            $("#_a_search_btn2").addClass("btn-disabled");
            $("#_a_search_btn3").addClass("btn-disabled");
            i = window.setTimeout(function () {
                o = true;
                if ($("#train_start_date").val() <= other_buy_date.split("&")[1]) {
                    $("#_a_search_btn1").removeClass("btn-disabled")
                }
                $("#_a_search_btn2").removeClass("btn-disabled");
                $("#_a_search_btn3").removeClass("btn-disabled");
                $.quick_time_search_unLock()
            }, 1000)
        }
    })
})();