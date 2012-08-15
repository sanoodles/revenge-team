var User = function (id) {
    // @see http://javascript.crockford.com/private.html

    // @section private
    var _team = null,
        that = this; // because inside of a function, "this" refers to the function

    // @section public
    this.id = id;
    
    this.getTeam = function () {
        return _team;
    }

    this.setTeam = function (team) {
        _team = team;
    }

    this.getStatus = function () {
        return {
            id: that.id,
            team: _team
        };
    }
}

if (typeof CLIENT_SIDE === 'undefined') exports.User = User;
