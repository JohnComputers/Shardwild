import {ITEM_BY_ID,RECIPES,SMELTS,FUELS,SAVE_PREFIX,BLOCK_BY_ID} from './config.js';

export class InventorySystem{
 constructor(data={}){
  this.slots=Array.from({length:36},(_,i)=>data.slots?.[i]??null); this.selected=data.selected??0;
  this.equipment={head:null,chest:null,legs:null,feet:null,shield:null,...(data.equipment||{})};
 }
 cloneStack(s){return s?{...s}:null;}
 item(id){return ITEM_BY_ID.get(id);}
 count(id){return this.slots.reduce((n,s)=>n+(s?.id===id?s.count:0),0);}
 has(id,n=1){return this.count(id)>=n;}
 add(id,count=1,meta={}){
  const item=this.item(id); if(!item)return count; let left=count;
  for(const s of this.slots){if(left<=0)break;if(s&&s.id===id&&!s.ench&&!meta.ench&&s.count<(item.stack||64)){const take=Math.min(left,(item.stack||64)-s.count);s.count+=take;left-=take;}}
  for(let i=0;i<this.slots.length&&left>0;i++){if(!this.slots[i]){const take=Math.min(left,item.stack||64);this.slots[i]={id,count:take,...meta};if(item.durability&&!('durability' in this.slots[i]))this.slots[i].durability=item.durability;left-=take;}}
  return left;
 }
 remove(id,count=1){let need=count;for(let i=0;i<this.slots.length&&need>0;i++){const s=this.slots[i];if(!s||s.id!==id)continue;const take=Math.min(need,s.count);s.count-=take;need-=take;if(s.count<=0)this.slots[i]=null;}return count-need;}
 consumeMany(entries){if(!entries.every(([id,n])=>this.has(id,n)))return false;for(const [id,n] of entries)this.remove(id,n);return true;}
 move(from,to,half=false){
  if(from===to)return;const a=this.slots[from],b=this.slots[to];if(!a)return;const item=this.item(a.id);
  if(!b){if(half&&a.count>1){const n=Math.ceil(a.count/2);this.slots[to]={...a,count:n};a.count-=n;}else{this.slots[to]=a;this.slots[from]=null;}return;}
  if(a.id===b.id&&!a.ench&&!b.ench){const limit=item?.stack||64,take=Math.min(a.count,limit-b.count);b.count+=take;a.count-=take;if(a.count<=0)this.slots[from]=null;}else{this.slots[from]=b;this.slots[to]=a;}
 }
 selectedStack(){return this.slots[this.selected];}
 damageSelected(n=1){const s=this.selectedStack(),it=s&&this.item(s.id);if(!it?.durability)return; s.durability=(s.durability??it.durability)-n;if(s.durability<=0)this.slots[this.selected]=null;}
 armorPoints(){return ['head','chest','legs','feet'].reduce((n,k)=>n+(this.equipment[k]?this.item(this.equipment[k].id)?.armor||0:0),0);}
 equipFrom(index){const s=this.slots[index],it=s&&this.item(s.id);if(!it)return false;const slot=it.type==='shield'?'shield':it.slot;if(!slot)return false;const old=this.equipment[slot];this.equipment[slot]={...s,count:1};s.count--;if(s.count<=0)this.slots[index]=null;if(old)this.add(old.id,1,old);return true;}
 serialize(){return {slots:this.slots,selected:this.selected,equipment:this.equipment};}
}

export class CraftingSystem{
 constructor(inventory){this.inv=inventory;}
 available(bench=false){return RECIPES.filter(r=>(bench||!['iron_pick','star_pick','iron_sword','star_sword','bow','shield','spark','riftframe','voidsigil','compass','rune_table','brewery','pulse_wire','pulse_lamp','blast'].includes(r.id))&&r.in.every(([id,n])=>this.inv.has(id,n)));}
 craft(id,bench=false){const r=RECIPES.find(x=>x.id===id);if(!r)return false;const allowed=bench||!['iron_pick','star_pick','iron_sword','star_sword','bow','shield','spark','riftframe','voidsigil','compass','rune_table','brewery','pulse_wire','pulse_lamp','blast'].includes(r.id);if(!allowed||!this.inv.consumeMany(r.in))return false;const left=this.inv.add(r.out[0],r.out[1]);if(left){const made=r.out[1]-left;if(made)this.inv.remove(r.out[0],made);for(const [iid,n] of r.in)this.inv.add(iid,n);return false;}return true;}
}

export class SmeltingSystem{
 static getEntity(world,x,y,z){const k=`${world.dimension}:${x},${y},${z}`;return world.blockEntities[k]||(world.blockEntities[k]={type:'furnace',input:null,fuel:null,output:null,burn:0,progress:0});}
 static tick(f,dt){
  const recipe=f.input&&SMELTS[f.input.id]; if(f.burn<=0&&recipe&&f.fuel&&FUELS[f.fuel.id]){f.fuel.count--;f.burn=FUELS[f.fuel.id];if(f.fuel.count<=0)f.fuel=null;}
  if(f.burn>0){f.burn-=dt;if(recipe){f.progress+=dt;if(f.progress>=recipe.time){if(!f.output||f.output.id===recipe.out&&f.output.count<(ITEM_BY_ID.get(recipe.out)?.stack||64)){f.input.count--;if(f.input.count<=0)f.input=null;if(!f.output)f.output={id:recipe.out,count:1};else f.output.count++;f.progress=0;}}}else f.progress=0;}else f.progress=0;
 }
}

