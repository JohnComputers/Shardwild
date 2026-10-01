export const GAME_NAME = 'Shardwild';
export const VERSION = '0.9.0-web';
export const CHUNK_SIZE = 16;
export const WORLD_HEIGHT = 64;
export const SEA_LEVEL = 24;
export const SAVE_PREFIX = 'shardwild-world-';

const b = (id, name, color, props={}) => ({id,name,color,hardness:1,solid:true,transparent:false,drop:id,tool:null,tier:0,light:0,gravity:false,flammable:0,liquid:false,...props});

export const BLOCKS = [
  b(0,'Air',0x000000,{solid:false,transparent:true,drop:null,hardness:0}),
  b(1,'Meadow Turf',0x5c9a52,{hardness:.6,tool:'shovel'}), b(2,'Loam',0x73523b,{hardness:.5,tool:'shovel'}),
  b(3,'Stone',0x777b82,{hardness:1.6,tool:'pick',tier:1,drop:'cobble'}), b(4,'Cobble',0x676b70,{hardness:1.8,tool:'pick',tier:1}),
  b(5,'Dune Sand',0xd7c58a,{hardness:.5,tool:'shovel',gravity:true}), b(6,'Gravel',0x8c867e,{hardness:.6,tool:'shovel',gravity:true}),
  b(7,'Clay',0x9aa7b5,{hardness:.7,tool:'shovel'}), b(8,'Oakheart Log',0x6f4b2d,{hardness:1.7,tool:'axe',flammable:4}),
  b(9,'Oakheart Leaves',0x3f7841,{hardness:.25,solid:true,transparent:true,flammable:8}), b(10,'Oakheart Planks',0xb07843,{hardness:1.5,tool:'axe',flammable:6}),
  b(11,'Pine Log',0x6b4d35,{hardness:1.7,tool:'axe',flammable:4}), b(12,'Pine Needles',0x2d6442,{hardness:.25,transparent:true,flammable:8}), b(13,'Pine Planks',0x9a6c46,{hardness:1.5,tool:'axe',flammable:6}),
  b(14,'Palm Log',0x86613b,{hardness:1.7,tool:'axe',flammable:4}), b(15,'Palm Fronds',0x4a9344,{hardness:.25,transparent:true,flammable:8}), b(16,'Palm Planks',0xb98a55,{hardness:1.5,tool:'axe',flammable:6}),
  b(17,'Clearglass',0xbfe5e8,{hardness:.4,transparent:true}), b(18,'Coal Ore',0x55555a,{hardness:2,tool:'pick',tier:1,drop:'coal'}),
  b(19,'Copper Ore',0x9b7159,{hardness:2.2,tool:'pick',tier:1,drop:'raw_copper'}), b(20,'Iron Ore',0x9e9485,{hardness:2.6,tool:'pick',tier:2,drop:'raw_iron'}),
  b(21,'Gold Ore',0xa48d54,{hardness:2.8,tool:'pick',tier:3,drop:'raw_gold'}), b(22,'Azurite Ore',0x476ea8,{hardness:2.8,tool:'pick',tier:2,drop:'azurite'}),
  b(23,'Starshard Ore',0x83d2ce,{hardness:4.5,tool:'pick',tier:3,drop:'starshard'}), b(24,'Copper Block',0xb86f51,{hardness:3,tool:'pick',tier:2}),
  b(25,'Iron Block',0xc6c6c1,{hardness:3.5,tool:'pick',tier:2}), b(26,'Gold Block',0xe0c75d,{hardness:3,tool:'pick',tier:3}),
  b(27,'Starsteel Block',0x71d3d8,{hardness:5,tool:'pick',tier:4}), b(28,'Crafting Bench',0x8a5a32,{hardness:2,tool:'axe'}),
  b(29,'Kiln Furnace',0x5f6267,{hardness:3,tool:'pick',tier:1}), b(30,'Crate',0x845b36,{hardness:2,tool:'axe',flammable:4}),
  b(31,'Torch',0xe8ac45,{hardness:.1,solid:false,transparent:true,light:13}), b(32,'Farmland',0x62432e,{hardness:.5,tool:'shovel'}),
  b(33,'Young Grain',0x7cad46,{hardness:.1,solid:false,transparent:true,drop:'grain_seed'}), b(34,'Ripe Grain',0xcab948,{hardness:.1,solid:false,transparent:true,drop:'grain'}),
  b(35,'Reed Crop',0x69a944,{hardness:.1,solid:false,transparent:true,drop:'reed'}), b(36,'Cinderstone',0x4b3835,{hardness:2,tool:'pick',tier:2}),
  b(37,'Ash Soil',0x584f4b,{hardness:.7,tool:'shovel'}), b(38,'Ember Ore',0xc64d29,{hardness:3,tool:'pick',tier:3,drop:'ember_crystal',light:5}),
  b(39,'Glowcap',0x8dc46d,{hardness:.1,solid:false,transparent:true,drop:'glowcap',light:7}), b(40,'Basalt Glass',0x302c3a,{hardness:4,tool:'pick',tier:3}),
  b(41,'Rift Frame',0x342844,{hardness:5,tool:'pick',tier:4}), b(42,'Rift Field',0x8c51d9,{hardness:-1,solid:false,transparent:true,drop:null,light:11}),
  b(43,'Voidstone',0x252737,{hardness:3.5,tool:'pick',tier:3}), b(44,'Aether Soil',0x7c78a8,{hardness:1.2,tool:'shovel'}),
  b(45,'Aether Grass',0x7690c7,{hardness:.6,tool:'shovel'}), b(46,'Lumen Crystal',0xd5edff,{hardness:2.2,tool:'pick',tier:3,drop:'lumen_crystal',light:12}),
  b(47,'Ancient Brick',0x4c5068,{hardness:4,tool:'pick',tier:3}), b(48,'Endgate Frame',0x4c5b77,{hardness:-1,drop:null}),
  b(49,'Endgate Field',0x2dd5c4,{hardness:-1,solid:false,transparent:true,drop:null,light:10}), b(50,'Pulse Conductor',0xb74948,{hardness:.3,solid:false,transparent:true}),
  b(51,'Pulse Lever',0x98704b,{hardness:.4,solid:false,transparent:true}), b(52,'Pulse Lamp Off',0x6a6559,{hardness:.5}), b(53,'Pulse Lamp On',0xffdc68,{hardness:.5,light:15}),
  b(54,'Pulse Gate Closed',0x7a5637,{hardness:2,tool:'axe'}), b(55,'Pulse Gate Open',0x7a5637,{hardness:2,tool:'axe',solid:false,transparent:true}),
  b(56,'Pulse Piston',0x8a857c,{hardness:2,tool:'pick',tier:1}), b(57,'Sticky Pulse Piston',0x5b8b59,{hardness:2,tool:'pick',tier:1}),
  b(58,'Water',0x3977c7,{hardness:-1,solid:false,transparent:true,drop:null,liquid:true}), b(59,'Lava',0xd85a22,{hardness:-1,solid:false,transparent:true,drop:null,liquid:true,light:15}),
  b(60,'Snow',0xe9f3f6,{hardness:.4,tool:'shovel'}), b(61,'Ice',0x8dc3d9,{hardness:.5,transparent:true}), b(62,'Red Sand',0xc27a45,{hardness:.5,tool:'shovel',gravity:true}),
  b(63,'Marble',0xd7d4cb,{hardness:2.3,tool:'pick',tier:1}), b(64,'Obsidian Glass',0x231d35,{hardness:5,tool:'pick',tier:4}),
  b(65,'Blast Charge',0x9f493d,{hardness:.2,flammable:10}), b(66,'Bookshelf',0x7d5433,{hardness:1.5,tool:'axe',flammable:8}),
  b(67,'Rune Table',0x3d3659,{hardness:3,tool:'pick',tier:2,light:3}), b(68,'Brewery',0x6c5c75,{hardness:2,tool:'pick',tier:1}),
  b(69,'Bedroll',0xa44e55,{hardness:.2,flammable:6}), b(70,'Fence',0x876039,{hardness:1.8,tool:'axe',flammable:6}),
  b(71,'Stone Slab',0x74787d,{hardness:1.6,tool:'pick',tier:1}), b(72,'Stone Stairs',0x74787d,{hardness:1.6,tool:'pick',tier:1}),
  b(73,'Trapdoor',0x876039,{hardness:1.4,tool:'axe',flammable:6}), b(74,'Sensor',0x537d82,{hardness:1,tool:'pick',tier:1}),
  b(75,'Hopper',0x565c61,{hardness:2.5,tool:'pick',tier:2}), b(76,'Dispenser',0x64686c,{hardness:2.5,tool:'pick',tier:2}),
  b(77,'Delay Relay',0x7d5555,{hardness:.5,solid:false,transparent:true}), b(78,'Logic Comparator',0x695d72,{hardness:.5,solid:false,transparent:true}),
  b(79,'Pressure Plate',0x8a7b65,{hardness:.2,solid:false,transparent:true}), b(80,'Riftwood Log',0x5a4769,{hardness:2,tool:'axe',flammable:2}),
  b(81,'Riftwood Leaves',0x745f9e,{hardness:.25,transparent:true}), b(82,'Riftwood Planks',0x765c8a,{hardness:1.6,tool:'axe',flammable:3}),
  b(83,'Moss Stone',0x60725f,{hardness:1.8,tool:'pick',tier:1}), b(84,'Darkstone Brick',0x343441,{hardness:3.5,tool:'pick',tier:3}),
  b(85,'Spawner',0x4b4058,{hardness:4,tool:'pick',tier:3,light:3}), b(86,'Void Anchor',0x7065a0,{hardness:3,tool:'pick',tier:3,light:8})
];
export const BLOCK_BY_ID = new Map(BLOCKS.map(x=>[x.id,x]));
export const BLOCK_BY_NAME = new Map(BLOCKS.map(x=>[x.drop ?? x.id,x]));

