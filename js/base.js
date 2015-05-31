onResize();
detectMobile()
window.onresize = onResize;
function onResize() {
    winH = $(window).height();
	winW = $(window).width();
};
function detectMobile() {
	var mob = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i);
	if (mob != null) {
		mobile = true;
		$("body").attr('id',"mobile");
	} else {
		mobile = false;
	}
};
