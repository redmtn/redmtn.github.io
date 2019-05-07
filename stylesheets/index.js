function checkVisible(elm, evalType) {
	evalType = evalType || "visible";

	var vpH = $(window).height(), // Viewport Height
		st = $(window).scrollTop(), // Scroll Top
		y = $(elm).offset().top,
		elementHeight = $(elm).height();

	if (evalType === "visible") return ((y < (vpH + st)) && (y > (st - elementHeight)));
	if (evalType === "above") return ((y < (vpH + st)));
}

function sendMessage(msg, iframeEl) {
	iframeEl.contentWindow.postMessage(msg, '*');
};
var iframeStatus = [];
window.onload = function() {
	var iframes = document.getElementsByTagName("iframe");
	for (var i = 0; i < iframes.length; i++) {
		iframeStatus.push("loaded");
	}
	console.log(iframeStatus);
	$(window).on('DOMContentLoaded load resize scroll', function() {
		for (var i = 0; i < iframes.length; i++) {
			if (checkVisible(iframes[i]) === false && iframeStatus[i] === "loaded") {
				sendMessage("unload", iframes[i]);
				iframeStatus[i] = "unloaded";
				console.log(iframeStatus[i] + " " + i);
			}
			if (checkVisible(iframes[i]) === true && iframeStatus[i] === "unloaded") {
				sendMessage("load", iframes[i]);
				iframeStatus[i] = "loaded";
				console.log("loaded IFrame " + i);
			}
		}
	});
}