var capmenu = {
    
    el: null,
    
    init: function () {
        this.el = $("#cap-menu")[0];
        this.el.selectedIndex = 0; // otherwise a blank option appears
        $(this.el).mousedown(function (e) {
            debug("capmenu mousedown");
            ongoing.what = "cap menu click";
        });
        $(this.el).mouseup(function (e) {
            debug("capmenu mouseup");
            if (ongoing.what === "cap menu click") {
                
                // As of jQuery 1.7.2, $("#cap-menu").val() uses depecrated techniques.
                selId = this.selectedIndex;
                if (selId >= 0) {
                    
                    var selectedAction = this.options[selId].value;
                    
                    switch (selectedAction) {
                        case "move":
                            ongoing.what = "start move";
                            break;
                        case "pass":
                            ongoing.what = "start pass";
                            break;
                    }
                    capmenu.hide();
                    canvas.redraw();
                }
            }
        });
    },
    
    show: function (relX, relY, isPassVisible) {

        /*
         * if not done, the last selected option will appear as the current value,
         * even if that option has "disabled" markup and "display:none" style
         */
        this.el.selectedIndex = 0;
        
        $("#cap-menu-pass")[0].disabled = !isPassVisible;
        $capmenu.children().each(function (index, element) {
            element.style.display = (element.disabled ? "none" : "");
        });
        $capmenu.attr("size", (isPassVisible ? 2 : 1));
        $capmenu.css({left: relX, top: relY}).show();
    },
    
    hide: function () {
        $capmenu.hide();
    }
}
