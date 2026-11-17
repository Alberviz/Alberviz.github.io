/**
 * Warp's black-hole portal, the GLSL ES 1.0 fragment shader that runs in Olimpo
 * and on my desktop (it began as portal.frag in LinuxRicing). The disk is lensed
 * above and below the horizon, the side that comes toward you burns brighter, and
 * a field of stars is bent around the hole like a gravitational lens.
 * Uniforms: uRes canvas px, uC centre px (y down), R radius px, U line unit,
 * en energy 0..1, vis visibility 0..1, pulse swallow wave 1..0, spin, pull, T time.
 */

export const WARP_VERTEX = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

export const WARP_COMMON = `precision highp float;
uniform vec2 uRes;uniform vec2 uC;uniform float R;uniform float U;uniform float en;uniform float vis;uniform float pulse;
uniform float spin;uniform float pull;uniform float T;uniform float closing;
float sm(float a,float b,float x){float t=clamp((x-a)/(b-a),0.,1.);return t*t*(3.-2.*t);}
float h11(float n){return fract(sin(n*127.1)*43758.5453);}
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vn(p);p*=2.03;a*=.5;}return s;}
vec2 P(){vec2 f=gl_FragCoord.xy;f.y=uRes.y-f.y;return f-uC;}
// Lente: un campo de estrellas que el agujero curva (radio de Einstein b). Da el arco y el anillo de luz real.
vec3 lente(vec2 p,float b){float rp=length(p);if(rp<R*1.02||rp>R*7.)return vec3(0.);
 vec2 L=p-p/rp*b*b/rp;vec2 g=L/(8.*U);vec2 i=floor(g),f=fract(g)-.5;float h=h21(i);if(h<.88)return vec3(0.);
 vec2 o=(vec2(h21(i+3.1),h21(i+7.7))-.5)*.55;float d=length(f-o);float tw=.65+.35*sin(T*1.7+h*60.);
 float mag=1.+1.2*sm(2.6,1.15,rp/R);
 return mix(vec3(.72,.8,1.),vec3(1.,.88,.74),h21(i+1.3))*smoothstep(.16*mag,0.,d)*tw*(h-.88)*9.*mag*sm(7.,3.5,rp/R);}
// Bordes del lienzo: la luz se apaga antes de llegar al lado o abajo (nada de cortes rectos).
float bordes(){vec2 f=gl_FragCoord.xy;return sm(0.,36.*U,min(min(f.x,uRes.x-f.x),f.y));}
float trama(){return (h21(gl_FragCoord.xy+fract(T)*61.)-.5)/160.;}
float sparks(vec2 s,float t,float n,float spread,float speed,float cone){
 float acc=0.;float r=length(s);float ang=atan(s.x,s.y);
 for(int i=0;i<3;i++){float fi=float(i);
  float b=floor((ang+3.14159265)/6.2831853*n);
  float h=h11(b*1.37+fi*11.3);
  float life=fract(t*speed*(.55+.9*h)+h*5.+fi*.37);
  float pa=((b+.5+(h11(b*3.1+fi)-.5)*.7)/n)*6.2831853-3.14159265;
  float bend=.35*life*sign(pa+.0001);
  float pr=1.05+pow(life,.8)*spread;
  vec2 pp=pr*vec2(sin(pa+bend*.3),cos(pa+bend*.3));
  float d=length(s-pp);float sz=.045+.04*h;
  float c=exp(-pow(pa/cone,2.));
  acc+=exp(-d*d/(sz*sz))*(1.-life)*sm(0.,.08,life)*c;
 }
 return acc;}
`;

