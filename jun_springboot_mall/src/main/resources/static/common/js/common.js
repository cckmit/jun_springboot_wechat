/* 设置全局ajax处理 */
$.ajaxSetup({
	complete : function(XMLHttpRequest, textStatus) {
		if (textStatus == 'timeout') {
			$.modal.alertWarning("服务器超时，请稍后再试！");
			$.modal.closeLoading();
		} else if (textStatus == "parsererror" || textStatus == "error") {
			$.modal.alertWarning("服务器错误，请联系管理员！");
			$.modal.closeLoading();
		}
	}
});

/* layer全局配置 */
layer.config({
	extend: 'moon/style.css',
	skin: 'layer-ext-moon'
});

/* laydate全局配置 */
lay('.item-datetime').each(function(){
  laydate.render({
    elem: this,
    theme: '#3C8DBC',
    type: 'datetime',
    trigger: 'click',
  });
});
lay('.item-datetime-range').each(function(){
  laydate.render({
    elem: this,
    theme: '#3C8DBC',
    range: '~',
    type: 'datetime',
    trigger: 'click',
  });
});


/* 导出报表 */
function exportTo(fileName) {
	var date = new Date();
	$(".table").table2excel({
		exclude : ".noExl",
		name : "Excel Document Name",
		filename : fileName,
		exclude_img : true,
		exclude_links : true,
		exclude_inputs : true
	});
}

/* select2插件全局初始化 */
$(".select2").select2();
$(".select2").on("select2:select", function(e) {
	var id = $(this).attr("id");
	$("#" + id + "-error").remove();
});

/* icheck插件全局初始化 */
$('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
	checkboxClass : 'icheckbox_minimal-blue',
	radioClass : 'iradio_minimal-blue'
});

/* 图片查看 */
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
	event.preventDefault();
	$(this).ekkoLightbox();
});

/* 关闭选项卡 */
function closeItem(dataId){
	var topWindow = $(window.parent.document);
	if(!$.common.isEmpty(dataId)){
		window.parent.Core.closeLoading();
		// 根据dataId关闭指定选项卡
		$('.J_menuTab[data-id="' + dataId + '"]', topWindow).remove();
		// 移除相应tab对应的内容区
		$('.J_mainContent .J_iframe[data-id="' + dataId + '"]', topWindow).remove();
		return;
	}
	var panelUrl = window.frameElement.getAttribute('data-panel');
	$('.page-tabs-content .active i', topWindow).click();
	if(!Core.isEmpty(panelUrl)){
		$('.J_menuTab[data-id="' + panelUrl + '"]', topWindow).addClass('active').siblings('.J_menuTab').removeClass('active');
		$('.J_mainContent .J_iframe', topWindow).each(function() {
            if ($(this).data('id') == panelUrl) {
                $(this).show().siblings('.J_iframe').hide();
                return false;
            }
		});
	}
}

/* 创建选项卡 */
function createMenuItem(dataUrl, menuName) {
	var panelUrl = window.frameElement.getAttribute('data-id');
	dataIndex = $.common.random(1,100),
    flag = true;
    if (dataUrl == undefined || $.trim(dataUrl).length == 0) return false;
    var topWindow = $(window.parent.document);
    // 选项卡菜单已存在
    $('.J_menuTab', topWindow).each(function() {
        if ($(this).data('id') == dataUrl) {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                $('.page-tabs-content').animate({ marginLeft: ""}, "fast");
                scrollToTab(this);
                // 显示tab对应的内容区
                $('.J_mainContent .J_iframe', topWindow).each(function() {
                    if ($(this).data('id') == dataUrl) {
                        $(this).show().siblings('.J_iframe').hide();
                        return false;
                    }
                });
            }
            flag = false;
            return false;
        }
    });
    // 选项卡菜单不存在
    if (flag) {
        var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '" data-panel="' + panelUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
        $('.J_menuTab', topWindow).removeClass('active');
        // 添加选项卡对应的iframe
        var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" data-panel="' + panelUrl + '" seamless></iframe>';
        $('.J_mainContent', topWindow).find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);
        if (typeof NProgress != 'undefined') {
            NProgress.start();
            $('.J_mainContent iframe:visible').load(function () {
            	NProgress.done();
            });
        }
        // 添加选项卡
        $('.J_menuTabs .page-tabs-content', topWindow).append(str);
        scrollToTab($('.J_menuTab.active', topWindow));
    }
    return false;
}

