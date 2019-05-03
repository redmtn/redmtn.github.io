var dir = "https://drive.google.com/drive/folders/1FFaC7lFJoDKO1pNgE8imGrqTwcP_bj4Q?usp=sharing";
var fileextension = ".css";
$.ajax({
	//This will retrieve the contents of the folder if the folder is configured as 'browsable'
	url: dir,
	success: function(data) {
		//Lsit all png file names in the page
		$(data).find("a:contains(" + fileextension + ")").each(function() {
			var filename = this.href.replace(window.location.host, "").replace("http://", "").replace("https://", "");
			console.log(filename);
			filename = filename.split("/").pop();
			$("body").append($("<a href=" + dir + filename + ">" + filename + "</a>"));
		});
	});
}
});