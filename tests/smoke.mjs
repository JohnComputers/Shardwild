import assert from 'node:assert/strict';
import {BLOCKS,ITEM_BY_ID,RECIPES,MOB_TYPES,BIOMES,SMELTS} from '../src/config.js';
import {seedFromString,fbm2,fbm3} from '../src/noise.js';
import {InventorySystem,CraftingSystem,SmeltingSystem} from '../src/systems.js';

assert.ok(BLOCKS.length >= 50, `expected 50+ blocks, got ${BLOCKS.length}`);
assert.ok(ITEM_BY_ID.size >= 40, `expected 40+ items, got ${ITEM_BY_ID.size}`);
assert.ok(RECIPES.length >= 15, `expected 15+ recipes, got ${RECIPES.length}`);
assert.ok(Object.keys(MOB_TYPES).length >= 10, 'expected 10+ mobs');
assert.ok(BIOMES.length >= 6, 'expected 6+ biomes');
const seed=seedFromString('Shardwild validation');
assert.equal(seed,seedFromString('Shardwild validation'));
assert.equal(fbm2(1.2,9.7,seed),fbm2(1.2,9.7,seed));
assert.notEqual(fbm3(2,4,6,seed),fbm3(2,4,6,seed+1));

const inv=new InventorySystem();
assert.equal(inv.add('block_8',2),0);
assert.equal(inv.add('block_10',16),0);
assert.equal(inv.add('stick',8),0);
const craft=new CraftingSystem(inv);
assert.equal(craft.craft('wood_pick',false),true);
assert.equal(inv.count('wood_pick'),1);
assert.equal(craft.craft('bench',false),true);
assert.equal(inv.count('block_28'),1);

const prog=new InventorySystem();
for (const [id,n] of [['cobble',28],['iron_ingot',8],['azurite',8],['flint',1]]) prog.add(id,n);
const pc=new CraftingSystem(prog);
for(let i=0;i<7;i++) assert.equal(pc.craft('riftframe',true),true,'rift frame recipe must be reachable pre-Cinderdeep');
assert.equal(prog.count('block_41'),14,'4x5 portal frame requires 14 edge blocks');
assert.equal(pc.craft('spark',true),true,'spark rune must be reachable pre-Cinderdeep');

const endInv=new InventorySystem();
for (const [id,n] of [['ember_core',4],['ember_crystal',8],['gold_ingot',4]]) endInv.add(id,n);
const ec=new CraftingSystem(endInv);
for(let i=0;i<4;i++) assert.equal(ec.craft('voidsigil',true),true);
assert.equal(endInv.count('void_sigil'),4);

const f={type:'furnace',input:{id:'raw_iron',count:1},fuel:{id:'coal',count:1},output:null,burn:0,progress:0};
for(let i=0;i<20;i++)SmeltingSystem.tick(f,.5);
assert.equal(f.output?.id,'iron_ingot');
assert.equal(f.output?.count,1);
assert.ok(SMELTS.starshard,'late-game refining recipe missing');

console.log(`PASS blocks=${BLOCKS.length} items=${ITEM_BY_ID.size} recipes=${RECIPES.length} mobs=${Object.keys(MOB_TYPES).length} biomes=${BIOMES.length}`);
