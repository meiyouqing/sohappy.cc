/*    class Sohappy     */
var mobile;

function Sohappy() {
	this.mainCon = $('#content');
	this.levels = $('.level');
};
Sohappy.prototype.setHeight = function() {
	this.levels.height(winH);
};
Sohappy.prototype.imgLoad = function(imgWrap, callback) {
	var img = imgWrap.find("img");
	img.hide();
	var imgload = new imagesLoaded(imgWrap);
	imgload.on("done", function() {
		if (callback) {
			callback(imgWrap);
		}
		img.fadeIn(1000);
	})
	imgload.on("fail", function() {
		imgWrap.hide();
		console.log($(img).attr('src') + "failed to loaded");
	})
};
Sohappy.prototype.navShow = function(navWrap) {
	var items = navWrap.find("b");
	items.each(function(i, item) {
		$(item).delay(200 + i * 100).fadeIn(300);
	});
};

/*    class Sohappy-L0     */
function L0() {
	Sohappy.call(this);
	this.level = $('#level-0');
	this.nav = $('#level-0 .nav');
	this.con = $('#level-0 .focusWrap');
	this.nowIndex = 0;
	this.rote = null;
};
L0.prototype = new Sohappy();
L0.prototype.constructor = L0;
L0.prototype.layout = function() {
	var This = this;
	This.setHeight();
	setCon(0);
	This.imgLoad(This.con, homeStart);

	function homeStart() {
		This.imgWrap.fadeIn(200);
		This.navShow(This.nav);
		This.navEvent();
		changeStart();
	};

	function changeStart() {
		var num = illustrats.img.length;
		for (var i = 1; i < num; i++) {
			setCon(i);
		}
		This.imgLoad(This.con, function() {
			This.rote = setInterval(function() {
				This.soChange()
			}, 5000);
		});
	};

	function setCon(n) {
		This.imgWrap = $("<table>").css({
			"background-color": "#" + illustrats.img[n].bgc
		}).addClass('active imgWrap').appendTo(This.con);
		This.imgWrap.append("<tr><td><img src=" + "'" + illustrats.img[n].src + "'" + " /></td></tr>");
	};
};
L0.prototype.soChange = function() {
	This = this;
	var items = $('#level-0 .focusWrap table');
	var index = (this.nowIndex + 1) % items.length;
	changeAB($(items[this.nowIndex]), $(items[index]));

	function changeAB(a, b) {
		a.removeClass('active');
		b.addClass('active').fadeIn(1100, function() {
			a.hide();
			This.nowIndex = index;
		})
	}
}
L0.prototype.navEvent = function() {
	var This = this;
	This.nav.find('b').click(function() {
		var data = $(this).attr('data-id');
		This.mainCon.stop().animate({
			top: -winH
		}, 700, 'easeOutExpo', function() {
			if (!mobile) {
				s1.nav.animate({
					left: 0
				}, 300);

			}
			clearInterval(This.rote);
			s1.start(data);
		})
	})
};

