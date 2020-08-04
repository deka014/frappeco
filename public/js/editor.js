$(document).ready(function() {
    // $('#summernote').summernote();
	$( document ).ajaxStart(function() {
    $( "#overlay" ).fadeIn(300);
	});
	
	$( document ).ajaxComplete(function() {
    $( "#overlay" ).fadeOut(300);
	});
	
	
    $('#summernote').summernote({
        height: 400,   
        focus: true,
		toolbar: [
  ['style', ['style']],
  ['font', ['bold', 'underline', 'clear']],
  ['fontname', ['fontname']],
  ['color', ['color']],
  ['para', ['ul', 'ol', 'paragraph']],
  ['table', ['table']],
  // ['insert', ['link', 'picture', 'video','videoAttributes','media','link','hr']],
	 ['insert', ['link', 'picture', 'video','link']],

  ['view', ['fullscreen', 'codeview', 'help']]
],
        callbacks: {                                        
            onImageUpload : function(file, editor, welEditable) {
                saveFile(file[0], editor, welEditable);
            }
        }
    })

    function saveFile(file, editor, welEditable){
        data = new FormData();
        data.append("file", file);
        $.ajax({
            data: data,
            type: "POST",
            url: "/save",
            cache: false,
            contentType: false,
            processData: false,
            success: function(url) {
                // console.log(url)
                // editor.insertImage(welEditable, url);
				$('#summernote').summernote('insertImage', url);
            }
        });
    }
});



