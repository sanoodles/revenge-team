/**
 * Generic Command Controller
 * @desc Common attributes and methods for client and server command
 * controllers
 * @resp Reads and writes the models
 * @resp Receives the game variables from the command controller
 * @resp Updates the model
 * @resp Calls the graphic controller back
 */

if (typeof CLIENT_SIDE === 'undefined') {
    var field       = require('./public/models/model.field.js').field,
        Team        = require('./public/models/model.team.js').Team,
        Cap         = require('./public/models/model.cap.js').Cap,
        Ball        = require('./public/models/model.ball.js').Ball,
        PreviewBall = require('./public/models/model.ball.js').PreviewBall,
        app         = require('./public/models/model.app.js').app;
}

function CommandController () {
    
    this.genericInit = function () {
        // app initialization
        app.caps[0] = new Cap(0, field.getRandomX(), field.getRandomY(), Team.LOCAL);
        app.caps[1] = new Cap(1, field.getRandomX(), field.getRandomY(), Team.LOCAL);
        app.caps[2] = new Cap(2, field.getRandomX(), field.getRandomY(), Team.VISITOR);
        app.caps[3] = new Cap(3, field.getRandomX(), field.getRandomY(), Team.VISITOR);
        app.ball = new Ball(field.getRandomX(), field.getRandomY());
    };

     /**
      * @param st {JSON} Game variables status
      */
    this.setStatus = function (st) {
        app.ball.setPosition(st.ball.x, st.ball.y);
    };

    this.move = function (capId, x, y) {            
        var cap = app.getCapById(capId);
        /*
         * TODO: checking whether can put cap on coords
         * because the client can't be trusted
         */
        cap.setPosition(x, y);

        // set possession
        if (cap.isCapOverTheBall()) {
            app.possession.give(cap);
        }

    };

      /**
       * @pre ball.poss is the cap passing
       */
    this.pass = function (x, y) {
        distanceInRedZone = app.pass.getDistanceInRedZone(x, y);

        // pass to green zone
        if (distanceInRedZone <= 0) {
            app.ball.x = x;
            app.ball.y = y;

            // if the pass is to green area but inside an enemy tackle area
            // he fights for it, so a 20 dice roll will decide if the
            // ball final position, is a desired by the possesion team
            // or distorted by the D team
            var tacklerPlayer = app.pass.insideTackleArea(app.ball.x, app.ball.y);
            if (tacklerPlayer instanceof Cap) {
                // desired player receiver (if exists)
                cap = field.getElementByCoords(app.ball.x, app.ball.y);

                // the desired final position is a cap
                if (cap instanceof Cap) {

                    possDice = Math.random()*20 + cap.control;
                    // his dice multiplied by 0.75 to give advg the to the A team in
                    // green area
                    tacklerDice = (Math.random()*20 + tacklerPlayer.tackle)*0.75;
                    tackleRes = possDice - tacklerDice;

                    if (tackleRes < 0 && tackleRes > -5) { //slight deflection by defender
                        app.ball.x = x + Math.random() * tacklerPlayer.tackle * 2;
                        app.ball.y = y + Math.random() * tacklerPlayer.tackle * 2;
                    } else if (tackleRes < -5) { //strong deflection, defender wins possesion
                        app.ball.x = tacklerPlayer.x;
                        app.ball.y = tacklerPlayer.y;
                    }
                } else { // there is no cap receiver, "pass to space"

                    var controlPlayer = app.pass.insideControlArea(app.ball.x, app.ball.y);

                    // if the ball is inside the control area of an A player
                    // both the A player and the D player fight for it
                    if (controlPlayer instanceof Cap) {
                        controlDice = Math.random()*20 + controlPlayer.control;
                        tacklerDice = Math.random()*20 + tacklerPlayer.tackle;
                        tackleRes = controlDice - tacklerDice;

                        if (tackleRes < 0) { //deflaction by D player
                            app.ball.x = x + Math.random() * tacklerPlayer.tackle * 2;
                            app.ball.y = y + Math.random() * tacklerPlayer.tackle * 2;
                        }
                    } else { //only under D player tackle area, 100% deflaction
                        randomDice = Math.random() * 20;
                        if (randomDice < tacklerPlayer.tackle) {
                            app.ball.x = tacklerPlayer.x;
                            app.ball.y = tacklerPlayer.y;
                        } else { // dont gain control, more deflaction
                            app.ball.x = x + Math.random() * tacklerPlayer.tackle * 2;
                            app.ball.y = y + Math.random() * tacklerPlayer.tackle * 2;
                    }
                    }
                }
            }

        // pass to red zone
        } else {
            randomFactor = Math.log(distanceInRedZone);
            app.ball.x = x + (Math.random()*randomFactor*2-randomFactor)*20;
            app.ball.y = y + (Math.random()*randomFactor*2-randomFactor)*20;

            // in red zone, if after the random deflaction the ball lays
            // over a D player, he can add more deflaction or gain control

            // first we consider the case where the ball lays in both
            // D tackler area and A control area. same code as before
            var tacklerPlayer = app.pass.insideTackleArea(app.ball.x, app.ball.y);

            if (tacklerPlayer instanceof Cap) {
                var controlPlayer = app.pass.insideControlArea(app.ball.x, app.ball.y);
                if (controlPlayer instanceof Cap) { //lays in both control area
                        controlDice = Math.random()*20 + controlPlayer.control;
                        tacklerDice = Math.random()*20 + tacklerPlayer.tackle;
                        tackleRes = controlDice - tacklerDice;
                        if (tackleRes < 0) {
                            app.ball.x = x + Math.random() * tacklerPlayer.tackle * 2;
                            app.ball.y = y + Math.random() * tacklerPlayer.tackle * 2;
                        }
                } else { //lays only in tackler area, the D player can gain control
                    randomDice = Math.random() * 20;
                    if (randomDice < tacklerPlayer.tackle) {
                        app.ball.x = tacklerPlayer.x;
                        app.ball.y = tacklerPlayer.y;
                    } else { // dont gain control, more deflaction
                        app.ball.x = x + Math.random() * tacklerPlayer.tackle * 2;
                        app.ball.y = y + Math.random() * tacklerPlayer.tackle * 2;
                    }
                }
            }
        }

        // arrived to other cap
        cap = field.getElementByCoords(app.ball.x, app.ball.y);
        if (cap instanceof Cap) {
            app.possession.give(cap);
        } else {
            app.possession.clear();
        }
    };
};

if (typeof CLIENT_SIDE === 'undefined') exports.CommandController = CommandController;
