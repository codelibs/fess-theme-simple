$(function(){$('input[type="text"],select,textarea',".login-box,section.content").first().focus();$(".form-group .has-error").first().next("input,select,textarea").focus();$("section.content input").keypress(function(b){if(b.which===13){var a=$("input#submit, button#submit");if(a.length>0){a[0].submit()}return false}});$(".table tr[data-href]").each(function(){$(this).css("cursor","pointer").hover(function(){$(this).addClass("active")},function(){$(this).removeClass("active")}).click(function(){document.location=$(this).attr("data-href")})});$("#confirmToDelete").on("show.bs.modal",function(d){var c=$(d.relatedTarget);var b=c.data("docid");var e=c.data("title");var a=c.data("url");$(this).find(".modal-body #delete-doc-title").text(e);$(this).find(".modal-body #delete-doc-url").text(a);$(this).find(".modal-footer input#docId").val(b)})});