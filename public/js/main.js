$("button.btn-secondary").on("click", function () {
    if ($("div#graph").css("visibility")==="hidden")
    { $("div#graph").css("visibility", "visible"); }
    else {$("div#graph").css("visibility", "hidden"); }
});
