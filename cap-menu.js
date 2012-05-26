var capmenu = {
    el: null,
    items: {
        move: {
            visible: true
        },
        pass: {
            visible: false
        }
    },
    init: function () {
        this.el = $("#cap-menu")[0];

        $(this.el).mousedown(function (e) {
            debug("capmenu mousedown");
            ongoing = "cap menu click";
        });
        $(this.el).mouseup(function (e) {
            debug("capmenu mouseup");
            if (ongoing === "cap menu click") {
                ongoing = "start move";
                capmenu.hide();
                redraw();
            }
        });

    },
    show: function (relX, relY) {
        $(this.el).css({left: relX, top: relY}).show();
    },
    hide: function () {
        $(this.el).hide();
    }
}
