/**
 * Cap menu is the contextual menu of a cap. It offers options such as
 * move and pass.
 *  
 * Acts as input channel.
 * Reads gc.ongoing
 * Writes gc.ongoing
 */
var capMenu = {
    el: null,
    init: function () {

        this.el = $("#cap-menu")[0];
        this.el.selectedIndex = 0; // otherwise a blank option appears
        $capMenu = $(this.el)

        $(this.el).mousedown(function (e) {
            debug("capmenu mousedown");
            gc.ongoing.what = "cap menu click";
        });

        $(this.el).mouseup(function (e) {
            debug("capmenu mouseup");
            if (gc.ongoing.what === "cap menu click") {

                // As of jQuery 1.7.2, $("#cap-menu").val() uses depecrated techniques.
                selId = this.selectedIndex;
                if (selId >= 0) {

                    var selectedAction = this.options[selId].value;

                    switch (selectedAction) {
                    case "move":
                        gc.ongoing.what = "start move";
                        break;
                    case "pass":
                        gc.ongoing.what = "start pass";
                        break;
                    case "dribbling":
                        gc.ongoing.what = "start dribbling";
                        break;
                    }
                    capMenu.hide();
                    canvas.redraw();
                }
            }
        });

    },

    show: function (relX, relY, ballControl) {

        /*
         * if not done, the last selected option will appear as the current value,
         * even if that option has "disabled" markup and "display:none" style
         */
        this.el.selectedIndex = 0;

        $("#cap-menu-pass").attr("disabled", !ballControl);
        $("#cap-menu-dribbling").attr("disabled", !ballControl);
        $capMenu.children().each(function (index, element) {
            element.style.display = (element.disabled ? "none" : "");
        });
        $capMenu.attr("size", (ballControl ? 3 : 1));
        $capMenu.css({left: relX, top: relY}).show();
    },

    hide: function () {
        $capMenu.hide();
    }
};

var $capMenu;