const i = (id,name,props={}) => ({id,name,stack:64,type:'material',...props});
export const ITEMS = [
  ...BLOCKS.filter(x=>x.id>0 && x.drop===x.id).map(x=>i(`block_${x.id}`,x.name,{block:x.id})),
  i('cobble','Cobble',{block:4}),
  i('coal','Coal'),i('raw_copper','Raw Copper'),i('copper_ingot','Copper Ingot'),i('raw_iron','Raw Iron'),i('iron_ingot','Iron Ingot'),i('raw_gold','Raw Gold'),i('gold_ingot','Gold Ingot'),
  i('azurite','Azurite'),i('starshard','Starshard'),i('starsteel_ingot','Starsteel Ingot'),i('ember_crystal','Ember Crystal'),i('lumen_crystal','Lumen Crystal'),
  i('stick','Wooden Rod'),i('flint','Flint'),i('spark_rune','Spark Rune',{stack:16}),i('void_sigil','Void Sigil',{stack:16}),i('echo_compass','Echo Compass',{stack:1}),
  i('grain_seed','Grain Seeds'),i('grain','Grain'),i('bread','Hearth Loaf',{food:6,saturation:5}),i('berry','Wild Berry',{food:2,saturation:1}),i('cooked_fish','Seared Fish',{food:7,saturation:6}),i('raw_fish','Raw Fish',{food:2,saturation:1}),
  i('reed','Reed'),i('glowcap','Glowcap',{food:2,saturation:2}),i('leather','Hide'),i('feather','Feather'),i('bone','Carved Bone'),i('string','Silk Thread'),i('slime_gel','Gel'),i('powder','Blast Powder'),
  i('ember_core','Ember Core',{stack:16}),i('aether_dust','Aether Dust'),i('boss_shard','Heart of the Hollow',{stack:1}),
  i('wood_pick','Wood Pick',{type:'tool',tool:'pick',tier:1,speed:2,durability:70,stack:1,damage:2}), i('stone_pick','Stone Pick',{type:'tool',tool:'pick',tier:2,speed:4,durability:150,stack:1,damage:3}),
  i('iron_pick','Iron Pick',{type:'tool',tool:'pick',tier:3,speed:6,durability:320,stack:1,damage:4}), i('star_pick','Starsteel Pick',{type:'tool',tool:'pick',tier:4,speed:10,durability:1200,stack:1,damage:6}),
  i('wood_axe','Wood Axe',{type:'tool',tool:'axe',tier:1,speed:2,durability:70,stack:1,damage:4}),i('stone_axe','Stone Axe',{type:'tool',tool:'axe',tier:2,speed:4,durability:150,stack:1,damage:6}),i('iron_axe','Iron Axe',{type:'tool',tool:'axe',tier:3,speed:6,durability:320,stack:1,damage:8}),
  i('wood_shovel','Wood Shovel',{type:'tool',tool:'shovel',tier:1,speed:2,durability:70,stack:1,damage:2}),i('iron_shovel','Iron Shovel',{type:'tool',tool:'shovel',tier:3,speed:6,durability:320,stack:1,damage:3}),
  i('stone_sword','Stone Blade',{type:'weapon',stack:1,damage:6,durability:180}), i('iron_sword','Iron Blade',{type:'weapon',stack:1,damage:8,durability:420}), i('star_sword','Starsteel Blade',{type:'weapon',stack:1,damage:11,durability:1500}),
  i('bow','Recurve Bow',{type:'ranged',stack:1,damage:7,durability:380}),i('arrow','Arrow'),i('shield','Kite Shield',{type:'shield',stack:1,durability:500}),i('fishing_rod','Reedcaster',{type:'tool',stack:1,durability:220}),
  i('wood_hoe','Wood Hoe',{type:'tool',tool:'hoe',stack:1,durability:90}),i('iron_hoe','Iron Hoe',{type:'tool',tool:'hoe',stack:1,durability:330}),
  i('leather_helm','Hide Hood',{type:'armor',slot:'head',armor:1,stack:1,durability:100}),i('leather_chest','Hide Coat',{type:'armor',slot:'chest',armor:3,stack:1,durability:160}),
  i('iron_helm','Iron Helm',{type:'armor',slot:'head',armor:2,stack:1,durability:260}),i('iron_chest','Iron Cuirass',{type:'armor',slot:'chest',armor:6,stack:1,durability:420}),i('iron_legs','Iron Greaves',{type:'armor',slot:'legs',armor:5,stack:1,durability:390}),i('iron_boots','Iron Boots',{type:'armor',slot:'feet',armor:2,stack:1,durability:230}),
  i('star_helm','Starsteel Crown',{type:'armor',slot:'head',armor:3,stack:1,durability:700}),i('star_chest','Starsteel Plate',{type:'armor',slot:'chest',armor:8,stack:1,durability:1000}),i('star_legs','Starsteel Greaves',{type:'armor',slot:'legs',armor:6,stack:1,durability:900}),i('star_boots','Starsteel Boots',{type:'armor',slot:'feet',armor:3,stack:1,durability:650}),
  i('healing_draught','Mending Draught',{type:'potion',stack:8}),i('swiftness_draught','Gale Draught',{type:'potion',stack:8}),i('fireward_draught','Cinderward Draught',{type:'potion',stack:8})
];
export const ITEM_BY_ID = new Map();
for (const x of ITEMS) if(!ITEM_BY_ID.has(x.id)) ITEM_BY_ID.set(x.id,x);

