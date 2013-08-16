var isortable = false;
var setSelector = "#elem-manage-g";
var setCookieName = "listOrder";
var setCookieNames = "listsOrder";
var setCookieExpiry = 999;
var keyDown = 10;

$(function() {
	$.fn.scrollToTop = function() {
		$(this).hide().removeAttr("href");
		if ($(window).scrollTop() != "0") {
			$(this).fadeIn("slow")
		}
		var scrollDiv = $(this);
		$(window).scroll(function() {
			if ($(window).scrollTop() == "0") {
				$(scrollDiv).fadeOut("slow")
			} else {
				$(scrollDiv).fadeIn("slow")
			}
		});
		$(this).click(function() {
			$("html, body").animate({
				scrollTop: 0
			}, "slow")
		})
	}
});

$(window).ready(function(){
	$("#scroll-top").scrollToTop();
	$("#elem-manage-lock").bind('click', function(){
		if($(this).hasClass("locked")){
			$(this).removeClass("locked").addClass("unlocked");
			$(".elem-manage-nav").removeClass("locked").addClass("unlocked");
			$("#elem-manage-g").find("li").each(function(){
				$(this).jrumble({
					speed: 80,
					x: 0,
					y: 0,
					rotation: 1
				});
				$(this).trigger("startRumble");
				$("#block-add").trigger("stopRumble");
			}).hover(function(){
				$(this).trigger("stopRumble");
			}).mouseleave(function() {
				$(this).trigger("startRumble");
				$("#block-add").trigger("stopRumble");
			});
			isortable = true;
		}
		else if($(this).hasClass("unlocked")){
			$(this).removeClass("unlocked").addClass("locked");
			$(".elem-manage-nav").removeClass("unlocked").addClass("locked");
			$("#elem-manage-g").find("li").each(function(){
				$(this).trigger("stopRumble");
			}).mouseleave(function() {
				$(this).trigger("stopRumble");
			});
			isortable = false;
		};
		if(isortable == true){
			$("#elem-manage-g").find("li").removeClass("disabled");
		} else {
			$("#elem-manage-g").find("li").addClass("disabled");
		}
	});
	var searchfocus = false;
	$(".head-search .search-button").bind("click", function(event){
		event.preventDefault();
		if(!$(".head-search").hasClass("open")){
			$(".head-search").addClass("open").animate({
				width: "220px"
			}, 200, function() {
				$("#head-search-input").focus();
				searchfocus = true;
			});
			$("#head-search-form").animate({paddingRight: "9px"},200);
			$("#head-search-form input").animate({width: "175px"},200);
		} else {
			$("#head-search-form").submit();
		}
	});
	$("body").bind("click", function(e){
		var click = $(e.target);
		if(click.hasClass("search-button") || click.hasClass("search-form-targ") || click.hasClass("head-search-in")){
		} else {
			if(searchfocus == true){
       			$("#head-search-input").val("").blur();
				$(".head-search").removeClass("open").animate({width: "34px"}, 200);
				$("#head-search-form").animate({paddingRight: "0px"},200);
				$("#head-search-form input").animate({width: "0px"},200);
       		}
		}
    });
	$("#elem-manage-g .delete").bind('click', function(){
		var mparent = $(this).parent("#elem-manage-but");
		var deleted = mparent.parent("li");
		deleted.fadeOut(function() {
			$("#no-active-manage").append(deleted.fadeIn(function(){
				restoreClones();
			}));
			ContHeight();
		});
	});
	$(function iconsortable(){
		function clonelist(){
			$("#elem-manage-g li").each(function(){
		        var item = $(this);
		        var item_clone = item.clone();
		        item.data("clone", item_clone);
		        var position = item.position();
		        item_clone.css("left", position.left);
		        item_clone.css("top", position.top);
		        $("#elem-manage-clone").append(item_clone);
		    });
		};
    	$("#elem-manage-g").sortable({
	    	cursor:'move',
	    	connectWith: "#no-active-manage",
			placeholder: "elem-manage-old",
			items: "li:not(.elem-manage-ndrag)",
			cancel:".disabled",
			tolerance: "pointer",
			revert: 50,
			create: function(e,ui){
				$("#elem-manage-g").find("li").addClass("disabled");
				clonelist();
				$("#elem-manage-clone li").css("visibility", "hidden");
				$("#elem-manage-clone").find(".title").css("color", "transparent");
				ContHeight();
			},
	        start: function(e, ui){
	            $(ui.placeholder).html("<div class=" + "inner" + "></div>");
	            $("#elem-manage-clone li").css("visibility", "visible");
	            $("#elem-place-manage").css("display", "block");
	            ui.helper.addClass("exclude-me");
            	$("#elem-manage-g li:not(.exclude-me, .elem-manage-old, #block-add)").css("visibility", "hidden");
            	ui.helper.data("clone").hide();
            	$("#elem-manage-clone").find(".title").css("color", "#33383d");
            	var placeholderp = $(".elem-manage-old").offset();
            	$("#hidden-placeholder").offset({ top: placeholderp.top, left: placeholderp.left });
	        },
	        stop: function(e, ui){
	        	$("#elem-manage-g li.exclude-me").each(function(){
	                var item = $(this);
	                var clone = item.data("clone");
	                var position = item.position();
	                clone.css("left", position.left);
	                clone.css("top", position.top);
	                clone.show();
	                item.removeClass("exclude-me");
	            });
	            $("#elem-manage-g li").css("visibility", "visible");
	            $("#elem-manage-clone li").css("visibility", "hidden");
	            $("#elem-place-manage").css("display", "none");
	            $("#elem-manage-clone").find(".title").css("color", "transparent");
	        },
	        change: function(e, ui){
	            $("#elem-manage-g li:not(.exclude-me, .elem-manage-old)").each(function(){
	                var item = $(this);
	                var clone = item.data("clone");
	                clone.stop(true, false);
	                var position = item.position();
	                clone.animate({
	                    left: position.left,
	                    top:position.top}, 500);
	            });
	            ContHeight();
	            var placeholderp = $(".elem-manage-old").offset();
            	$("#hidden-placeholder").offset({ top: placeholderp.top, left: placeholderp.left });
	        }
	    }).disableSelection();
		$("#no-active-manage").sortable({
    		connectWith: "#elem-manage-g"
		});
	});
	$("#block-add").bind("click", function(){
		ucozopenmodal("addingPanel");
		checkStatus();
	});
	$(".main-header .curr-user").bind("click", function(user){
		user.preventDefault();
		ucozopenmodal("settingsPanel");
	});
	$("#ucoz-modal-over, #ucoz-modal-close").bind("click", function(){
		ucozclosemodal();
	});
	$("#ucoz-manage-act #button-status").bind("click", function(){
		var actButton = $("#elem-manage-g").find("#block-add");
		var parentID = $(this).closest("li").attr("id");
		var addButton = $("#no-active-manage").find("#" + parentID);
		var removeButton = $("#elem-manage-g").find("#" + parentID);
		if($(this).hasClass("add")){
			addButton.fadeOut(function() {
				$("#elem-manage-g").append(addButton.fadeIn(function(){
					restoreClones();
				}));
				$("#elem-manage-g").append(actButton);
				ContHeight();
				if(isortable == true){
					$(this).trigger("startRumble");
				}else{
					$(this).trigger("stopRumble").mouseleave(function(){
						$(this).trigger("stopRumble");
					});
				};
			});
			$(this).html("Добавлено").removeClass("add").addClass("added");
		} else if($(this).hasClass("cancel")){
			removeButton.fadeOut(function() {
				$("#no-active-manage").append(removeButton.fadeIn(function(){
					restoreClones();
				}));
				ContHeight();
				if(isortable == true){
					$(this).trigger("startRumble");
				}else{
					$(this).trigger("stopRumble").mouseleave(function(){
						$(this).trigger("stopRumble");
					});
				};
			});
			$(this).html("Добавить").removeClass("added").removeClass("cancel").addClass("add");
		}
	}).mouseenter(function(){
		if($(this).hasClass("added")){
			$(this).addClass("cancel").html("Отменить");
		}
	}).mouseleave(function(){
		if($(this).hasClass("added")){
			$(this).removeClass("cancel").html("Добавлено");
		}
	});
	$("#elem-activity-wrap #elem-acivity-item").each(function(){
		$(this).find(".e-act-apply").bind("click", function() {
			var approve = $(this).closest("#elem-acivity-item");
			approve.addClass("approve");
			$(this).fadeOut("fast");
		});
	});
	$("#elem-activity-wrap .news-wall").each(function(){
		var news_full = $(this).html();
		var news = news_full;
		if( news.length > 200 ){
			news = news.substring(0, 500);
			$(this).html('<div class="short-news">' + news + '...</div><a href="#" class="news-wall-read">Раскрыть полностью...</a>' );
			$(this).append('<div class="full_news" style="display: none;">' + news_full + '</div>');
			$(this).addClass("close");
		}
	});
	$("#elem-activity-wrap .news-wall-read").bind("click", function(event){
		event.preventDefault();
		var item = $(this).parent();
		var readbut = item.find(".news-wall-read");
		item.find(".short-news").fadeOut(function(){
			item.find(".full_news").fadeIn();
		});
		readbut.fadeOut(function(){
			readbut.remove();
		});
		item.addClass("close");
	});
	$("#showmore-wall a").bind("click", function(event){
		event.preventDefault();
		var wallClone = $("#elem-activity-wrap #elem-acivity-item").slice(0,4).clone();
		$("#elem-activity-wrap").append(wallClone.fadeIn()).append($(this).parent());

	});
	$("body .tooltip").mousemove(function (e){
		$("#tooltip").css({
			"left": e.pageX + 20,
		    "top": e.pageY + 20
		});
	}).mouseenter(function(){
		var tooltip = $(this).attr("data-title");
		$("#tooltip").html(tooltip).css("display", "block");
	}).mouseleave(function(){
		$("#tooltip").html("").css("display", "none");
	});
});

