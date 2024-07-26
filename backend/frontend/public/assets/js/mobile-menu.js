$("body").append('<div class="sidebar-overlay"></div>');
$(document).on("click", "#mobile_btn", function () {
  $("main-wrapper").toggleClass("slide-nav");
  $(".sidebar-overlay").toggleClass("opened");
  $("html").addClass("menu-opened");
  return false;
});

$(document).on("click", ".sidebar-overlay", function () {
  $("html").removeClass("menu-opened");
  $(this).removeClass("opened");
  $("main-wrapper").removeClass("slide-nav");
});

$(document).on("click", "#menu_close", function () {
  $("html").removeClass("menu-opened");
  $(".sidebar-overlay").removeClass("opened");
  $("main-wrapper").removeClass("slide-nav");
});
