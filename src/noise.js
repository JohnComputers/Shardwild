export function hash32(x){ x=Math.imul(x^61,x^x>>>16); x+=x<<3; x^=x>>>4; x=Math.imul(x,0x27d4eb2d); return (x^x>>>15)>>>0; }
export function hash3(x,y,z,seed=0){ return hash32((x*374761393)^(y*668265263)^(z*2147483647)^seed); }
export function rand01(x,y,z,seed=0){ return hash3(x,y,z,seed)/4294967295; }
const fade=t=>t*t*(3-2*t), lerp=(a,b,t)=>a+(b-a)*t;
export function noise2(x,z,seed=0){
  const xi=Math.floor(x), zi=Math.floor(z), xf=x-xi,zf=z-zi;
  const a=rand01(xi,0,zi,seed)*2-1,b=rand01(xi+1,0,zi,seed)*2-1,c=rand01(xi,0,zi+1,seed)*2-1,d=rand01(xi+1,0,zi+1,seed)*2-1;
  return lerp(lerp(a,b,fade(xf)),lerp(c,d,fade(xf)),fade(zf));
}
export function noise3(x,y,z,seed=0){
  const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi,f=fade;
  const v=(dx,dy,dz)=>rand01(xi+dx,yi+dy,zi+dz,seed)*2-1;
  const x00=lerp(v(0,0,0),v(1,0,0),f(xf)),x10=lerp(v(0,1,0),v(1,1,0),f(xf));
  const x01=lerp(v(0,0,1),v(1,0,1),f(xf)),x11=lerp(v(0,1,1),v(1,1,1),f(xf));
  return lerp(lerp(x00,x10,f(yf)),lerp(x01,x11,f(yf)),f(zf));
}
export function fbm2(x,z,seed=0,oct=5){ let a=.5,f=1,s=0,n=0; for(let i=0;i<oct;i++){s+=noise2(x*f,z*f,seed+i*1013)*a;n+=a;f*=2;a*=.5;} return s/n; }
export function fbm3(x,y,z,seed=0,oct=3){ let a=.5,f=1,s=0,n=0; for(let i=0;i<oct;i++){s+=noise3(x*f,y*f,z*f,seed+i*733)*a;n+=a;f*=2;a*=.5;} return s/n; }
export function seedFromString(s=''){ let h=2166136261; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);} return h>>>0; }
