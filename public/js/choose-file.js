// upload file name appear on uploading input
$("#image").on("change", function() {
  var fileName = $(this).val().split("\\").pop();;
  $(this).next('.form-control-file').addClass("selected").html(fileName);
});