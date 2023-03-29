$("button.btn-secondary").on("click", function () {
  if ($("div#graph").css("visibility") == "hidden") {
    $("div#graph").css("visibility", "visible");
    $("div#graph").slideDown();
    $("button.btn-secondary").text("Display");
  } else {
    $("div#graph").slideToggle();
    $("button.btn-secondary").text("Hide");
  }
});
