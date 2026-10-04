# Portal Clone

This context defines the language for a small first-person spatial puzzle game inspired by Portal. The project centers on readable test chambers, paired portals, and object-based puzzle progression.

## Language

**Test Chamber**:
A self-contained puzzle room that teaches or combines one spatial challenge.
_Avoid_: Level, stage, map

**Chamber Sequence**:
A short ordered set of test chambers that teaches traversal, object manipulation, and momentum in separate steps.
_Avoid_: Campaign, world, episode

**Portal Pair**:
The linked orange and blue traversal surfaces that connect two places in the same test chamber.
_Avoid_: Teleporter, gate pair, warp pair

**Portal Surface**:
A wall or floor area that can accept one side of a portal pair.
_Avoid_: Target wall, portalable wall, placement zone

**Portal Gun**:
The player-held tool that places the two sides of a portal pair.
_Avoid_: Weapon, launcher, teleport gun

**Portal Gun Capability**:
The set of portal colors the player can place in the current test chamber.
_Avoid_: Upgrade, power, ability

**Weighted Cube**:
A movable puzzle object used to hold buttons or change chamber state.
_Avoid_: Box, block, crate

**Carried Cube**:
A weighted cube held in front of the player while it remains part of the chamber physics.
_Avoid_: Inventory item, grabbed box, held block

**Pressure Button**:
A floor control that changes chamber state while a player or weighted cube holds it down.
_Avoid_: Switch, plate, trigger

**Chamber Exit**:
The goal doorway or endpoint unlocked by solving a test chamber.
_Avoid_: Finish line, level exit, goal

**Fling**:
A traversal move where the player preserves momentum through a portal pair to cross distance or height.
_Avoid_: Jump boost, launch, momentum trick

**Fling Gap**:
A visible space that can only be crossed by carrying momentum through a portal pair.
_Avoid_: Jump gap, pit, launch puzzle

**Reset Volume**:
An out-of-bounds space that returns the player or a weighted cube to a valid chamber position.
_Avoid_: Death zone, kill plane, fail area

**System Message**:
A short in-world instruction or reaction from the test facility.
_Avoid_: Narration, dialogue, tutorial text

**Portal Color Indicator**:
A minimal interface cue showing which portal colors are currently available or placed.
_Avoid_: HUD objective, status panel, ammo counter

**Chamber Selector**:
A test-only entry point that opens a specific test chamber without changing the normal chamber sequence.
_Avoid_: Level select, debug menu, cheat screen
