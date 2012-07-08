function Team() {}
Team.LOCAL = 1;
Team.VISITOR = 2;

if (typeof CLIENT_SIDE === 'undefined') exports.Team = Team;
