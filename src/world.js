import * as THREE from 'https://unpkg.com/three@0.179.0/build/three.module.js';
import {BLOCKS,BLOCK_BY_ID,BIOMES,CHUNK_SIZE,WORLD_HEIGHT,SEA_LEVEL,DIMENSIONS} from './config.js';
import {fbm2,fbm3,rand01,hash3} from './noise.js';

const FACE_DEFS=[
 {d:[1,0,0],n:[1,0,0],v:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]},
 {d:[-1,0,0],n:[-1,0,0],v:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]]},
 {d:[0,1,0],n:[0,1,0],v:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]},
 {d:[0,-1,0],n:[0,-1,0],v:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]},
 {d:[0,0,1],n:[0,0,1],v:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]]},
 {d:[0,0,-1],n:[0,0,-1],v:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]},
];

const floorDiv=(a,b)=>Math.floor(a/b), mod=(a,b)=>((a%b)+b)%b;
export const chunkKey=(cx,cz,dim)=>`${dim}:${cx},${cz}`;
export const blockKey=(x,y,z)=>`${x},${y},${z}`;

function chooseBiome(x,z,seed){
 if(Math.hypot(x,z)<38) return BIOMES.find(b=>b.id==='plains');
 const t=(fbm2(x*.0018,z*.0018,seed+101)+1)/2;
 const m=(fbm2(x*.0016,z*.0016,seed+301)+1)/2;
 const h=fbm2(x*.004,z*.004,seed+701);
 if(h>.53) return BIOMES.find(b=>b.id==='mountain');
 if(t<.26) return BIOMES.find(b=>b.id==='snow');
 if(t>.70&&m<.33) return BIOMES.find(b=>b.id==='desert');
 if(m>.72&&t>.48) return BIOMES.find(b=>b.id==='swamp');
 if(m>.58) return BIOMES.find(b=>b.id==='forest');
 return BIOMES.find(b=>b.id==='plains');
}

