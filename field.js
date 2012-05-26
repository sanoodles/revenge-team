const FIELD_HEIGHT = 480;
const FIELD_WIDTH = FIELD_HEIGHT * 1.4;
const FIELD_MARGIN_H = 20;
const FIELD_MARGIN_V = 20;

var field = {
    
    el: null,
    
    init: function () {
        this.el = $("#c")[0];

        // field size
        $(this.el).attr({
            width: FIELD_MARGIN_H + FIELD_WIDTH + FIELD_MARGIN_H,
            height: FIELD_MARGIN_V + FIELD_HEIGHT + FIELD_MARGIN_V
        });

        $(this.el).mousedown(function (e) {
            debug("field mousedown");

            // hide cap menu
            if (ongoing === "cap menu choose") {
                capmenu.hide();
            }

            var offset = $(this).offset();
            var relX = e.pageX - offset.left;
            var relY = e.pageY - offset.top;

            // show cap menu
            if (getElementByCoords(relX, relY) !== null) {
                if (ball.poss === null) {
                    
                } else {

                }
                capmenu.show(relX, relY);
                ongoing = "cap menu choose";
            }
        });
        
    }

}
