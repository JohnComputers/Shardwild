# Shardwild

**Shardwild** is an original browser-first 3D voxel survival sandbox. It uses the familiar gather → craft → explore → descend → unlock → boss progression loop of the voxel-survival genre while using original names, world lore, visuals, procedural audio, UI, mobs, dimensions, structures, and code.

This project does **not** include or import Minecraft/Mojang code, textures, models, sounds, fonts, maps, logos, or other proprietary assets.

## Play

Because the project is static, it can be hosted directly on GitHub Pages.

Local run:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080` in a desktop browser. Internet access is required for the Three.js ES module loaded from UNPKG.

## Controls

| Input | Action |
|---|---|
| WASD | Move |
| Mouse | Look |
| Space | Jump / ascend while creative flying |
| Shift | Sprint |
| Ctrl | Sneak / descend while creative flying |
| Left mouse | Attack / hold to mine |
| Right mouse | Use / place / eat / drink / fire bow |
| 1–9 / wheel | Hotbar selection |
| E | Inventory + personal crafting |
| Esc | Pause |
| F3 | Debug overlay |
| C | Toggle flight in Creative worlds |

## Realms and progression

1. **Verdant Reach** — gather Oakheart timber, craft a bench and tools, mine stone/ores, smelt metals, farm and establish storage.
2. Craft **14 Rift Frames** plus a **Spark Rune**. Build a 4×5 frame (hollow 2×3 interior) and ignite it.
3. **Cinderdeep** — mine Ember Crystal and raid the generated darkstone fortress. Brimstalkers can drop an **Ember Core**.
4. Return to the Reach and craft an **Echo Compass** plus **four Void Sigils**. Locate the underground **Aster Keep**, then use the sigils on its gate frame.
5. **Aether Void** — enter the boss arena. Break all four **Void Anchors** to remove the Hollow Regent's ward, then defeat its three combat phases.
6. The victory sequence unlocks continued sandbox play and a return gate.

## Implemented systems

- Deterministic seeded chunk terrain; chunks are generated around the player and unloaded outside render distance.
- Per-chunk buffer geometry with hidden-face culling; separate transparent geometry; Three.js frustum culling.
- Delta-based persistent terrain edits so untouched chunks do not have to be saved.
- 87 registered block types and 134 item/block-item entries.
- 33 crafting recipes and data-driven item/block/recipe registries.
- Seven overworld biomes, caves, ravines/cavities, rivers, oceans, ores, vegetation, ruins, underground endgame keep, Cinderdeep fortress, and Void arena.
- Three independent procedural dimensions: Verdant Reach, Cinderdeep, Aether Void.
- First-person movement, gravity, collisions, sprinting, sneaking, swimming, fall damage, drowning, suffocation and lava damage.
- Survival and Creative modes, health, hunger, armor, XP/levels, death, drops, respawn points and creative flight.
- Tool tiers, mining speed, durability, swords, axes, picks, shovels, hoes, shields and bow/arrow projectiles.
- 36-slot inventory + 9-slot hotbar, stack limits, splitting, armor/equipment slots, crates and dropped-item pickup entities.
- Personal/bench crafting, furnace smelting and fuels, alchemical draught brewing, rune upgrading.
- Tilling, planting, crop growth, harvesting, fishing and renewable food/resource loops.
- 16 entity archetypes including passive creatures, melee/ranged/explosive/teleporting/flying/aquatic archetypes, Cinderdeep enemies, guard/trader archetypes, Void enemies and a final boss.
- AI wandering, chasing, fleeing, ranged attacks, explosions, simple terrain-aware navigation, spawning/despawning constraints and drops.
- Original Pulse automation blocks: conductors, levers, lamps, gates and pistons, plus data entries for delays/comparators/sensors/plates/hoppers/dispensers.
- Simplified falling sand/gravel, liquid downward spread, crop random ticks and destructive explosions.
- Day/night cycle, weather state, rain particles, fog, realm ambience and procedural WebAudio effects.
- World browser, world creation/seed/mode, HUD, crosshair, hotbar, inventory/crafting, furnace, containers, settings, death screen, boss HUD, victory/credits and continue-after-win.
- Autosave to `localStorage`: player state, inventory/equipment, status effects, terrain deltas, block entities, time/weather and victory state.

## Architecture

- `src/config.js` — BlockRegistry, ItemRegistry, recipes, smelting, biomes, mob definitions, dimensions and controls.
- `src/noise.js` — deterministic seeded hash/value noise + FBM utilities.
- `src/world.js` — WorldManager, chunk generation/streaming, biome terrain, structure generation, meshing, block edits, portal frame activation and random block ticks.
- `src/entities.js` — EntityManager, mob models/AI, spawning, combat projectiles, item drops and Hollow Regent boss state machine.
- `src/systems.js` — InventorySystem, CraftingSystem, SmeltingSystem, StatusEffectSystem, SaveSystem, AudioManager and SignalSystem.
- `src/game.js` — PlayerController, combat/mining interaction, dimension travel, game state, survival rules, UI/controller wiring and main loop.

The architecture is intentionally data-driven: most additional blocks/items/recipes/mobs can be added in `config.js` without modifying the renderer or inventory code.

## Performance notes

- World generation is bounded to a configurable circular chunk radius and processed from a nearest-first generation queue.
- Blocks are **not** individual scene objects. Each chunk is meshed into consolidated `BufferGeometry` with occluded faces removed.
- Transparent geometry is separated from opaque geometry.
- Distant chunks are disposed and entity counts are capped.
- Changed blocks remesh only their current chunk and boundary neighbors when necessary.
- Default render distance is 3 chunks; settings allow 2–6.

## Automated checks

```bash
npm test
```

The smoke test verifies minimum content counts, deterministic seeded noise, inventory/crafting behavior, pre-Cinder portal reachability, Void-gate progression resources, and furnace output.

Current smoke-test baseline:

- 87 blocks
- 134 registered items/block-items
- 33 recipes
- 16 mob archetypes
- 7 overworld biomes

## GitHub Pages

The repository is designed for branch-based GitHub Pages hosting from the `main` branch and repository root (`/`). No build step is required.

## Browser requirements

Desktop Chromium, Edge, Firefox or Safari with WebGL and Pointer Lock support. Keyboard + mouse strongly recommended.

## License

MIT for the project code. Three.js is loaded from UNPKG and is distributed under its own MIT license.
