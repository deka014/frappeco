$(document).ready(function(){

var pageUrl = encodeURIComponent(document.URL);
var tweet = encodeURIComponent($("meta[name='description']").attr("content"));	
	
function socialWindow(url) {
    var left = (screen.width - 570) / 2;
    var top = (screen.height - 570) / 2;
    var params = "menubar=no,toolbar=no,status=no,width=570,height=570,top=" + top + ",left=" + left;
    window.open(url,"NewWindow",params);
}

    
    $(".social-share-fb").on("click", function() {
        url = "https://www.facebook.com/sharer.php?u=" + pageUrl;
		// alert(url)
        socialWindow(url);
    });

    $(".social-share-twitter").on("click", function() {
        url = "https://twitter.com/intent/tweet?url=" + pageUrl + "&text=" + tweet;
        socialWindow(url);
    });

    $(".social-share-linkedin").on("click", function() {
        url = "https://www.linkedin.com/shareArticle?mini=true&url=" + pageUrl;
        socialWindow(url);
    })


});

//  $(document).ready(function(){
// 	 var pageUrl = encodeURIComponent(document.URL);
// 	 url = "https://www.facebook.com/sharer.php?u=" + pageUrl;
//     $(".fb-button").attr("href", url);
// });