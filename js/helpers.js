// YouTunes Helper Methods helpers.js JavaScript Document

function formatTime(secs) {
	var mins = Math.floor(secs/60);
	secs = secs % 60;
	//Pad seconds with a zero if needed
	if (secs < 10) { secs = "0" + secs; }
	if (mins < 60) {
		return mins + ":" + secs;
	} else {
		var hours = Math.floor(mins/60);
		mins = mins % 60;
		//Pad minutes with a zero if needed
		if (mins < 10) { mins = "0" + mins; }
		return hours + ":" + mins + ":" + secs;
	}
}

function formatNumber(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1))
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	return x1 + x2;
}