$(window).resize(function(){
	scrollW();
	if($("#ucoz-modal").hasClass("open")){
		setmodalH();
		setSlider($("#modal-sroll-content"));
	};
});

$(window).load(function(){
	$("#loading-page").delay(500).fadeOut("slow", function() {
		$("body").removeClass("loading");
		$(".current-space").each(function(){
			var used = $(this).find(".used").text();
			    full = $(this).find(".full").text();
			    rule = $("#space-scale").width();

			$(".current-space").animate({"width": rule * (used / full)}, 1000 );
		});
		scrollW();
	});
});

function restoreClones(){
	$("#elem-manage-clone li").remove();
	$("#elem-manage-g li").each(function(){
        var item = $(this);
        var item_clone = item.clone();
        item.data("clone", item_clone);
        var position = item.position();
        item_clone.css("left", position.left);
        item_clone.css("top", position.top);
        item_clone.css("position", "absolute");
        item_clone.css("visibility", "hidden");
        $("#elem-manage-clone").append(item_clone);
	});
};

function getOrder() {
	$.cookie(setCookieName, $("#elem-manage-g").sortable("toArray"), { expires: setCookieExpiry, path: "/" });
};

function restoreOrder() {
	var list = $("#elem-manage-g");
	if (list == null) return;
	var cookie = $.cookie(setCookieName);
	if (!cookie) return;
	var IDs = cookie.split(",");
	var items = list.sortable("toArray");
	var rebuild = new Array();
	for ( var v=0, len=items.length; v<len; v++ ){
		rebuild[items[v]] = items[v];
	}
	for (var i = 0, n = IDs.length; i < n; i++) {
		var itemID = IDs[i];
		if (itemID in rebuild) {
			var item = rebuild[itemID];
			var child = $("nav#elem-manage-g.ui-sortable").children("#" + item);
			var savedOrd = $("nav#elem-manage-g.ui-sortable").children("#" + itemID + ", #block-add");
			child.remove();
			$("nav#elem-manage-g.ui-sortable").filter(":first").append(savedOrd);
		}
	}
};

