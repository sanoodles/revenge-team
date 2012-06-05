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
    }
}
