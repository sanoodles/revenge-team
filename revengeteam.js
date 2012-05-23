var ongoing = "";

// initialization
$(document).ready(function() {
    var $c = $('#c');
    var ctx = $c[0].getContext('2d');

    // campo
    ctx.beginPath();
    ctx.rect(0, 0, 524, 380);
    ctx.fillStyle = '#009000';
    ctx.fill();
    
    // chapa
    ctx.beginPath();
    ctx.arc(75, 75, 10, 0, Math.PI * 2, true); 
    ctx.closePath();
    ctx.fillStyle = '#000090';
    ctx.fill();
    
    // click
    $c.mousedown(function() {
        if () {
            ongoing = "move";
        }
    });
    $c.mouseup(function(){draw = false;});
    $c.mousemove(function(e) {
        if(draw==true){
                ctx.lineWidth = 15;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(e.pageX,e.pageY);
                ctx.lineTo(e.pageX+1,e.pageY+1);
                ctx.stroke();
        }    
   });

});