function ContHeight(){
	var whatheight = $("#elem-manage-g").height();
	$("#elem-manage-clone").height(whatheight);
};

function ucozopenmodal(panel){
	if(!$("#ucoz-modal").hasClass("open")){
		if(panel == "addingPanel"){
			$("#ucoz-modal-content.adding-panel").css("display", "block");
			$("#ucoz-modal-content.settings-panel").css("display", "none");
			setmodalH();
		}else if(panel == "settingsPanel"){
			$("#ucoz-modal-content.settings-panel").css("display", "block");
			$("#ucoz-modal-content.adding-panel").css("display", "none");
		}
		$("body").addClass("modal-open");
		$("#ucoz-modal.adding-panel").removeClass("first-open").css("visibility", "visible").addClass("open").each(function(){
			setSlider($("#modal-sroll-content"));
		});
	};
};

function setmodalH(){
	var modalH = $(window).height() - 260;
	var modalCont = $("#ucoz-modal #ucoz-manage-act").height();
	if(modalH < modalCont){
		$("#modal-sroll-content").height(modalH);
	} else if(modalH >= modalCont){
		$("#modal-sroll-content").height(modalCont);
		$("#ucoz-modal-content.adding-panel").find(".modal-mask").css({opacity:0});
	};
	if(modalH < 220){
		$("#modal-sroll-content").height(220);
	}
	//$("#ucoz-modal-content").height(modalH);
	
};

