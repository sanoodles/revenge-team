var User = function (id) {
    var _id = id,
        _team = null;

    return {
        id: _id,
        team: _team
    }
}

if (typeof CLIENT_SIDE === 'undefined') exports.User = User;
