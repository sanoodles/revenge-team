Note to editors: This file is marked up using
http://en.wikipedia.org/wiki/Markdown

# Revenge Team rule book

## Move

The distance that a cap can move within a turn is influenced by its
speed skill.

## Pass

The pass range of a cap is influenced by the pass skill.

The angle of the pass cone of a cap is influenced by the talent skill.

The pass range is limited by the presence of a rival cap in the pass cone.

A pass is attempted from a passing cap to a target point.

An ongoing pass has a green zone (near pass) and a red zone (far pass).

If made to the green zone, the ball will arrive to the exact previewed target point.

If made to the red zone, the ball final position will be distorted by an error,
that is larger as the pass is attempted farther.

When the user selects pass, for all rivals, a circle will appear. Its
radio is influenced by the defense skill. For all teammates a circle will appear
based on the control skill.

Inside the green area, if the aiming point is not covered by any defender area, the
ball will end in that exact point.

Inside the green area, if the A team aims to another A player and this new player lays
inside the "defense" area, based on a roll dice (0.75 factor to the D): the ball will arrive
to the A player, it will be deflected or the D player will recover it. This roll dice is based
on the control skill for the A player, and the tackle skill for the D player.

Inside the green area, when the A team aims to a point where there is not an A player. If point
is covered by both a D area and a A area, a roll dice (1 factor for both), tackle vs control.
If A player wins, the ball will arrive where directed, otherwise it will be more deflected.
If the point is only covered by a D player area, a random 20 dice will be rolled. If the
tackle skill is > roll, D gains control. Otherwise more deflection.

Inside the red area, after the random factor applied to any pass in the red area, if it lays only
inside a D area, a 20 dice is rolled. if tackle skill > roll, D gains control, otherwise more deflection.
If it lays inside A area and D area, a roll dice tackle vs control. If D wins, more deflection.

## Dribbling

A cap with ball possession can dribble another cap in his control area. The control area is defined by
the control skill. The player chooses the cap to dribble inside his own cap control area.

In order to dribble, the "dribble" skill is compared to the "tackle" skill, rolling a dice.

If the dribbling cap loses, the tackling cap gains ball possession.

If the dribbling cap wins, the tackling cap is stunned for 1 turn.

When a cap is stunned, it doesn't interfere in any of the other attacking actions, like pass, shoot,...

## Tackle

All defensive players can tackle the opposing player that controls the ball if it is inside their
defensive area.

A roll dice is done comparing defensive tackle skill vs offensive dribbling skill.

If defender wins, he gains the ball. Otherwise he will be stunned for 1 turn.

## Cover

A defensive player can cover an offensive player. While the D player covers the A player, the cap
will follow automatically the A player wherever it goes.

Visually, the cover is marked in the canvas by a line between both caps.

This movement is bounded by the D speed parameter. If the A player moves more than what the D player
can move, the D player will only move a fraction.

If the distance between the A player and the D player that is covering A is bigger than the D
defense skill, the cover is broken.

When the cap A moves the cap D follows it automatically, but if the end cap position would
place if over another cap, the D cap won't move. This is called "block".

Only D caps can cover. When the D team recovers the possesion, all the covers are broken.