export const WARP_BLACK = `
const float TILT=-0.29670597;const float INC=0.17;
vec3 tempColor(float rn,float dop){float t=clamp(rn-(dop-1.)*.35,0.,1.);return vec3(1.,mix(.957,.47,t),mix(.863,.157,pow(t,.7)));}
float streaks(float th,float rho,float rn){float w=pow(rho/1.55,-1.5);float a=th-spin*w;vec2 e=vec2(cos(a),sin(a));
 float g=vn(e*9.+vec2(rho*7.,0.))*.6+vn(e*26.+vec2(0.,rho*19.))*.4;return .15+1.6*smoothstep(.38,.8,g);}
void main(){vec2 p=P();vec2 s=p/R;float r=length(s);if(r>8.){gl_FragColor=vec4(0.);return;}float c=cos(TILT),sn=sin(TILT);
 vec2 q=vec2(s.x*c+s.y*sn,-s.x*sn+s.y*c);float bright=vis*(.45+.75*en);vec3 back=vec3(0.),front=vec3(0.);
 {float g0=.13*vis*(.4+en),g1=.035*vis*(.4+en);float t=(r-.8)/6.2;
  float gv=r<.8?g0:(t<.35?mix(g0,g1,t/.35):mix(g1,0.,clamp((t-.35)/.65,0.,1.)));
  vec3 gc=t<.35?mix(vec3(1.,.667,.353),vec3(1.,.47,.235),clamp(t/.35,0.,1.)):vec3(1.,.47,.235);
  back+=gc*gv+gc*.5*pulse*exp(-r*r*.5);}
 {float rr=length(q);float f=mix(1.,INC,sm(5.5,1.6,rr));float rho=length(vec2(q.x,q.y/f));f=mix(1.,INC,sm(5.5,1.6,rho));
  vec2 qd=vec2(q.x,q.y/f);rho=length(qd);
  if(rho>1.04&&rho<7.5){float a=atan(qd.y,qd.x);float sarm=a+4.68*log(rho);const float N=14.;float arm=.5+.5*cos(N*sarm);
   float idx=mod(floor(N*sarm/6.2831853+.5),N);float m=pow(rho,1.5)/2.31+pull;float blob=smoothstep(.5,.9,vn(vec2(m*1.7,idx*7.31)));
   float heat=sm(6.,1.6,rho);float al=vis*(.12+.5*en)*sm(7.5,4.5,rho)*(.5+heat)*pow(arm,12.)*blob*1.1;
   back+=mix(vec3(.588,.686,1.),vec3(1.,.784,.47),heat)*al;}}
 float yd=q.y/INC;float rho=length(vec2(q.x,yd));float th=atan(yd,q.x);
 if(rho>1.55&&rho<4.45){float rn=(rho-1.55)/2.9;float dop=1.+.8*cos(th)*pow(1.55/rho,.5);float edge=sm(1.55,1.75,rho)*(1.-sm(4.1,4.45,rho));
  float a=bright*pow(dop,2.2)*(1.-rn*.55)*.5*streaks(th,rho,rn)*edge;vec3 col=tempColor(rn,dop)*a;
  if(q.y<0.)back+=col;else{float ends=1.-smoothstep(.55,1.,abs(cos(th)));
   front+=col*(1.-rn*.7)*(.35+.9*smoothstep(-.2,1.,cos(th)))*(.45+.55*ends)*(1.-smoothstep(0.,1.,abs(sin(th)))*.45);}}
 {float qy=(-q.y-.02)/.92;if(qy>0.){float rh=length(vec2(q.x,qy));if(rh>1.12&&rh<2.07){float rn=(rh-1.12)/.95;float cth=q.x/rh;
   float dop=1.+.8*cth*pow(1.55/(1.55+rn*2.9),.5);float edge=sm(1.12,1.2,rh)*(1.-sm(1.95,2.07,rh));float thh=atan(qy,q.x);
   back+=tempColor(rn,dop)*bright*pow(dop,2.2)*(1.-rn*.55)*.35*streaks(thh,1.55+rn*2.9,rn)*edge;}}
  float qu=q.y/.9;if(qu>0.){float ru=length(vec2(q.x,qu));if(ru>1.05&&ru<1.3){float rn=(ru-1.05)/.25;
   float dop=1.+.8*(q.x/ru)*pow(1.55/(1.55+rn*2.9),.5);float edge=sm(1.05,1.1,ru)*(1.-sm(1.22,1.3,ru));
   back+=tempColor(rn,dop)*bright*pow(dop,2.2)*.175*edge;}}}
 float sa=vis*(1.-smoothstep(.9,1.08,r));
 {float lw=max(.7,(1.+en)*U);float d=abs(r-1.03)*R;front+=vec3(1.,.925,.804)*vis*(.35+.6*en)*(1.-smoothstep(lw*.5,lw*.5+1.2,d));
  float lw2=max(.5,.6*U);float d2=abs(r-1.1)*R;front+=vec3(.627,.725,1.)*vis*.25*en*(1.-smoothstep(lw2*.5,lw2*.5+1.2,d2));
  if(pulse>0.){float k=1.-pulse;float w1=2.*U*pulse+.5;
   front+=vec3(1.,.9,.745)*pulse*.9*(1.-smoothstep(w1*.5,w1*.5+1.5,abs(r-(1.05+k*5.))*R));
   front+=vec3(.627,.745,1.)*pulse*.5*(1.-smoothstep(w1*.5,w1*.5+1.5,abs(r-(1.05+k*3.2))*R));}}
 {float Rr=R*(1.45+.25*en)*vis;if(p.y>=0.&&Rr>1.){float dd=abs(length(p)-Rr);vec3 rc=vec3(1.,.871,.725);float amp=vis*(.35+.65*en);
  front+=rc*amp*.06*(1.-smoothstep(2.5*U,2.5*U+2.,dd));front+=rc*amp*.45*(1.-smoothstep(.7*U,.7*U+1.2,dd));}}
 back+=lente(p,1.9*R)*vis;
 vec3 rgb=(back*(1.-sa)+front)*bordes()+trama();gl_FragColor=vec4(max(rgb,0.),sa);}`;
