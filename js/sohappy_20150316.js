$(document).ready(function() {
	detectMobile()
	onResize();
	$(window).resize(onResize);
	lv0.layOut1();
})
var level0 = $('#level-0'),
	level1 = $('#level-1'),
	level2 = $('#level-2');
var lv1Nav = $('#level-1 .nav .menu ul');
var lv1Con = $('#level-1 .content');

var sohappy = {
	preload: function(imgWrap, callback, line) {
		var img = imgWrap.find("img");
		img.hide();
		var imgload = new imagesLoaded(imgWrap);
		imgload.on("done", function() {
			if (callback) {
				callback(imgWrap, line);
			}
			if (line) {
				img.fadeTo(600, '0.6');
			} else {
				img.fadeIn(1000); 
			}
		})
		imgload.on("fail", function() {
			imgWrap.hide();
			console.log($(img).attr('src') + "failed to loading");
		})
	},
	showNav: function(navWrap) {
		var items = navWrap.find("b");
		items.each(function(i, item) {
			$(item).delay(200 + i * 100).fadeIn(300);
		})
	}
}
var lv0 = {
	nowIndex: 0,
	rote: null,
	setIll: function(n) {
		var picWrap = $("#level-0 .picWrap");
		var imgWrap = $("<table>").css({
			"background-color": "#" + illustrats.img[n].bgc
		}).addClass('active imgWrap').appendTo(picWrap);
		imgWrap.append("<tr><td><img src=" + "'" + illustrats.img[n].src + "'" + " /></td></tr>");
	},
	layOut1: function() {
		picWrap = $("#level-0 .picWrap");
		var afterFirst = function() {
			$('.imgWrap').fadeIn(200);
			sohappy.showNav($("#level-0 .nav"));
			lv0.navClick();
			lv0.layOut2(picWrap);
		}
		lv0.setIll(0);
		lv1.goBack();
		sohappy.preload(picWrap, afterFirst);
	},
	layOut2: function(picWrap) {
		var num = illustrats.img.length;
		for (var i = 1; i < num; i++) {
			lv0.setIll(i);
		}
		imagesLoaded(picWrap, function(instance) {
			lv0.rote = setInterval(lv0.changeIll, 5000);
		});
	},
	changeIll: function() {
		var picWrap = $("#level-0 .picWrap");
		var items = $(picWrap).children('table');
		var index = (lv0.nowIndex + 1) % items.length;
		var changeAB = function(a, b) {
			a.removeClass('active');
			b.addClass('active').fadeIn(1100, function() {
				a.hide();lv0.nowIndex = index;
			});
			
		}
		changeAB($(items[lv0.nowIndex]), $(items[index]));
	},
	navClick: function() {
		var navItems = $('#level-0 .nav b');
		navItems.click(function() {
			var data = $(this).attr('data-id');
			$('#level-0').stop().animate({
				'margin-top': -$('#level-0').height()
			}, 700, 'easeInOutExpo', function() {
				$('#level-0').removeClass('active');
				clearInterval(lv0.rote);
				lv1.showNav(data);
			});
		})
	}
}
var lv1 = {
	showNav: function(data) {
		lv1.setNav(data);
	},
	setNav: function(data) {
		switch (data) {
			case 'art':
				lv1.artNav();
				break;
		}
	},
	artNav: function() {
		var menu = $('#level-1 .nav .menu ul');
		for (var i = 0; i < art.length; i++) {
			menu.prepend($("<li><b><h2>" + art[i].artist[0].cn + "</h2><h6>" + art[i].artist[0].en + "</h6></b></li>"));
		};
		sohappy.showNav($('#level-1 .nav'));
		var menuItem = $('#level-1 .nav .menu ul li b');
		menuItem.hover(function() {
			$('#level-1 .nav i').stop().animate({
				top: $(this).parent().position().top
			}, 500, 'easeInOutExpo');
		}, function() {
			$('#level-1 .nav i').stop().animate({
				top: $('#level-1 .nav .active').position().top
			}, 500, 'easeInOutExpo');
		});
		menuItem.click(function() {
			menuItem.parent().removeClass('active');
			$(this).parent().addClass('active');
			lv1.artCon($(this));
		})
		$(menuItem[0]).trigger('click');
	},
	goBack: function() {
		var backHome = $('#level-1 .nav .sohappy');
		backHome.click(function() {
			$('#level-0').addClass('active').animate({
				'margin-top': '0'
			}, 700, 'easeInOutExpo', function() {
				lv0.rote = setInterval(lv0.changeIll, 5000);
				$('#level-1 .content').empty();
				$('#level-1 .nav ul').empty().append('<li class="h100"></li>');
			});
		})
	},
	artCon: function(Artist) {
		var index = (art.length - 1) - Artist.parent().index();
		var bgc = art[index].artist[0].bgc;
		var listNum = art[index].artist.length;
		var maxw = winW - 160;
		//var img = new Image();
		var lineW = 0;
		var i = art[index].artist.length - 1;
		var j = 0;
		var ha = "<div class='lines'><div class='title'><h3>";
		var hb = "</h3><h6>";
		var hc = "</h6></div><ul></ul></div>";
		var fs = {
			set: null,
			lineHover: function(obj, mask) {
				mask.mouseenter(function() {
					$(this).stop().animate({
						width: '0'
					}, 300);
					$(this).prev().find('img').stop().fadeTo(300, '1')
					$(this).prev().children('.title').stop().animate({
						width: '100%'
					}, 1800);
				})
				obj.mouseleave(function() {
					$(this).next().stop().animate({
						width: '100%'
					}, 300);
					$(this).find('img').stop().fadeTo(300, '0.6')
					$(this).children('.title').stop().animate({
						width: '0'
					}, 500);
				})
			},
			overLine: function(li, liW, num) {
				lineW = lineW + liW + 10;
				//console.log(lineW + '/' + maxw)
				if (lineW > maxw) {
					li.hide();
				}
				if (li.index() == (num - 1)) {
					var obj = li.parents('.lines');
					obj.after(obj.clone().addClass('after'));
					var mask = obj.next();
					mask.animate({
						width: '100%'
					}, 600);
					fs.lineHover(obj, mask);
				}
			},
			getWidth: function(li, ul, num) {
				var img = li.children('img');
				if (img.width()) {
					fs.overLine(li, img.width(), num);
					clearInterval(fs.set);
					fs.listPic(ul, num);
				}
			},
			listPic: function(ul, picNum) {
				if (j < picNum) {
					var li = $('<li>').appendTo(ul);
					li.append($('<img>').attr('src', art[index].artist[i].list[1].img[j].src));
					sohappy.preload(li, null, true);
					var check = function() {
						fs.getWidth(li, ul, picNum)
					}
					fs.set = setInterval(check, 40);
					j++;
				} else {
					i--;
					fs.listCon();
				}
			},
			listCon: function() {
				j = 0;
				lineW = 0;
				if (i > 0) {
					var cn = art[index].artist[i].list[0].cn;
					var en = art[index].artist[i].list[0].en;
					var picNum = art[index].artist[i].list[1].img.length;
					var line = $(ha + cn + hb + en + hc).appendTo($('#level-1 .content'));
					var ul = $(line).children('ul');
					fs.listPic(ul, picNum);
				} else {
					return;
				}
			}
		};

		var conWrap = $('#level-1 .conWrap');
		conWrap.fadeOut(200, function() {
			conWrap.children('.content').empty();
			conWrap.css({
				'background-color': '#' + bgc
			}).fadeIn(200, function() {
				fs.listCon();
			})
		});
	}
}


var detectMobile = function() {
	var mob = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i);
	if (mob != null) {
		mobile = true;
		$("body").addClass("mobile");
	} else {
		mobile = false;
	}
};
var onResize = function() {
	var level = $(".level");
	winW = $(window).width();
	winH = window.innerHeight ? window.innerHeight : $(window).height();
	//level.width(winW);
	//level.height(winH);
};