/**
 * Created by gqq on 2018/3/5.
 */
define(function (require, exports, module) {
    window.$ = window.jQuery = require('jquery');
    require('bootstrap');
    require('html580');
    require('bootstrapValidator');
    require('bootstrapValidator-zh-cn');
    require('bootstrapValidator-css');
    require('jquery-confirm');
    require('jquery-confirm-css');
    require('cookie');
    require('lazyload');
    $("a[rel='external'],a[rel='external nofollow']").click(function () {
        window.open(this.href);
        return false;
    });
    if (app.scripts) {
        for (var i = 0, l = app.scripts.length; i < l; i++) {
            seajs.use(app.scripts[i], function (module) {
                if ($.isFunction(module.run)) {
                    module.run();
                }
            });
        }
    }
    var top = 150;
    $(".affixed-bottom").siblings("div").each(function () {
        top += $(this).outerHeight(true);
    });
    var bottom = 0;
    var doms = ['footer', 'bottomads', 'tools', 'links'];
    for (var i = 0; i < doms.length; i++) {
        if ($('#' + doms[i]).length > 0) {
            bottom += $('#' + doms[i]).outerHeight(true);
        }
    }
    $('.affixed-bottom').affix({offset: {top: top, bottom: bottom}}).on('affix.bs.affix', function (e) {
        $(e.target).width($(e.target).parent().outerWidth(true));
    });
    if ($('.bars [data-toggle="tooltip"]').length > 0) {
        $('.bars [data-toggle="tooltip"]').tooltip({container: '.bars'});
    }
    $(".bars li.popover-btn").each(function () {
        var trigger = $(this).data('trigger') ? $(this).data('trigger') : 'hover';
        $(this).popover({
            placement: 'left', trigger: trigger, html: true, content: function () {
                return $($(this).data('contentElement')).html();
            }
        });
    });
    $(".popover-btn1").hover(function () {
        $($(this).data('contentElement')).removeClass('out').addClass('in').show();
    }, function () {
        $($(this).data('contentElement')).removeClass('in').addClass('out').hide();
    });
    var goTop = function () {
        var $gotop = $(".go-top");
        $(window).scroll(function (event) {
            var scrollTop = $(window).scrollTop();
            if (scrollTop >= 100) {
                $gotop.addClass('show');
            } else if ($gotop.hasClass('show')) {
                $gotop.removeClass('show');
            }
        });
        $gotop.click(function () {
            $("body,html").animate({scrollTop: 0}, 300);
            return false;
        });
    }();
    $(".bookmark").click(function () {
        var _title = document.title;
        var url = document.URL;
        try {
            var ua = navigator.userAgent.toLowerCase();
            if (window.sidebar) {
                if (ua.indexOf("firefox") > -1 && window.sidebar.addPanel) {
                    window.sidebar.addPanel(url, _title);
                } else {
                    alert("浏览器不支持该操作，尝试快捷键 Ctrl + D !");
                    return false;
                }
            } else {
                if (document.all && window.external) {
                    window.external.AddFavorite(url, _title);
                } else {
                    alert("浏览器不支持该操作，尝试快捷键 Ctrl + D !");
                }
            }
        } catch (e) {
            alert("浏览器不支持该操作，尝试快捷键 Ctrl + D !");
        }
        return false;
    });
    $(".tool-set").each(function () {
        if ($(this).data("color") && $(this).data("color") == "1") {
            $(this).find("li").each(function () {
                $(this).addClass("c" + parseInt(Math.random() * 14 + 1));
            });
        }
    });
    var rscriptType = /^$|\/(?:java|ecma)script/i, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

    function getJavaScript(data) {
        var scripts = jQuery.map($(data), function (elem) {
            elem.type = (jQuery.find.attr(elem, "type") !== null) + "/" + elem.type;
            return elem;
        });
        hasScripts = scripts.length;
        if (hasScripts) {
            doc = scripts[scripts.length - 1].ownerDocument;
            jQuery.map(scripts, function (elem) {
                var match = /^true\/(.*)/.exec(elem.type);
                if (match) {
                    elem.type = match[1];
                } else {
                    elem.removeAttribute("type");
                }
                return elem;
            });
            for (var i = 0; i < hasScripts; i++) {
                node = scripts[i];
                if (rscriptType.test(node.type || "")) {
                    if (node.src) {
                        if (jQuery._evalUrl) {
                            jQuery._evalUrl(node.src);
                        }
                    } else {
                        jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, ""));
                    }
                }
            }
        }
    }

    $.ajaxSetup({
        complete: function (jqXHR, type) {
            if (type == 'parsererror') {
                getJavaScript(jqXHR.responseText);
            }
        }, data: {__isajax__: true}, error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    function getUser() {
        var userName = $.cookie('userName');
        if (userName) {
            var arr = userName.split("~~");
            $(".userName").html(arr[0]);
            $(".userLink").attr("href", arr[1]);
            $(".loginout").hide();
            $(".loginin").show();
        } else {
            $(".loginout").show();
            $(".loginin").hide();
            $(".userName").html("");
            $(".userLink").attr("href", "");
        }
    }

    $(".loginForm").each(function () {
        var thiz = $(this);
        thiz.bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            submitButtons: 'button[type="submit"]',
            fields: {
                username: {validators: {notEmpty: {message: '用户名不能为空'}}},
                password: {validators: {notEmpty: {message: '密码不能为空'}}}
            }
        }).on('success.form.bv', function (e) {
            e.preventDefault();
            var form = $(e.target);
            $.post(form.attr('action'), form.serialize(), function (result) {
                if (result.status == true || result.status == 'true' || result.status == 'success') {
                    $('#loginModal').modal('hide');
                    getUser();
                } else {
                    thiz.bootstrapValidator('disableSubmitButtons', false);
                }
                $.confirm({
                    keyboardEnabled: true,
                    content: result.info,
                    confirmButton: false,
                    columnClass: 'col-xs-4 col-xs-offset-4',
                    autoClose: 'cancel|2000',
                    cancelButtonClass: 'btn-primary',
                    cancelButton: '确定'
                });
                var goPage = result.goPage;
                if (goPage) {
                    location.href = goPage;
                }
            }, 'json');
        });
    });
    $("#searchform").bootstrapValidator({
        container: 'tooltip',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        submitButtons: 'button[type="submit"]',
        fields: {s: {validators: {notEmpty: {message: '请输入关键词'}}}}
    });
    $('#defaultForm').bootstrapValidator({
        container: 'tooltip',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            firstName: {
                validators: {
                    stringLength: {
                        enabled: false,
                        min: 4,
                        message: 'The first name must be more than 5 characters'
                    },
                    notEmpty: {message: 'The first name is required'},
                    regexp: {
                        enabled: true,
                        regexp: /^[a-z]+$/i,
                        message: 'The first name must consist of a-z, A-Z characters only'
                    }
                }
            },
            firstName: {
                validators: {
                    stringLength: {min: 4, message: 'The last name must be more than 5 characters'},
                    notEmpty: {message: 'The last name is required'},
                    regexp: {regexp: /^[a-z]+$/i, message: 'The last name must consist of a-z, A-Z characters only'}
                }
            }
        }
    });
    function fixTop() {
        var header = $("#header");
        var headerNav = $("#header-nav");
        var height = header.outerHeight() + $("#header-nav").outerHeight();
        var top = $(window).scrollTop();
        top > height && $(window).width() >= 768 && headerNav.removeClass("navbar-static-top").addClass("navbar-fixed-top");
        height >= top && headerNav.removeClass("navbar-fixed-top").addClass("navbar-static-top");
    }

    function init() {
        getUser();
    }

    init();
    $("li.nav-hover").mouseenter(function (event) {
        $(this).addClass("open");
    }).mouseleave(function (event) {
        $(this).removeClass("open");
    });
});