export const RECIPES = [
 {id:'planks',name:'Oakheart Planks',out:['block_10',4],in:[['block_8',1]]},{id:'pine_planks',name:'Pine Planks',out:['block_13',4],in:[['block_11',1]]},{id:'palm_planks',name:'Palm Planks',out:['block_16',4],in:[['block_14',1]]},{id:'sticks',name:'Wooden Rods',out:['stick',4],in:[['block_10',2]]},{id:'pine_sticks',name:'Pine Rods',out:['stick',4],in:[['block_13',2]]},{id:'palm_sticks',name:'Palm Rods',out:['stick',4],in:[['block_16',2]]},{id:'flint',name:'Knapped Flint',out:['flint',1],in:[['block_6',2]]},
 {id:'bench',name:'Crafting Bench',out:['block_28',1],in:[['block_10',4]]},{id:'crate',name:'Crate',out:['block_30',1],in:[['block_10',8]]},
 {id:'furnace',name:'Kiln Furnace',out:['block_29',1],in:[['cobble',8]]},{id:'torch',name:'Torches',out:['block_31',4],in:[['coal',1],['stick',1]]},
 {id:'wood_pick',name:'Wood Pick',out:['wood_pick',1],in:[['block_10',3],['stick',2]]},{id:'stone_pick',name:'Stone Pick',out:['stone_pick',1],in:[['cobble',3],['stick',2]]},
 {id:'iron_pick',name:'Iron Pick',out:['iron_pick',1],in:[['iron_ingot',3],['stick',2]]},{id:'star_pick',name:'Starsteel Pick',out:['star_pick',1],in:[['starsteel_ingot',3],['stick',2]]},
 {id:'stone_sword',name:'Stone Blade',out:['stone_sword',1],in:[['cobble',2],['stick',1]]},{id:'iron_sword',name:'Iron Blade',out:['iron_sword',1],in:[['iron_ingot',2],['stick',1]]},
 {id:'star_sword',name:'Starsteel Blade',out:['star_sword',1],in:[['starsteel_ingot',2],['stick',1]]},{id:'bow',name:'Recurve Bow',out:['bow',1],in:[['stick',3],['string',3]]},
 {id:'arrows',name:'Arrows',out:['arrow',4],in:[['flint',1],['stick',1],['feather',1]]},{id:'shield',name:'Kite Shield',out:['shield',1],in:[['block_10',6],['iron_ingot',1]]},
 {id:'bread',name:'Hearth Loaf',out:['bread',1],in:[['grain',3]]},{id:'rod',name:'Reedcaster',out:['fishing_rod',1],in:[['stick',3],['string',2]]},
 {id:'spark',name:'Spark Rune',out:['spark_rune',1],in:[['iron_ingot',1],['flint',1],['azurite',1]]},{id:'riftframe',name:'Rift Frame',out:['block_41',2],in:[['cobble',4],['iron_ingot',1],['azurite',1]]},
 {id:'voidsigil',name:'Void Sigil',out:['void_sigil',1],in:[['ember_core',1],['ember_crystal',2],['gold_ingot',1]]},{id:'compass',name:'Echo Compass',out:['echo_compass',1],in:[['ember_core',1],['azurite',4],['iron_ingot',4]]},
 {id:'rune_table',name:'Rune Table',out:['block_67',1],in:[['block_64',2],['azurite',4],['block_66',1]]},{id:'brewery',name:'Brewery',out:['block_68',1],in:[['cobble',3],['iron_ingot',1],['glowcap',1]]},
 {id:'pulse_wire',name:'Pulse Conductors',out:['block_50',8],in:[['copper_ingot',1],['azurite',1]]},{id:'pulse_lever',name:'Pulse Lever',out:['block_51',1],in:[['cobble',1],['stick',1]]},
 {id:'pulse_lamp',name:'Pulse Lamp',out:['block_52',1],in:[['block_17',4],['copper_ingot',1],['lumen_crystal',1]]},{id:'blast',name:'Blast Charge',out:['block_65',1],in:[['powder',4],['block_5',4]]}
];

