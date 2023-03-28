$("button.btn-secondary").on("click", function () {
  if ($("div#graph").css("visibility") == "visible") {
    $("div#graph").css("visibility", "hidden");
    $("button.btn-secondary").text("Display");
  } else {
    $("div#graph").css("visibility", "visible");
    $("button.btn-secondary").text("Hide");
  }
});