/*    class L1     */
function L1() {
	Sohappy.call(this);
	this.level = $('#level-1');
	this.nav = $('#level-1 .nav');
	this.menuBtn = $('#J_artistMenu');
	this.menu = $('#level-1 .nav .menu ul');
	this.i = $('#level-1 .nav i');
	this.conWrap = $('#level-1 .conWrap');
	this.con = $('#level-1 .conWrap .content');
	this.back = $('#level-1 .nav .sohappy');
	this.goBack();
};
L1.prototype = new Sohappy();
L1.prototype.constructor = L1;
L1.prototype.start = function(data) {
	this.data = data;
	switch (data) {
		case 'art':
			this.artNav();
			break;
	}
};
L1.prototype.artNav = function() {
	var This = this;
	for (var i = 0, n = art.length; i < n; i++) {
		This.menu.prepend($("<li><b><h2>" + art[i].artist[0].cn + "</h2><h6>" + art[i].artist[0].en + "</h6></b></li>"));
	};
	This.navShow(this.nav);
	var menuItem = $('#level-1 .nav .menu ul li b');
	menuItem.hover(function() {
		This.i.stop().animate({
			top: $(this).parent().position().top
		}, 500, 'easeOutExpo');
	}, function() {
		This.i.stop().animate({
			top: $('#level-1 .nav .active').position().top
		}, 500, 'easeOutExpo');
	});
	menuItem.click(function() {
		menuItem.parent().removeClass('active');
		$(this).parent().addClass('active');
		var _index = $(this).parent().index()
		if (mobile) {
			This.nav.stop().animate({
				left: -130
			}, 300);
		}
		This.artCon(_index);
	})
	$(menuItem[0]).trigger('click');
};
L1.prototype.artCon = function(Artist_index) {
	var This = this;
	This.artIndex = (art.length - 1) - Artist_index;
	var listNum = art[This.artIndex].artist.length;
	var lineW = 0;
	var i = art[This.artIndex].artist.length - 1;
	var j = 0;
	var ha = "<div class='lines'><div class='title'><h3>";
	var hb = "</h3><h6>";
	var hc = "</h6></div><ul></ul></div>";
	This.bgc = art[This.artIndex].artist[0].bgc;
	This.aboutArtist = art[This.artIndex].artist[0].intro;
	var fs = {
		set: null,
		lineHover: function() {
			var line = This.con.find('.lines');
			line.hover(function() {
				$(this).fadeTo(200, '1');
			}, function() {
				$(this).fadeTo(200, '0.4');
			})
		},
		overLine: function(li, liW, num) {
			if (mobile) {
				lineW = lineW + liW + 5;
				//console.log(lineW + '/' + winW);
				if (lineW > (winW - 7)) {
					li.hide();
				} else {
					li.addClass('show');
				}
			} else {
				lineW = lineW + liW + 10;
				//console.log(lineW + '/' + winW);
				if (lineW > (winW - 160)) {
					li.hide();
				} else {
					li.addClass('show');
				}
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
				li.append($('<img>').attr('src', art[This.artIndex].artist[i].list[1].img[j].src));
				This.imgLoad(li);
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
				var cn = art[This.artIndex].artist[i].list[0].cn;
				var en = art[This.artIndex].artist[i].list[0].en;
				var picNum = art[This.artIndex].artist[i].list[1].img.length;
				var line = $(ha + cn + hb + en + hc).appendTo($('#level-1 .content'));
				var ul = $(line).children('ul');
				fs.listPic(ul, picNum);
			} else {
				This.goDetail();
				if (!mobile) {
					fs.lineHover()
				}
				return;
			}
		}
	};
	This.conWrap.fadeOut(200, function() {
		This.con.empty();
		This.conWrap.css('background-color', '#' + This.bgc).fadeIn(200, function() {
			fs.listCon();
		});
		s2.conWrap.css('background-color', '#' + This.bgc);
	})
};
L1.prototype.goBack = function() {
	var This = this;
	if (mobile) {
		var tog = true;
		This.menuBtn.click(function() {
			if (tog) {
				This.nav.stop().animate({
					left: 0
				}, 300);
				tog = false;
			} else {
				This.nav.stop().animate({
					left: -130
				}, 300);
				tog = true;
			}
		})
	};
	This.back.click(function() {
		This.nav.animate({
			left: -130
		}, 300, function() {
			This.mainCon.stop().animate({
				top: '0'
			}, 700, 'easeOutExpo', function() {
				s0.rote = setInterval(function() {
					s0.soChange()
				}, 5000);
				This.con.empty();
				This.menu.empty().append('<li class="h100"></li>');
			});
		})
	})
};
L1.prototype.goDetail = function() {
	var This = this;
	//console.log(this.con)
	This.con.find('.lines li img').click(function() {
		var i = $(this).parent().index();
		This.seriesIndex = ($(this).parents('.lines').index());
		var title = $(this).parents('.lines').find('.title').html();
		var pics = $(this).parent().parent().children().clone();
		This.nav.animate({
			left: -130
		}, 300, function() {
			This.mainCon.stop().animate({
				top: -winH * 2
			}, 700, 'easeOutExpo', function() {
				s2.rander(i, title, pics);
			});

		})
	})
};