export const SMELTS = {
 raw_copper:{out:'copper_ingot',time:6}, raw_iron:{out:'iron_ingot',time:8}, raw_gold:{out:'gold_ingot',time:8}, raw_fish:{out:'cooked_fish',time:5}, block_5:{out:'block_17',time:6}, cobble:{out:'block_3',time:6}, starshard:{out:'starsteel_ingot',time:14}
};
export const FUELS = {coal:80,block_10:15,block_13:15,block_16:15,stick:5};

export const BIOMES = [
 {id:'plains',name:'Sunmeadow Plains',temp:.65,moist:.45,top:1,fill:2,tree:.025},
 {id:'forest',name:'Oakheart Forest',temp:.55,moist:.75,top:1,fill:2,tree:.10},
 {id:'desert',name:'Amber Dunes',temp:.9,moist:.12,top:5,fill:5,tree:.012},
 {id:'mountain',name:'Skybreak Highlands',temp:.35,moist:.4,top:3,fill:3,tree:.018},
 {id:'snow',name:'Frostveil',temp:.12,moist:.5,top:60,fill:2,tree:.06},
 {id:'swamp',name:'Mirefen',temp:.72,moist:.92,top:1,fill:2,tree:.07},
 {id:'coast',name:'Glass Coast',temp:.7,moist:.5,top:5,fill:5,tree:.02}
];