/* 滚动到指定选项卡 */
function scrollToTab(element) {
	var topWindow = $(window.parent.document);
    var marginLeftVal = calSumWidth($(element).prevAll()),
    marginRightVal = calSumWidth($(element).nextAll());
    // 可视区域非tab宽度
    var tabOuterWidth = calSumWidth($(".content-tabs", topWindow).children().not(".J_menuTabs"));
    //可视区域tab宽度
    var visibleWidth = $(".content-tabs", topWindow).outerWidth(true) - tabOuterWidth;
    //实际滚动宽度
    var scrollVal = 0;
    if ($(".page-tabs-content", topWindow).outerWidth() < visibleWidth) {
        scrollVal = 0;
    } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
        if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
            scrollVal = marginLeftVal;
            var tabElement = element;
            while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content", topWindow).outerWidth() - visibleWidth)) {
                scrollVal -= $(tabElement).prev().outerWidth();
                tabElement = $(tabElement).prev();
            }
        }
    } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
        scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
    }
    $('.page-tabs-content', topWindow).animate({ marginLeft: 0 - scrollVal + 'px' }, "fast");
}

/* 计算元素集合的总宽度 */
function calSumWidth(elements) {
    var width = 0;
    $(elements).each(function() {
        width += $(this).outerWidth(true);
    });
    return width;
}

/**
 * [通过参数名获取url中的参数值]
 * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
 * @param  {[string]} queryName [参数名]
 * @return {[string]}           [参数值]
 */
function GetQueryValue(queryName) {
	var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return decodeURI(r[2]);
	} else {
		return null;
	}
}

/* 页面跳转 */
$("body").delegate(".toNewTab", "click", function() {
	var tabUrl = $(this).attr('tab-url');
	window.location.href = tabUrl + "?r=" + new Date().getTime();
});

/* 带有保存取消按钮 */
$("body").delegate(".dialog", "click", function() {
	var me = this;
	var url = $(this).attr('data-url');
	var width = $(me).attr('data-width');
	var height = $(me).attr('data-height');
	var title = $(me).attr('data-title');
	$.modal.dialog_open(title, url, width, height);
});

/* 带有保存取消按钮 （全屏) */
$("body").delegate(".dialogFull", "click", function() {
	var me = this;
	var url = $(this).attr('data-url');
	var width = $(me).attr('data-width');
	var height = $(me).attr('data-height');
	var title = $(me).attr('data-title');
	$.modal.dialog_openFull(title, url, width, height);
});

 /* 自定义保存取消 */
$("body").delegate(".dialog_detail", "click", function() {
	var me = this;
	var url = $(this).attr('data-url');
	var width = $(me).attr('data-width');
	var height = $(me).attr('data-height');
	var title = $(me).attr('data-title');
	$.modal.dialog_detail(title, url, width, height, false);
});

/* 多选删除 */
$("body").delegate("*[delete-batch-url]", "click", function() {
	var deleteBatchUrl = $(this).attr('delete-batch-url');
	var ids = [];
	$.each($("input:checked"), function(n, i) {
		if ($(this).val() != 'root') {
			ids.push($(this).val());
		}
	});
	if (ids.length == 0) {
		$.modal.msgWarning("请选择要删除的记录!");
	} else {
		$.modal.confirm('确认删除选中的【' + ids.length + '】条记录?', function(index){
			$.post(deleteBatchUrl, {id : ids.join()}, function(json) {
				if (json.code == 200) {
					window.location.reload();
				} else {
					$.modal.msgWarning(json.msg);
				}
			});
		});
	}
});

/* 回到顶部绑定 */
$(function() {
	if ($.fn.toTop !== undefined) {
		$('#scroll-up').toTop();
	}
});
(function($) {
	'use strict';
	$.fn.toTop = function(opt) {
		var elem = this;
		var win = $(window);
		var doc = $('html, body');
		var options = $.extend({
			autohide : true,
			offset : 50,
			speed : 500,
			position : true,
			right : 15,
			bottom : 5
		}, opt);
		elem.css({
			'cursor' : 'pointer'
		});
		if (options.autohide) {
			elem.css('display', 'none');
		}
		if (options.position) {
			elem.css({
				'position' : 'fixed',
				'right' : options.right,
				'bottom' : options.bottom,
			});
		}
		elem.click(function() {
			doc.animate({
				scrollTop : 0
			}, options.speed);
		});
		win.scroll(function() {
			var scrolling = win.scrollTop();
			if (options.autohide) {
				if (scrolling > options.offset) {
					elem.fadeIn(options.speed);
				} else
					elem.fadeOut(options.speed);
			}
		});
	};
})(jQuery);