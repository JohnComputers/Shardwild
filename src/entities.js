import * as THREE from 'https://unpkg.com/three@0.179.0/build/three.module.js';
import {MOB_TYPES,DIMENSIONS,BLOCK_BY_ID} from './config.js';

function box(w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color}));m.castShadow=false;m.receiveShadow=false;return m;}
function mobModel(type){
 const def=MOB_TYPES[type],g=new THREE.Group();
 if(type==='nightkite'){const body=box(.8,.22,.45,def.color),w1=box(1.0,.08,.5,def.color),w2=w1.clone();w1.position.x=-.85;w2.position.x=.85;g.add(body,w1,w2);return g;}
 if(type==='skimmer'){const body=box(.75,.35,1.1,def.color);g.add(body);return g;}
 if(type==='gelslug'){g.add(box(.9,.65,.9,def.color));return g;}
 if(type==='veilwalker'){const body=box(.55,2.2,.45,def.color);body.position.y=1.1;const head=box(.72,.65,.65,0x8872b8);head.position.y=2.45;g.add(body,head);return g;}
 if(type==='blastmite'){const body=box(.75,1.1,.75,def.color);body.position.y=.75;for(const sx of [-.25,.25])for(const sz of [-.25,.25]){const leg=box(.18,.7,.18,0x406c43);leg.position.set(sx,.2,sz);g.add(leg);}g.add(body);return g;}
 if(type==='webstalker'){const body=box(.9,.35,.9,def.color);body.position.y=.45;g.add(body);for(const sx of [-1,1])for(let i=0;i<4;i++){const leg=box(.7,.08,.08,0x30293a);leg.position.set(sx*.65,.35,(i-1.5)*.18);leg.rotation.z=sx*.35;g.add(leg);}return g;}
 if(type==='hollowking'){const body=box(2.4,3.5,1.6,def.color);body.position.y=2;const head=box(2,1.4,1.5,0x737db6);head.position.y=4.5;const crown=box(2.5,.25,1.8,0xbcc9ff);crown.position.y=5.35;g.add(body,head,crown);return g;}
 const body=box(type==='grazer'||type==='bristle'?1.1:.7,type==='grazer'||type==='bristle'?.8:1.25,type==='grazer'||type==='bristle'?1.5:.55,def.color);body.position.y=type==='grazer'||type==='bristle'?.75:.8;const head=box(.65,.65,.65,new THREE.Color(def.color).offsetHSL(0,0,.08));head.position.set(0,type==='grazer'||type==='bristle'?1.25:1.75,type==='grazer'||type==='bristle'?.7:0);g.add(body,head);return g;
}