export class StatusEffectSystem{
 constructor(data={}){this.effects=data.effects||{};}
 add(id,duration,power=1){this.effects[id]={duration,power};}
 tick(dt){for(const [k,e] of Object.entries(this.effects)){e.duration-=dt;if(e.duration<=0)delete this.effects[k];}}
 has(id){return !!this.effects[id];}
 serialize(){return {effects:this.effects};}
}

export class SaveSystem{
 static list(){
  try{return JSON.parse(localStorage.getItem('shardwild-world-list')||'[]');}catch{return [];}
 }
 static saveList(l){localStorage.setItem('shardwild-world-list',JSON.stringify(l));}
 static load(id){try{return JSON.parse(localStorage.getItem(SAVE_PREFIX+id)||'null');}catch{return null;}}
 static save(data){localStorage.setItem(SAVE_PREFIX+data.id,JSON.stringify(data));let l=this.list();const meta={id:data.id,name:data.name,seed:data.seed,updated:Date.now(),mode:data.mode};l=l.filter(x=>x.id!==data.id);l.unshift(meta);this.saveList(l.slice(0,20));}
 static create(name,seed,mode='survival'){const id=(crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`).replaceAll(':','-');const d={id,name:name||'New Wild',seed,mode,created:Date.now(),player:null,world:{altered:{},blockEntities:{}},victory:false};this.save(d);return d;}
 static remove(id){localStorage.removeItem(SAVE_PREFIX+id);this.saveList(this.list().filter(x=>x.id!==id));}
}

export class AudioManager{
 constructor(){this.ctx=null;this.master=.35;}
 ensure(){if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume();}
 tone(freq=220,dur=.06,type='square',gain=.04){if(!this.master)return;this.ensure();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain*this.master,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+dur);o.connect(g).connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+dur);}
 noise(dur=.08,gain=.035){this.ensure();const len=Math.max(1,Math.floor(this.ctx.sampleRate*dur)),b=this.ctx.createBuffer(1,len,this.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=this.ctx.createBufferSource(),g=this.ctx.createGain();s.buffer=b;g.gain.value=gain*this.master;s.connect(g).connect(this.ctx.destination);s.start();}
 break(){this.noise(.08,.05);} place(){this.tone(110,.05,'square',.05);} hit(){this.noise(.05,.07);this.tone(80,.08,'sawtooth',.03);} pickup(){this.tone(600,.05,'sine',.04);} portal(){this.tone(180,.4,'sine',.06);setTimeout(()=>this.tone(360,.5,'sine',.05),110);} ui(){this.tone(480,.03,'square',.025);} victory(){for(let i=0;i<7;i++)setTimeout(()=>this.tone(330*Math.pow(2,i/12),.25,'triangle',.05),i*120);}
}

export class SignalSystem{
 constructor(world){this.world=world;this.powered=new Set();}
 key(x,y,z){return `${x},${y},${z}`;}
 toggleLever(x,y,z){const k=`${this.world.dimension}:${x},${y},${z}`,be=this.world.blockEntities[k]||(this.world.blockEntities[k]={type:'lever',on:false});be.on=!be.on;this.recompute(x,y,z);return be.on;}
 recompute(sx,sy,sz){
  const q=[[sx,sy,sz,15]],seen=new Set();this.powered.clear();
  while(q.length){const [x,y,z,p]=q.shift(),k=this.key(x,y,z);if(seen.has(k)||p<=0)continue;seen.add(k);const id=this.world.getBlock(x,y,z);const bek=`${this.world.dimension}:${x},${y},${z}`,be=this.world.blockEntities[bek];const source=id===51&&be?.on;if(!source&&id!==50&&id!==77&&id!==78&&id!==79&&!(x===sx&&y===sy&&z===sz))continue;if(source||p<15)this.powered.add(k);for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0]])q.push([x+dx,y+dy,z+dz,p-1]);
  }
  // actuate devices adjacent to powered conductors within local radius
  for(let x=sx-15;x<=sx+15;x++)for(let y=Math.max(0,sy-4);y<=Math.min(63,sy+4);y++)for(let z=sz-15;z<=sz+15;z++){
   const id=this.world.getBlock(x,y,z),adj=[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0]].some(([dx,dy,dz])=>this.powered.has(this.key(x+dx,y+dy,z+dz)));
   if(id===52&&adj)this.world.setBlock(x,y,z,53);else if(id===53&&!adj)this.world.setBlock(x,y,z,52);
   if(id===54&&adj)this.world.setBlock(x,y,z,55);else if(id===55&&!adj)this.world.setBlock(x,y,z,54);
   if((id===56||id===57)&&adj){const nx=x+1; if(!this.world.getBlock(nx,y,z)){const pushed=this.world.getBlock(nx+1,y,z);if(pushed&&!BLOCK_BY_ID.get(pushed)?.liquid&&!this.world.getBlock(nx+2,y,z)){this.world.setBlock(nx+2,y,z,pushed);this.world.setBlock(nx+1,y,z,0);}this.world.setBlock(nx,y,z,25);}}
  }
 }
}