function L2() {
	Sohappy.call(this);
	this.level = $('#level-2');
	this.nav = $('#level-2 .nav');
	this.picOL = $('#level-2 .nav .picOL');
	this.about = $('#level-2 .nav .about');
	this.title = $('#aboutPics');
	this.aboutArtist = $('#aboutArtist');
	this.conWrap = $('#level-2 .conWrap');
	this.con = $('#level-2 .conWrap .content ul');
	this.controlSwitch = true;
};
L2.prototype = new Sohappy();
L2.prototype.constructor = L2;
L2.prototype.rander = function(i, title, pics) {
	var This = this,
		aboutSeries = art[s1.artIndex].artist[s1.seriesIndex + 1].list[0].series;
	This.con.append(pics).append("<li class='J_about'><p>" + aboutSeries + "</p></li>").append("<li class='J_about'><p>" + s1.aboutArtist + "</p></li>");
	var pics = This.con.find('li').show(),
		currentPic = pics.eq(i),
		about = $('.J_about');
	This.con.height(winH - 22);
	if (mobile) {
		about.css('width', winW);
	} else {
		about.css('width', winW / 2);
	};
	currentPic.addClass('active');
	This.con.animate({
		left: -currentPic.position().left
	}, 500, 'easeOutExpo');
	for (var n = 0, l = pics.length; n < (l + 1); n++) {
		if (n == 0) {
			This.picOL.append("<b class='back'>BACK</b>");
		} else if (n == (l - 1)) {
			This.picOL.append("<b>ABOUT</b>");
		} else if (n == l) {
			This.picOL.append("<b>ARTIST</b>");
		} else {
			This.picOL.append("<b>" + n + "</b>");
		}
	};
	This.nav.find('.picOL b').eq(i + 1).addClass('active');
	This.control();
};
L2.prototype.control = function() {
	var This = this,
		pic = This.con.find('li'),
		nav = This.picOL.children(),
		back = $('#level-2 .nav .back');
	back.click(function() {
		This.mainCon.stop().animate({
			top: -winH
		}, 700, 'easeOutExpo', function() {
			if (!mobile) {
				s1.nav.animate({
					left: 0
				}, 300)

			}
			This.con.empty();
			This.picOL.empty();
		})
	});
	pic.each(function(i, v) {
		$(v).click(function() {
			pic.removeClass('active');
			$(v).addClass('active');
			nav.removeClass('active');
			nav.eq(i + 1).addClass('active');
			This.con.stop().animate({
				left: -$(v).position().left
			}, 300, 'easeOutExpo');
		});
		nav.eq(i + 1).click(function() {
			pic.removeClass('active');
			$(v).addClass('active');
			nav.removeClass('active');
			nav.eq(i + 1).addClass('active');
			This.con.stop().animate({
				left: -$(v).position().left
			}, 300, 'easeOutExpo');
		})
	});
	//mousewheel event
	if(!This.controlSwitch){return};
	This.level.mousewheel(function(event, delta) {
		var currentPic = This.con.find('.active'),
			currentOl = This.picOL.find('.active');
		if (delta == -1 && currentOl.next()[0]) {
			currentPic.removeClass('active').next().addClass('active');
			currentOl.removeClass('active').next().addClass('active');
			This.con.stop().animate({
				left: -currentPic.next().position().left
			}, 300, 'easeOutExpo');
		}
		if (delta == 1) {
			if (currentOl.index() == 1) {
				currentOl.removeClass('active').prev().addClass('active');
				currentOl.prev().trigger('click');
			} else {
				currentPic.removeClass('active').prev().addClass('active');
				currentOl.removeClass('active').prev().addClass('active');
				This.con.stop().animate({
					left: -currentPic.prev().position().left
				}, 300, 'easeOutExpo');
			}
		}
	});
	This.controlSwitch = false;
}
var s0 = new L0();
var s1 = new L1();
var s2 = new L2();

s0.layout();