function ucozclosemodal(){
	if($("#ucoz-modal").hasClass("open")){
		$("#ucoz-modal").removeClass("open").delay(500).queue(function(next){ 
        	$(this).css("visibility", "hidden"); 
        	next(); 
      	});
		$("body").removeClass("modal-open");
	}
};

function checkStatus(){
	$("#ucoz-manage-act #button-status").html("Добавить").removeClass("added").addClass("add");
	var statusbar = $("#ucoz-manage-act");
	var activeButtons = [];
	$("#elem-manage-g li").each(function(){
        activeButtons = $(this).attr('id');
        statusbar.find("#" + activeButtons + " #button-status").html("Добавлено").removeClass("add").addClass("added");
    });
};

function loadmore(){ 
	var wallClone = $("#elem-activity-wrap #elem-acivity-item").slice(0,4).clone(true);
	if(wallClone.hasClass("approve")){
		wallClone.removeClass("approve").children(".e-act-apply").css("display", "block");
	};
	$("#elem-activity-wrap").append(wallClone.fadeIn());
};

function scrollW(){
	$("#scroll-top").each(function(){
		var fullW = $("#body-wrap").width();
		var mainW = $(".main-content").width();
		var scrollW = (fullW - mainW) / 2;
		$(this).width(scrollW);
	});
};

$(window).scroll(function(){
	if ($(window).scrollTop() == $(document).height() - $(window).height()){
		loadmore();
	};
	var sidebarH = $(".sidebar-nav").height() + $(".main-header").height() + 140;
	if ($(window).scrollTop() >= sidebarH){
		$(".sidebar-nav").addClass("hide-sidebar");
		$(".content").addClass("wide-activity");
	};
	if ($(window).scrollTop() < sidebarH){
		$(".sidebar-nav").removeClass("hide-sidebar");
		$(".content").removeClass("wide-activity");
	};
});

