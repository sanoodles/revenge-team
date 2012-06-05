/**
 * Initialization after all resources have been downloaded
 */
$(window).load(function () {

    // models initialization
    field.init();
    capmenu.init();

    // views initialization
    documentInit();

    // app initialization
    $field = $(field.el);
    $capmenu = $(capmenu.el);
    ctx = field.el.getContext('2d');
    capmenu.hide();
    for (var i = 0, max = 2; i < max; i++) {
        caps[i] = new Cap(i);
    }

    // first screen paint
    canvas.redraw();
});
