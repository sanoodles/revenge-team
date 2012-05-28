var capmenu = {
    
    el: null,
    
    init: function () {
        this.el = $("#cap-menu")[0];
        this.el.selectedIndex = 0; // otherwise a blank option appears

        $(this.el).mousedown(function (e) {
            debug("capmenu mousedown");
            ongoing = "cap menu click";
        });
        $(this.el).mouseup(function (e) {
            debug("capmenu mouseup");
            if (ongoing === "cap menu click") {

                // As of jQuery 1.7.2, $("#cap-menu").val() uses depecrated techniques.
                selId = this.selectedIndex;
                if (selId >= 0) {
                    
                    var selectedAction = this.options[selId].value;
                    
                    switch (selectedAction) {
                        case "move":
                            ongoing = "start move";
                            break;
                        case "pass":
                            ongoing = "start pass";
                            break;
                    }
                    capmenu.hide();
                    canvas.redraw();
                }
            }
        });

    },
    
    show: function (relX, relY, showPass) {

        /*
         * otherwise the last selected option will appear as the current value,
         * even if that option is disabled and display:none'd
         */
        this.el.selectedIndex = 0;
        
        $("#cap-menu-pass")[0].disabled = !showPass;
        $capmenu.children().each(function (index, element) {
            element.style.display = (element.disabled ? "none" : "");
        });
        $capmenu.attr("size", (showPass ? 2 : 1));
        $capmenu.css({left: relX, top: relY}).show();
    },
    
    hide: function () {
        $capmenu.hide();
    }
}