function setSlider($scrollpane){
	var handleImage = false;
	var scrollparent = $scrollpane.parent();
	var hidemask = $("#ucoz-modal-content.adding-panel").find(".modal-maskt");
	var hidebmask = $("#ucoz-modal-content.adding-panel").find(".modal-mask");
	$scrollpane.css('overflow','hidden');
	if ($scrollpane.find('.scroll-content').length==0) $scrollpane.children().wrapAll('<\div class="scroll-content"> /');
	var difference = $scrollpane.find('.scroll-content').height()-$scrollpane.height();
	$scrollpane.data('difference',difference);
	hidemask.css({opacity:0});
	if(difference<=0 && scrollparent.find('.slider-wrap').length>0)
	{
		scrollparent.find('.slider-wrap').remove();
		$scrollpane.find('.scroll-content').css({top:0});
		hidemask.css({opacity:0});
	}
	if(difference>0)
	{
		var proportion = difference / $scrollpane.find('.scroll-content').height();
		var handleHeight = Math.round((1-proportion)*$scrollpane.height());
		handleHeight -= handleHeight%2;
		var contentposition = $scrollpane.find('.scroll-content').position();	
		var sliderInitial = 100*(1-Math.abs(contentposition.top)/difference);
		
		if(scrollparent.find('.slider-wrap').length==0)
		{
			scrollparent.append('<\div class="slider-wrap"><\div class="slider-vertical"><\/div><\/div>');
			sliderInitial = 100;
		}
		
		scrollparent.find('.slider-wrap').height($scrollpane.height());
		scrollparent.find('.slider-vertical').slider({
			orientation: 'vertical',
			min: 0,
			max: 100,
			range:'min',
			value: sliderInitial,
			slide: function(event, ui) {
				var topValue = -((100-ui.value)*difference/100);
				$scrollpane.find('.scroll-content').css({top:topValue});
				$('ui-slider-range').height(ui.value+'%');
			},
			change: function(event, ui) {
				var topValue = -((100-ui.value)*($scrollpane.find('.scroll-content').height()-$scrollpane.height())/100);
				$scrollpane.find('.scroll-content').css({top:topValue});
				$('ui-slider-range').height(ui.value+'%');
				var scrollHt = 0 - ($scrollpane.find('.scroll-content').height()-$scrollpane.height());
				if(topValue == 0){
					hidemask.css({opacity:0});
				};
				if(topValue != 0){
					hidemask.css({opacity:1});
					hidebmask.css({opacity:1});
				};
				if(topValue == scrollHt){
					hidebmask.css({opacity:0});
				};
		  }	  
		});
		scrollparent.find(".ui-slider-handle").css({height:handleHeight,'margin-bottom':-0.5*handleHeight});
		var origSliderHeight = $scrollpane.height();
		var sliderHeight = origSliderHeight - handleHeight ;
		var sliderMargin =  (origSliderHeight - sliderHeight)*0.5;
		scrollparent.find(".ui-slider").css({height:sliderHeight,'margin-top':sliderMargin});
		scrollparent.find(".ui-slider-range").css({bottom:-sliderMargin});
	} 
	$(".ui-slider").click(function(event){
		event.stopPropagation();
	});
	$(".slider-wrap").click(function(event){
		var offsetTop = $(this).offset().top;
		var clickValue = (event.pageY-offsetTop)*100/$(this).height();
		$(this).find(".slider-vertical").slider("value", 100-clickValue);
	});
	var ModalsliderVal = scrollparent.find(".slider-vertical").slider("value");
	$(".scroll-content").hammer().on("drag", function(ev) {
        ev.gesture.preventDefault();

        var sliderVal = scrollparent.find(".slider-vertical").slider("value");
        var moveY = (ev.gesture.deltaY / 100) + ModalsliderVal;
        var pointer = ev.gesture.pointerType;
        if(pointer == "mouse"){
        	$(this).mousedown(function() {
        		$(this).css("cursor", "move");
        	}).mouseup(function() {
        		$(this).css("cursor", "default");
        	});
        };
        if(moveY > 100){moveY = 100;} else if(moveY < 0){moveY = 0;};
		sliderVal = moveY;
		scrollparent.find(".slider-vertical").slider("value", sliderVal);
		ModalsliderVal = moveY;
		keyDown = ModalsliderVal / 10;
		ev.preventDefault();
    });
    $(window).keydown(function(keyboard) {
    	if($("body").hasClass("modal-open")){
	    	if(keyboard.keyCode==38){
	    		keyDown++;
	    	}else if(keyboard.keyCode==40){
	    		keyDown--;
	    	};
	    	if(keyDown > 10){keyDown = 10;}else if(keyDown < 0){keyDown = 0};
	    	sliderVal = keyDown*10;
	    	ModalsliderVal = sliderVal;
			scrollparent.find(".slider-vertical").slider("value", sliderVal);
			keyboard.preventDefault();
    	}
    });
	if($.fn.mousewheel){		
		$scrollpane.unmousewheel();
		$scrollpane.mousewheel(function(event, delta){
			var speed = Math.round(5000/$scrollpane.data('difference'));
			if (speed <1) speed = 1;
			if (speed >100) speed = 100;
			var sliderVal = scrollparent.find(".slider-vertical").slider("value");
			sliderVal += (delta*speed);
			scrollparent.find(".slider-vertical").slider("value", sliderVal);
			ModalsliderVal = sliderVal;
			keyDown = ModalsliderVal / 10;
			event.preventDefault();
		});
	}
}