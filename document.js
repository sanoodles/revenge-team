function documentInit () {

    $(document).mousemove(function (e) {
        debug("document mousemove");
        
        if (ongoing == "start move" || ongoing == "moved") {

            var fieldOffset = $field.offset();
            var mouseX = e.pageX - fieldOffset.left;
            var mouseY = e.pageY - fieldOffset.top;
            var mouseXDiff = mouseX - cap.x;
            var mouseYDiff = mouseY - cap.y;
            var ang = angle(cap, {x: mouseX, y: mouseY});
            var maxXDiff = cap.maxRange() * Math.sin(ang);
            var maxYDiff = -1 * cap.maxRange() * Math.cos(ang);
            var XDiff;
            var YDiff;
            
            // moving right
            if (mouseXDiff >= 0) {
                XDiff = Math.min(mouseXDiff, maxXDiff);
                capPreview.x = Math.min(cap.x + XDiff, FIELD_MARGIN_H + FIELD_WIDTH);
            // moving left    
            } else {
                XDiff = Math.max(mouseXDiff, maxXDiff);
                capPreview.x = Math.max(cap.x + XDiff, FIELD_MARGIN_H);
            }

            // moving down
            if (mouseYDiff >= 0) {
                YDiff = Math.min(mouseYDiff, maxYDiff);
                capPreview.y = Math.min(cap.y + YDiff, FIELD_MARGIN_V + FIELD_HEIGHT);
            // moving up
            } else {
                YDiff = Math.max(mouseYDiff, maxYDiff);
                capPreview.y = Math.max(cap.y + YDiff, FIELD_MARGIN_V);                
            }
            
            redraw();

            ongoing = "moved";
        }
    });

    $(document).mouseup(function (e) {
        debug("document mouseup");

        // change cap position
        if (ongoing == "moved") {
            cap.x = capPreview.x;
            cap.y = capPreview.y;
            ongoing = "";

            // set possession
            if (isCapOverTheBall(cap)) {
                setPossession(cap);
            }
            
            redraw();
        }
    });
        
}