export const MOB_TYPES = {
 grazer:{name:'Mossgrazer',kind:'passive',hp:12,speed:1.4,damage:0,color:0x86a96b,drop:[['leather',1],['raw_fish',0]],day:true},
 bristle:{name:'Bristlehog',kind:'passive',hp:10,speed:1.5,damage:0,color:0x9b6f65,drop:[['leather',1]],day:true},
 skimmer:{name:'River Skimmer',kind:'passive',hp:6,speed:1.8,damage:0,color:0x5aa8b8,drop:[['raw_fish',2]],aquatic:true},
 huskling:{name:'Huskling',kind:'hostile',hp:18,speed:1.5,damage:3,color:0x67775b,drop:[['bone',1]],night:true},
 shardbow:{name:'Shardbow',kind:'ranged',hp:16,speed:1.3,damage:3,color:0xb6b3a2,drop:[['bone',2],['arrow',2]],night:true},
 blastmite:{name:'Blastmite',kind:'exploder',hp:14,speed:1.6,damage:8,color:0x548d57,drop:[['powder',2]],night:true},
 webstalker:{name:'Webstalker',kind:'hostile',hp:14,speed:2.0,damage:2,color:0x493d55,drop:[['string',2]],night:true,climber:true},
 veilwalker:{name:'Veilwalker',kind:'neutral',hp:30,speed:2.2,damage:6,color:0x64508a,drop:[['aether_dust',1]],night:true,teleport:true},
 gelslug:{name:'Gelslug',kind:'hostile',hp:10,speed:1.0,damage:2,color:0x55a875,drop:[['slime_gel',2]],night:true},
 nightkite:{name:'Nightkite',kind:'flying',hp:12,speed:2.6,damage:3,color:0x59618f,drop:[['feather',2]],night:true,flying:true},
 emberling:{name:'Emberling',kind:'hostile',hp:20,speed:1.7,damage:4,color:0xd36b37,drop:[['ember_crystal',1]],dimension:'infernal'},
 brimstalker:{name:'Brimstalker',kind:'ranged',hp:28,speed:1.4,damage:5,color:0x8b3945,drop:[['ember_core',1]],dimension:'infernal'},
 warder:{name:'Settlement Warder',kind:'guard',hp:40,speed:1.6,damage:7,color:0x9aa3a7,drop:[],day:true},
 trader:{name:'Wayfarer',kind:'passive',hp:20,speed:1.2,damage:0,color:0xb58a63,drop:[],day:true},
 voidling:{name:'Voidling',kind:'hostile',hp:24,speed:2.0,damage:5,color:0x756eb8,drop:[['aether_dust',2]],dimension:'void'},
 hollowking:{name:'Hollow Regent',kind:'boss',hp:260,speed:1.2,damage:9,color:0x4e568d,drop:[['boss_shard',1]],dimension:'void',boss:true}
};

export const DIMENSIONS = {
 overworld:{id:'overworld',name:'Verdant Reach',sky:0x87b8e6,fog:0xb8d3e8,gravity:20,ambient:.72,scale:1},
 infernal:{id:'infernal',name:'Cinderdeep',sky:0x2a1010,fog:0x5c2319,gravity:18,ambient:.38,scale:8},
 void:{id:'void',name:'Aether Void',sky:0x0a0918,fog:0x17152d,gravity:13,ambient:.5,scale:1}
};

export const CONTROLS = {
 forward:'KeyW',back:'KeyS',left:'KeyA',right:'KeyD',jump:'Space',sprint:'ShiftLeft',sneak:'ControlLeft',inventory:'KeyE',drop:'KeyQ',debug:'F3',creative:'KeyC'
};