export class WorldManager{
 constructor(scene,seed,saveData={}){
  this.scene=scene; this.seed=seed>>>0; this.dimension='overworld'; this.renderDistance=3;
  this.chunks=new Map(); this.queue=[]; this.altered=saveData.altered||{}; this.blockEntities=saveData.blockEntities||{};
  this.group=new THREE.Group(); scene.add(this.group); this.materialOpaque=new THREE.MeshLambertMaterial({vertexColors:true});
  this.materialTransparent=new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,opacity:.72,depthWrite:false,side:THREE.DoubleSide});
  this.outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.01,1.01,1.01)),new THREE.LineBasicMaterial({color:0xffffff}));
  this.outline.visible=false; scene.add(this.outline);
  this.lastCenter=''; this.structureInfo=this.computeLandmarks();
 }
 computeLandmarks(){
  const a=(this.seed%97)-48,b=((this.seed>>>8)%97)-48;
  return {stronghold:{x:144+a,z:-132+b},infernalFort:{x:72+(a>>1),z:58+(b>>1)},voidArena:{x:0,z:0}};
 }
 setDimension(id){
  if(this.dimension===id)return; this.dimension=id; for(const c of this.chunks.values()) this.disposeChunk(c); this.chunks.clear(); this.queue.length=0; this.lastCenter='';
 }
 getDelta(dim,x,y,z){ const c=this.altered[chunkKey(floorDiv(x,CHUNK_SIZE),floorDiv(z,CHUNK_SIZE),dim)]; return c?c[blockKey(x,y,z)]:undefined; }
 setDelta(dim,x,y,z,id){
  const ck=chunkKey(floorDiv(x,CHUNK_SIZE),floorDiv(z,CHUNK_SIZE),dim); if(!this.altered[ck])this.altered[ck]={}; this.altered[ck][blockKey(x,y,z)]=id;
 }
 biomeAt(x,z){ return chooseBiome(x,z,this.seed); }
 terrainHeight(x,z){
  const biome=this.biomeAt(x,z); let h=SEA_LEVEL+3+fbm2(x*.012,z*.012,this.seed+11)*8+fbm2(x*.003,z*.003,this.seed+19)*12;
  if(biome.id==='mountain') h+=16+Math.max(0,fbm2(x*.008,z*.008,this.seed+37))*20;
  if(biome.id==='swamp') h=SEA_LEVEL+1+fbm2(x*.02,z*.02,this.seed+41)*2;
  if(biome.id==='desert') h+=3;
  const river=Math.abs(fbm2(x*.004,z*.004,this.seed+909)); if(river<.045) h=Math.min(h,SEA_LEVEL-2);
  return Math.max(5,Math.min(WORLD_HEIGHT-7,Math.floor(h)));
 }
 baseBlock(dim,x,y,z){
  if(y<0||y>=WORLD_HEIGHT)return 0;
  if(dim==='overworld'){
   const h=this.terrainHeight(x,z), biome=this.biomeAt(x,z);
   if(y===0)return 64;
   if(y>h) return y<=SEA_LEVEL?58:0;
   const cave=y>4&&y<h-3&&fbm3(x*.055,y*.07,z*.055,this.seed+555)>0.43;
   if(cave)return y<8?59:0;
   if(y===h) return biome.top;
   if(y>h-4) return biome.fill;
   let id=3; const r=rand01(x,y,z,this.seed+77);
   if(y<42&&r<.012)id=18; if(y<35&&r<.009)id=19; if(y<28&&r<.006)id=20; if(y<18&&r<.003)id=21; if(y<24&&r>.996)id=22; if(y<11&&r>.9982)id=23;
   return id;
  }
  if(dim==='infernal'){
   if(y===0||y===WORLD_HEIGHT-1)return 64;
   const density=fbm3(x*.035,y*.045,z*.035,this.seed+2200);
   const floor=10+Math.floor(fbm2(x*.018,z*.018,this.seed+2201)*7);
   if(y<8)return 59;
   if(y<=floor||y>52||density>.36){
    const r=rand01(x,y,z,this.seed+2299); if(r>.986&&y<45)return 38; return r<.13?37:36;
   }
   return 0;
  }
  // Aether Void floating islands
  const centersY=30+fbm2(x*.004,z*.004,this.seed+3300)*4;
  const n=fbm3(x*.025,y*.04,z*.025,this.seed+3301);
  const radial=1-Math.min(1,Math.abs(y-centersY)/9);
  if(radial+n*.75>.72){
   if(y>centersY+2)return 45; if(y>centersY-1)return 44;
   const r=rand01(x,y,z,this.seed+3333); return r>.985?46:43;
  }
  return 0;
 }
 generatedBlock(dim,x,y,z){
  let id=this.baseBlock(dim,x,y,z);
  if(dim==='overworld') id=this.structureBlockOverworld(x,y,z,id);
  if(dim==='infernal') id=this.structureBlockInfernal(x,y,z,id);
  if(dim==='void') id=this.structureBlockVoid(x,y,z,id);
  return id;
 }
 getBlock(x,y,z,dim=this.dimension){
  x=Math.floor(x);y=Math.floor(y);z=Math.floor(z); if(y<0||y>=WORLD_HEIGHT)return 0;
  const delta=this.getDelta(dim,x,y,z); if(delta!==undefined)return delta;
  const cx=floorDiv(x,CHUNK_SIZE),cz=floorDiv(z,CHUNK_SIZE),c=this.chunks.get(chunkKey(cx,cz,dim));
  if(c&&c.data){ return c.data[this.index(mod(x,CHUNK_SIZE),y,mod(z,CHUNK_SIZE))]; }
  return this.generatedBlock(dim,x,y,z);
 }
 setBlock(x,y,z,id,dim=this.dimension,save=true){
  x=Math.floor(x);y=Math.floor(y);z=Math.floor(z); if(y<0||y>=WORLD_HEIGHT)return;
  if(save)this.setDelta(dim,x,y,z,id);
  const cx=floorDiv(x,CHUNK_SIZE),cz=floorDiv(z,CHUNK_SIZE),c=this.chunks.get(chunkKey(cx,cz,dim));
  if(c){c.data[this.index(mod(x,CHUNK_SIZE),y,mod(z,CHUNK_SIZE))]=id;c.dirty=true;this.meshChunk(c);}
  if(mod(x,CHUNK_SIZE)===0)this.markRemesh(cx-1,cz,dim); if(mod(x,CHUNK_SIZE)===CHUNK_SIZE-1)this.markRemesh(cx+1,cz,dim);
  if(mod(z,CHUNK_SIZE)===0)this.markRemesh(cx,cz-1,dim); if(mod(z,CHUNK_SIZE)===CHUNK_SIZE-1)this.markRemesh(cx,cz+1,dim);
 }
 markRemesh(cx,cz,dim){const c=this.chunks.get(chunkKey(cx,cz,dim));if(c)this.meshChunk(c);}
 index(lx,y,lz){return lx+CHUNK_SIZE*(lz+CHUNK_SIZE*y);}
 generateChunk(cx,cz,dim=this.dimension){
  const data=new Uint8Array(CHUNK_SIZE*CHUNK_SIZE*WORLD_HEIGHT);
  for(let y=0;y<WORLD_HEIGHT;y++)for(let z=0;z<CHUNK_SIZE;z++)for(let x=0;x<CHUNK_SIZE;x++){
   const wx=cx*CHUNK_SIZE+x,wz=cz*CHUNK_SIZE+z; data[this.index(x,y,z)]=this.generatedBlock(dim,wx,y,wz);
  }
  // vegetation/decor after base terrain
  if(dim==='overworld') this.decorateChunk(data,cx,cz);
  const del=this.altered[chunkKey(cx,cz,dim)]; if(del)for(const [k,id] of Object.entries(del)){const [wx,y,wz]=k.split(',').map(Number); if(floorDiv(wx,CHUNK_SIZE)===cx&&floorDiv(wz,CHUNK_SIZE)===cz)data[this.index(mod(wx,CHUNK_SIZE),y,mod(wz,CHUNK_SIZE))]=id;}
  return data;
 }
 decorateChunk(data,cx,cz){
  const set=(lx,y,lz,id)=>{if(lx>=0&&lx<CHUNK_SIZE&&lz>=0&&lz<CHUNK_SIZE&&y>=0&&y<WORLD_HEIGHT)data[this.index(lx,y,lz)]=id;};
  for(let z=1;z<CHUNK_SIZE-1;z++)for(let x=1;x<CHUNK_SIZE-1;x++){
   const wx=cx*CHUNK_SIZE+x,wz=cz*CHUNK_SIZE+z,h=this.terrainHeight(wx,wz),bio=this.biomeAt(wx,wz);
   if(h<=SEA_LEVEL||rand01(wx,99,wz,this.seed+888)>bio.tree)continue;
   if(bio.id==='desert'){
    if(rand01(wx,12,wz,this.seed)<.35){for(let yy=1;yy<=3;yy++)set(x,h+yy,z,14); set(x,h+4,z,15); set(x+1,h+4,z,15);set(x-1,h+4,z,15);set(x,h+4,z+1,15);set(x,h+4,z-1,15);} continue;
   }
   const pine=bio.id==='snow'||bio.id==='mountain',log=pine?11:8,leaf=pine?12:9,ht=4+(hash3(wx,0,wz,this.seed)%3);
   for(let yy=1;yy<=ht;yy++)set(x,h+yy,z,log);
   for(let yy=ht-2;yy<=ht+1;yy++)for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dz)+(yy===ht+1?1:0)<=3)set(x+dx,h+yy,z+dz,leaf);
  }
 }
 structureBlockOverworld(x,y,z,base){
  // scattered ruins/dungeons on deterministic 64-block cells
  const gx=floorDiv(x,64),gz=floorDiv(z,64),r=rand01(gx,0,gz,this.seed+4400);
  if(r>.94){ const cx=gx*64+20+Math.floor(rand01(gx,1,gz,this.seed)*24),cz=gz*64+20+Math.floor(rand01(gx,2,gz,this.seed)*24),h=this.terrainHeight(cx,cz); const dx=Math.abs(x-cx),dz=Math.abs(z-cz);
   if(dx<=5&&dz<=5&&y>=h&&y<=h+4){ if(y===h||(dx===5||dz===5)&&y<=h+3)return 83; if((dx===0&&dz===0)&&y===h+1)return 85; if(y>h)return 0; }
  }
  // endgame fortress always exists at landmark
  const s=this.structureInfo.stronghold,dx=Math.abs(x-s.x),dz=Math.abs(z-s.z),sy=9;
  if(dx<=11&&dz<=11&&y>=sy&&y<=sy+6){
   if(y===sy||y===sy+6||dx===11||dz===11)return 47;
   if(y>sy&&y<sy+6){ if(dx<=3&&dz<=3&&y===sy+1){ if(dx===3||dz===3)return 48; if(dx<3&&dz<3)return 0; } return 0; }
  }
  return base;
 }
 structureBlockInfernal(x,y,z,base){
  const s=this.structureInfo.infernalFort,dx=Math.abs(x-s.x),dz=Math.abs(z-s.z),sy=18;
  if(dx<=12&&dz<=8&&y>=sy&&y<=sy+7){ if(y===sy||y===sy+7||dx===12||dz===8)return 84; if(y===sy+1&&((dx===8&&dz===0)||(dx===0&&dz===5)))return 85; return 0; }
  return base;
 }
 structureBlockVoid(x,y,z,base){
  const dx=Math.abs(x),dz=Math.abs(z); if(dx<=18&&dz<=18){
   const ground=25; if(y===ground&&dx<=18&&dz<=18)return 47; if(y<ground&&y>=ground-3&&dx<=18&&dz<=18)return 43;
   if((dx>=14||dz>=14)&&dx<=18&&dz<=18&&y>ground&&y<=ground+3)return 47;
   if(y===ground+1&&((dx===10&&dz===10)||(dx===10&&dz===-10)||(dx===-10&&dz===10)||(dx===-10&&dz===-10)))return 86;
  }
  return base;
 }
 ensureAround(px,pz){
  const cx=floorDiv(px,CHUNK_SIZE),cz=floorDiv(pz,CHUNK_SIZE),center=`${this.dimension}:${cx},${cz}:${this.renderDistance}`; if(center===this.lastCenter)return;this.lastCenter=center;
  const want=new Set(); for(let dz=-this.renderDistance;dz<=this.renderDistance;dz++)for(let dx=-this.renderDistance;dx<=this.renderDistance;dx++){
   if(dx*dx+dz*dz>(this.renderDistance+.65)**2)continue; const k=chunkKey(cx+dx,cz+dz,this.dimension);want.add(k);if(!this.chunks.has(k)&&!this.queue.some(q=>q.k===k))this.queue.push({cx:cx+dx,cz:cz+dz,dim:this.dimension,k,dist:dx*dx+dz*dz});
  }
  this.queue.sort((a,b)=>a.dist-b.dist);
  for(const [k,c] of [...this.chunks])if(!want.has(k)){this.disposeChunk(c);this.chunks.delete(k);}
 }
 processQueue(max=1){ for(let n=0;n<max&&this.queue.length;n++){const q=this.queue.shift();if(q.dim!==this.dimension||this.chunks.has(q.k)){n--;continue;}const c={...q,data:this.generateChunk(q.cx,q.cz,q.dim),opaque:null,trans:null};this.chunks.set(q.k,c);this.meshChunk(c);} }
 disposeChunk(c){for(const m of [c.opaque,c.trans])if(m){this.group.remove(m);m.geometry.dispose();}}
 meshChunk(c){
  if(c.opaque){this.group.remove(c.opaque);c.opaque.geometry.dispose();c.opaque=null;} if(c.trans){this.group.remove(c.trans);c.trans.geometry.dispose();c.trans=null;}
  const op=this.buildGeometry(c,false),tr=this.buildGeometry(c,true); if(op){c.opaque=new THREE.Mesh(op,this.materialOpaque);c.opaque.frustumCulled=true;this.group.add(c.opaque);} if(tr){c.trans=new THREE.Mesh(tr,this.materialTransparent);c.trans.renderOrder=2;c.trans.frustumCulled=true;this.group.add(c.trans);} c.dirty=false;
 }
 buildGeometry(c,transparent){
  const pos=[],nor=[],col=[],idx=[];let vi=0;
  for(let y=0;y<WORLD_HEIGHT;y++)for(let lz=0;lz<CHUNK_SIZE;lz++)for(let lx=0;lx<CHUNK_SIZE;lx++){
   const id=c.data[this.index(lx,y,lz)]; if(!id)continue; const b=BLOCK_BY_ID.get(id); if(!b||Boolean(b.transparent)!==transparent)continue;
   const wx=c.cx*CHUNK_SIZE+lx,wz=c.cz*CHUNK_SIZE+lz,color=new THREE.Color(b.color);
   for(const f of FACE_DEFS){const nid=this.getBlock(wx+f.d[0],y+f.d[1],wz+f.d[2],c.dim),nb=BLOCK_BY_ID.get(nid);const visible=!nid||!nb?.solid||(nb?.transparent&&nid!==id)||(b.liquid&&nid!==id); if(!visible)continue;
    for(const v of f.v){pos.push(wx+v[0],y+v[1],wz+v[2]);nor.push(...f.n);const shade=f.n[1]>.5?1:f.n[1]<-.5?.55:(f.n[0]!==0?.82:.9);col.push(color.r*shade,color.g*shade,color.b*shade);} idx.push(vi,vi+1,vi+2,vi,vi+2,vi+3);vi+=4;
   }
  }
  if(!pos.length)return null;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeBoundingSphere();return g;
 }
 updateSelection(origin,dir,maxDist=6){ const h=this.raycast(origin,dir,maxDist);this.outline.visible=!!h;if(h)this.outline.position.set(h.x+.5,h.y+.5,h.z+.5);return h; }
 raycast(origin,dir,maxDist=6){
  let x=Math.floor(origin.x),y=Math.floor(origin.y),z=Math.floor(origin.z);const sx=Math.sign(dir.x)||1,sy=Math.sign(dir.y)||1,sz=Math.sign(dir.z)||1;
  const tx=dir.x!==0?Math.abs(1/dir.x):Infinity,ty=dir.y!==0?Math.abs(1/dir.y):Infinity,tz=dir.z!==0?Math.abs(1/dir.z):Infinity;
  let mx=dir.x>=0?(x+1-origin.x)*tx:(origin.x-x)*tx,my=dir.y>=0?(y+1-origin.y)*ty:(origin.y-y)*ty,mz=dir.z>=0?(z+1-origin.z)*tz:(origin.z-z)*tz;
  let prev={x,y,z},dist=0; for(let i=0;i<128&&dist<=maxDist;i++){const id=this.getBlock(x,y,z);if(id&&BLOCK_BY_ID.get(id)?.solid)return {x,y,z,id,prev,dist};prev={x,y,z};if(mx<my&&mx<mz){x+=sx;dist=mx;mx+=tx;}else if(my<mz){y+=sy;dist=my;my+=ty;}else{z+=sz;dist=mz;mz+=tz;}}
  return null;
 }
 surfaceY(x,z,dim=this.dimension){if(dim==='overworld')return this.terrainHeight(x,z)+1;for(let y=WORLD_HEIGHT-2;y>1;y--)if(this.generatedBlock(dim,x,y,z)&&!this.generatedBlock(dim,x,y+1,z))return y+1;return 30;}
 isSolidAt(x,y,z){return !!BLOCK_BY_ID.get(this.getBlock(x,y,z))?.solid;}
 exportSave(){return {altered:this.altered,blockEntities:this.blockEntities};}
 nearestStronghold(){return {...this.structureInfo.stronghold};}
 nearestInfernalFort(){return {...this.structureInfo.infernalFort};}
 activatePortal(hit,itemId){
  if(itemId==='spark_rune'){
   // detect player-built 4x5 rectangular Rift Frame in X or Z plane around hit; fill interior with rift field.
   const candidates=[]; for(let ox=-4;ox<=0;ox++)for(let oy=-4;oy<=0;oy++)candidates.push([hit.x+ox,hit.y+oy,hit.z,'x'],[hit.x,hit.y+oy,hit.z+ox,'z']);
   for(const [bx,by,bz,axis] of candidates){let ok=true;for(let w=0;w<4;w++)for(let h=0;h<5;h++){const edge=w===0||w===3||h===0||h===4;const x=bx+(axis==='x'?w:0),z=bz+(axis==='z'?w:0),id=this.getBlock(x,by+h,z);if(edge&&id!==41)ok=false;if(!edge&&id!==0&&id!==42)ok=false;}if(ok){for(let w=1;w<3;w++)for(let h=1;h<4;h++)this.setBlock(bx+(axis==='x'?w:0),by+h,bz+(axis==='z'?w:0),42);return true;}}
  }
  return false;
 }
 activateEndgate(center,sigils){
  if(sigils<4)return false; const s=this.structureInfo.stronghold; if(Math.hypot(center.x-s.x,center.z-s.z)>20)return false;
  for(let x=s.x-2;x<=s.x+2;x++)for(let z=s.z-2;z<=s.z+2;z++)this.setBlock(x,10,z,49); return true;
 }
 tickBlocks(playerPos){
  // crop growth and simplified liquid/falling behavior only in nearby random blocks.
  for(let n=0;n<8;n++){const x=Math.floor(playerPos.x)+(Math.floor(Math.random()*17)-8),z=Math.floor(playerPos.z)+(Math.floor(Math.random()*17)-8),y=Math.floor(playerPos.y)+(Math.floor(Math.random()*9)-4);const id=this.getBlock(x,y,z);
   if(id===33&&Math.random()<.10)this.setBlock(x,y,z,34);
   if((id===5||id===6||id===62)&&!this.getBlock(x,y-1,z)) {this.setBlock(x,y,z,0);this.setBlock(x,y-1,z,id);}
   if((id===58||id===59)&&!this.getBlock(x,y-1,z)&&Math.random()<.35)this.setBlock(x,y-1,z,id);
  }
 }
}
