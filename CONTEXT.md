# Portal Clone

This context defines the language for a small first-person spatial puzzle game inspired by Portal. The project centers on readable test chambers, paired portals, and object-based puzzle progression.

## Language

**Test Chamber**:
A self-contained puzzle room that teaches or combines one spatial challenge.
_Avoid_: Level, stage, map

**Portal Pair**:
The linked orange and blue traversal surfaces that connect two places in the same test chamber.
_Avoid_: Teleporter, gate pair, warp pair

**Portal Surface**:
A wall or floor area that can accept one side of a portal pair.
_Avoid_: Target wall, portalable wall, placement zone

**Portal Gun**:
The player-held tool that places the two sides of a portal pair.
_Avoid_: Weapon, launcher, teleport gun

**Weighted Cube**:
A movable puzzle object used to hold buttons or change chamber state.
_Avoid_: Box, block, crate

**Pressure Button**:
A floor control that changes chamber state while a player or weighted cube holds it down.
_Avoid_: Switch, plate, trigger

**Chamber Exit**:
The goal doorway or endpoint unlocked by solving a test chamber.
_Avoid_: Finish line, level exit, goal

**Fling**:
A traversal move where the player preserves momentum through a portal pair to cross distance or height.
_Avoid_: Jump boost, launch, momentum trick
