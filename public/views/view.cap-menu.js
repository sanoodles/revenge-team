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

        $(this.el).click(function (e) {
            debug("capmenu click");
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
                    case "tackle":
                        gc.ongoing.what = "start tackle";
                        break;
                    case "cover":
                        gc.ongoing.what = "start cover";
                        break;
                    }
                    capMenu.hide();
                    canvas.redraw();
                }
            }
        });

    },

    /*
    * ballControl -> if the cap clicked has the ball
    * teamPossession -> if the cap clicked team has the ball
    */
    show: function (relX, relY, ballControl, teamPossession) {

        /*
         * if not done, the last selected option will appear as the current value,
         * even if that option has "disabled" markup and "display:none" style
         */
        this.el.selectedIndex = 0;

        $("#cap-menu-pass").attr("disabled", !ballControl);
        $("#cap-menu-dribbling").attr("disabled", !ballControl);
        $("#cap-menu-tackle").attr("disabled", teamPossession);
        $("#cap-menu-cover").attr("disabled", teamPossession);
        $capMenu.children().each(function (index, element) {
            element.style.display = (element.disabled ? "none" : "");
        });
        var menuSize;
        if (ballControl) {
            menuSize = 3;
        } else if (!teamPossession) {
            menuSize = 3;
        } else {
            menuSize = 1;
        }
        $capMenu.attr("size", menuSize);
        $capMenu.css({left: relX, top: relY}).show();
    },

    hide: function () {
        $capMenu.hide();
    }
};

var $capMenu;