export class EntityManager{
 constructor(scene,world,callbacks={}){this.scene=scene;this.world=world;this.cb=callbacks;this.mobs=[];this.drops=[];this.projectiles=[];this.spawnTimer=0;this.boss=null;this.entityRoot=new THREE.Group();scene.add(this.entityRoot);}
 clear(){for(const m of this.mobs)this.entityRoot.remove(m.group);for(const d of this.drops)this.entityRoot.remove(d.mesh);for(const p of this.projectiles)this.entityRoot.remove(p.mesh);this.mobs=[];this.drops=[];this.projectiles=[];this.boss=null;}
 spawnMob(type,x,y,z){const def=MOB_TYPES[type];if(!def)return null;const group=mobModel(type);group.position.set(x,y,z);this.entityRoot.add(group);const m={id:crypto.randomUUID?.()||Math.random().toString(36),type,def,group,hp:def.hp,maxHp:def.hp,vel:new THREE.Vector3(),attackCd:0,wander:Math.random()*6,targetYaw:Math.random()*6.28,dead:false,phase:1,shotCd:1+Math.random()*2};this.mobs.push(m);if(def.boss)this.boss=m;return m;}
 dropItem(id,count,pos){if(!id||count<=0)return;const mesh=box(.28,.28,.28,0xe7d986);mesh.position.copy(pos);mesh.position.y+=.35;this.entityRoot.add(mesh);this.drops.push({id,count,mesh,age:0,vel:new THREE.Vector3((Math.random()-.5)*1.3,2.2,(Math.random()-.5)*1.3)});}
 shoot(origin,target,damage=3,hostile=true,color=0xdde7ff,speed=10){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.11,7,5),new THREE.MeshBasicMaterial({color}));mesh.position.copy(origin);this.entityRoot.add(mesh);const dir=target.clone().sub(origin).normalize();this.projectiles.push({mesh,vel:dir.multiplyScalar(speed),damage,hostile,life:5});}
 update(dt,ctx){
  this.spawnTimer-=dt;if(this.spawnTimer<=0){this.spawnTimer=2.5;this.spawnWave(ctx);}
  for(const m of this.mobs)this.updateMob(m,dt,ctx);
  this.mobs=this.mobs.filter(m=>{if(m.dead){this.entityRoot.remove(m.group);return false;}return true;});
  for(const p of this.projectiles){p.life-=dt;p.mesh.position.addScaledVector(p.vel,dt);if(this.world.isSolidAt(p.mesh.position.x,p.mesh.position.y,p.mesh.position.z))p.life=0;if(p.hostile&&p.mesh.position.distanceTo(ctx.playerPos)<.8){ctx.hurt(p.damage,'projectile');p.life=0;}if(!p.hostile){for(const m of this.mobs){if(!m.dead&&m.group.position.distanceTo(p.mesh.position)<.8){this.damageMob(m,p.damage,ctx);p.life=0;break;}}}}
  this.projectiles=this.projectiles.filter(p=>{if(p.life<=0){this.entityRoot.remove(p.mesh);return false;}return true;});
  for(const d of this.drops){d.age+=dt;d.vel.y-=12*dt;d.mesh.position.addScaledVector(d.vel,dt);const below=this.world.getBlock(d.mesh.position.x,d.mesh.position.y-.2,d.mesh.position.z);if(below&&BLOCK_BY_ID.get(below)?.solid&&d.vel.y<0){d.mesh.position.y=Math.floor(d.mesh.position.y)+.35;d.vel.y=0;}d.mesh.rotation.y+=dt*2;if(d.age>.5&&d.mesh.position.distanceTo(ctx.playerPos)<1.4){const left=ctx.inventory.add(d.id,d.count);if(left<d.count){this.cb.pickup?.();d.count=left;if(left<=0)d.age=999;}}}
  this.drops=this.drops.filter(d=>{if(d.age>300||d.age===999){this.entityRoot.remove(d.mesh);return false;}return true;});
 }
 spawnWave(ctx){
  const dim=this.world.dimension;if(dim==='void'&&ctx.playerPos.distanceTo(new THREE.Vector3(0,ctx.playerPos.y,0))<40&&!ctx.victory&&!this.boss){this.spawnMob('hollowking',0,27,0);this.cb.boss?.(true);return;}
  if(this.mobs.length>35)return;const night=ctx.dayLight<.38;
  const choices=Object.entries(MOB_TYPES).filter(([k,d])=>!d.boss&&((d.dimension&&d.dimension===dim)||(!d.dimension&&dim==='overworld'&&((night&&d.night)||(d.day&&!d.night)))));
  if(!choices.length)return;for(let attempt=0;attempt<3;attempt++){const a=Math.random()*Math.PI*2,r=16+Math.random()*18,x=Math.floor(ctx.playerPos.x+Math.cos(a)*r),z=Math.floor(ctx.playerPos.z+Math.sin(a)*r),y=this.world.surfaceY(x,z,dim);if(y<=1||y>=62)continue;const [type,def]=choices[Math.floor(Math.random()*choices.length)];if(def.aquatic&&!this.world.getBlock(x,y-1,z))continue;this.spawnMob(type,x+.5,y,z+.5);break;}
 }
 updateMob(m,dt,ctx){
  const p=m.group.position,def=m.def;m.attackCd=Math.max(0,m.attackCd-dt);m.shotCd-=dt;if(def.boss){this.updateBoss(m,dt,ctx);return;}
  const to=ctx.playerPos.clone().sub(p),dist=to.length(),hostile=def.kind==='hostile'||def.kind==='ranged'||def.kind==='exploder'||def.kind==='flying';
  let move=new THREE.Vector3();if((hostile&&dist<18)||(def.kind==='neutral'&&m.angry)){move.copy(to).setY(0).normalize();}else{m.wander-=dt;if(m.wander<=0){m.wander=2+Math.random()*5;m.targetYaw=Math.random()*Math.PI*2;}move.set(Math.cos(m.targetYaw),0,Math.sin(m.targetYaw));}
  if(def.kind==='passive'&&dist<3)move.copy(to).setY(0).normalize().multiplyScalar(-1);
  if(def.kind==='ranged'&&dist<13){if(dist<6)move.multiplyScalar(-1);if(m.shotCd<=0){m.shotCd=2.2;this.shoot(p.clone().add(new THREE.Vector3(0,1.2,0)),ctx.playerPos.clone().add(new THREE.Vector3(0,.8,0)),def.damage,true,0xffd9bd,8);}}
  if(def.kind==='exploder'&&dist<2.2){m.fuse=(m.fuse||1.5)-dt;if(m.fuse<=0){ctx.explode(p.clone(),3.2,def.damage);m.dead=true;return;}}else m.fuse=null;
  if((hostile||m.angry)&&def.kind!=='ranged'&&def.kind!=='exploder'&&dist<1.6&&m.attackCd<=0){m.attackCd=1.1;ctx.hurt(def.damage,m.type);}
  if(def.teleport&&dist>7&&Math.random()<dt*.06){p.x=ctx.playerPos.x+(Math.random()-.5)*10;p.z=ctx.playerPos.z+(Math.random()-.5)*10;p.y=this.world.surfaceY(p.x,p.z);return;}
  const speed=def.speed*(def.flying?1.1:1);if(def.flying){p.addScaledVector(move,speed*dt);p.y+=((ctx.playerPos.y+4)-p.y)*dt*.4;}else{const nx=p.x+move.x*speed*dt,nz=p.z+move.z*speed*dt,ground=this.world.surfaceY(nx,nz);if(Math.abs(ground-p.y)<2.2){p.x=nx;p.z=nz;p.y+=(ground-p.y)*Math.min(1,dt*8);} }
  if(move.lengthSq()>0)m.group.rotation.y=Math.atan2(move.x,move.z);
 }
 updateBoss(m,dt,ctx){
  const p=m.group.position,to=ctx.playerPos.clone().sub(p),dist=to.length();m.phase=m.hp>m.maxHp*.66?1:m.hp>m.maxHp*.33?2:3;
  const anchors=[[10,26,10],[-10,26,10],[10,26,-10],[-10,26,-10]].filter(([x,y,z])=>this.world.getBlock(x,y,z)===86).length;m.protected=anchors>0;
  if(m.shotCd<=0){m.shotCd=m.phase===1?1.6:m.phase===2?1.1:.7;const shots=m.phase;for(let s=0;s<shots;s++){const t=ctx.playerPos.clone().add(new THREE.Vector3((Math.random()-.5)*2,1,(Math.random()-.5)*2));this.shoot(p.clone().add(new THREE.Vector3(0,3,0)),t,5+m.phase,true,0x9a91ff,8+m.phase);}}
  if(m.phase>=2&&dist>3){const d=to.setY(0).normalize();p.addScaledVector(d,(1.0+m.phase*.35)*dt);}
  if(m.phase===3&&Math.random()<dt*.07&&this.mobs.filter(x=>x.type==='voidling').length<8)this.spawnMob('voidling',p.x+(Math.random()-.5)*8,27,p.z+(Math.random()-.5)*8);
  if(dist<2.5&&m.attackCd<=0){m.attackCd=.9;ctx.hurt(m.def.damage+m.phase,'Hollow Regent');}
  p.y=27+Math.sin(performance.now()*.0015)*.5;m.group.rotation.y+=dt*.3;
  this.cb.bossHealth?.(m.hp,m.maxHp,m.protected,anchors);
 }
 hitFromRay(origin,dir,maxDist=4.5){let best=null,bestT=maxDist;for(const m of this.mobs){if(m.dead)continue;const c=m.group.position.clone().add(new THREE.Vector3(0,m.def.boss?2.5:1,0)),oc=c.clone().sub(origin),t=oc.dot(dir);if(t<0||t>bestT)continue;const closest=origin.clone().addScaledVector(dir,t),rad=m.def.boss?2.2:.9;if(closest.distanceTo(c)<rad){best=m;bestT=t;}}return best;}
 damageMob(m,damage,ctx){if(m.dead)return false;if(m.def.boss&&m.protected){this.cb.message?.('The Regent is shielded. Break the four Void Anchors!');return false;}m.hp-=damage;if(m.def.kind==='neutral')m.angry=true;this.cb.hit?.();if(m.hp<=0){m.dead=true;const p=m.group.position.clone();for(const [id,max] of m.def.drop||[]){const n=max?1+Math.floor(Math.random()*max):0;if(n)this.dropItem(id,n,p);}ctx.addXp(m.def.boss?120:3+Math.floor(m.maxHp/8));if(m.def.boss){this.boss=null;this.cb.boss?.(false);this.cb.victory?.();}return true;}return false;}
 melee(origin,dir,damage,ctx){const m=this.hitFromRay(origin,dir,4.5);if(!m)return false;this.damageMob(m,damage,ctx);const knock=dir.clone().setY(.2).normalize().multiplyScalar(.5);m.group.position.add(knock);return true;}
 firePlayerProjectile(origin,dir,damage=7){const mesh=new THREE.Mesh(new THREE.BoxGeometry(.08,.08,.55),new THREE.MeshBasicMaterial({color:0xd9d0b0}));mesh.position.copy(origin);mesh.lookAt(origin.clone().add(dir));this.entityRoot.add(mesh);this.projectiles.push({mesh,vel:dir.clone().multiplyScalar(18),damage,hostile:false,life:4});}
 serialize(){return this.mobs.filter(m=>m.type!=='hollowking').slice(0,30).map(m=>({type:m.type,x:m.group.position.x,y:m.group.position.y,z:m.group.position.z,hp:m.hp}));}
 restore(list=[]){for(const d of list){const m=this.spawnMob(d.type,d.x,d.y,d.z);if(m)m.hp=d.hp??m.hp;}}
}
