/**
 * Warp's portals, ported to WebGL1 (GLSL ES 1.0) from the real sources:
 * Olimpo `app/src/warp/shaders.ts` (AE1 black and white holes, v2.19, and the
 * BINARIO merge "a los dos") and LinuxRicing `modules/portals/shaders/portal.frag`
 * (the gravitational lens over the screen capture, v2.19.1). The physics and
 * shading are the originals; only these changed for the page:
 * - `bordes()` fades at the edges of a screen rectangle (scrO, scrS) instead of
 *   the whole canvas, so one canvas can hold the PC screen and the devices;
 * - the lens samples a texture of the recreated desktop (`bg`) instead of a
 *   compositor capture.
 * Uniforms: uRes canvas px, uC centre px (y down), R shadow radius px, U line
 * unit, en energy, vis visibility, pulse swallow/spit wave 1..0, spin, pull,
 * T time, closing (white hole fading), estrellas (lensed sky 0..1).
 */

export const WARP_VERTEX = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

/** Plain textured quad for the recreated desktop (the "screen"). */
export const SCREEN_FRAG = `precision mediump float;
uniform vec2 uRes;uniform vec2 scrO;uniform vec2 scrS;uniform sampler2D bg;
void main(){vec2 f=gl_FragCoord.xy;f.y=uRes.y-f.y;vec2 uv=(f-scrO)/scrS;
 if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.){gl_FragColor=vec4(0.);return;}
 gl_FragColor=vec4(texture2D(bg,uv).rgb,1.);}`;

const COMUN = `precision highp float;
uniform vec2 uRes;uniform vec2 uC;uniform float R;uniform float U;uniform float en;uniform float vis;uniform float pulse;
uniform float spin;uniform float pull;uniform float T;uniform float closing;uniform vec2 scrO;uniform vec2 scrS;
float sm(float a,float b,float x){float t=clamp((x-a)/(b-a),0.,1.);return t*t*(3.-2.*t);}
float h11(float n){return fract(sin(n*127.1)*43758.5453);}
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vn(p);p*=2.03;a*=.5;}return s;}
vec2 P(){vec2 f=gl_FragCoord.xy;f.y=uRes.y-f.y;return f-uC;}
float bordes(){vec2 f=gl_FragCoord.xy;f.y=uRes.y-f.y;vec2 a=f-scrO,b=scrO+scrS-f;return sm(0.,36.*U,min(min(a.x,b.x),min(a.y,b.y)));}
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

const CIELO_AE = `
uniform float estrellas;
vec3 cielo(vec2 p,float b,float sg,float giro){float rp=length(p);if(estrellas<.001||rp>R*9.||rp<1.)return vec3(0.);
 vec2 L=p-sg*p*b*b/(rp*rp);
 float an=giro*R*R/(rp*rp+R*R);float c=cos(an),s=sin(an);L=vec2(L.x*c-L.y*s,L.x*s+L.y*c);
 vec2 g=L/(16.*U);vec2 i=floor(g),f=fract(g)-.5;float h=h21(i);if(h<.72)return vec3(0.);
 vec2 o=(vec2(h21(i+3.1),h21(i+7.7))-.5)*.6;float d=length(f-o);float tw=.7+.3*sin(T*1.7+h*60.);
 float mag=1.+1.6*sm(2.4,1.1,rp/R);
 return mix(vec3(.72,.8,1.),vec3(1.,.88,.74),h21(i+1.3))*smoothstep((.07+.1*h21(i+5.5))*mag,0.,d)*tw*(h-.72)*2.2*mag*sm(9.,4.,rp/R)*sm(1.08,1.5,rp/R)*estrellas;}
// Aro que cae hacia el horizonte al tragar (pulse 1→0): nace fuera y se cierra sobre el disco negro.
float aroDentro(float r){float k=sqrt(pulse);float rr=1.04+4.*k;float w=(.06+.12*k);return 2.8*sm(0.,.04,pulse)*sm(1.,.55,pulse)*exp(-pow((r-rr)/w,2.));}
`;

const TRAZO_AE1 = `
const float TILT=-0.29670597;const float RIN=3.;const float ROUT=10.5;
float gas(vec3 x,float rc,float dir,float flujo){float w=pow(rc/RIN,-1.5);float a=atan(x.z,x.x)-dir*spin*2.2*w;vec2 e=vec2(cos(a),sin(a));
 float g=vn(e*4.+vec2(rc*1.9+flujo,0.))*.6+vn(e*11.+vec2(0.,rc*4.3+flujo*2.))*.4;return .3+1.4*smoothstep(.3,.78,g);}
vec4 trazar(vec2 s,float dir,float flujo,float brillo,out float tr){
 float c=cos(TILT),sn=sin(TILT);vec2 q=vec2(s.x*c+s.y*sn,-s.x*sn+s.y*c)*2.598;
 vec3 f=normalize(vec3(0.,-0.170,1.)),up=normalize(cross(f,vec3(1.,0.,0.)));
 vec3 pos=vec3(q.x,0.,0.)-up*q.y-f*14.;vec3 vel=f;vec3 hv=cross(pos,vel);float h2=dot(hv,hv);
 vec3 col=vec3(0.);tr=1.;float cap=0.;
 for(int i=0;i<56;i++){float rr=length(pos);if(rr<1.03){cap=1.;break;}
  float dt=clamp(.13*rr,.04,1.5);vel+=-1.5*h2*pos/pow(rr,5.)*dt;vec3 np=pos+vel*dt;
  if(pos.y*np.y<0.){vec3 x=mix(pos,np,pos.y/(pos.y-np.y));float rc=length(x.xz);
   if(rc>RIN&&rc<ROUT){float rn=(rc-RIN)/(ROUT-RIN);float edge=sm(RIN,RIN+.7,rc)*(1.-sm(ROUT-4.,ROUT,rc));
    vec3 tg=normalize(vec3(-x.z,0.,x.x))*dir;float be=sqrt(.5/rc);float D=sqrt(1.-be*be)/(1.-be*dot(tg,-normalize(vel)));
    float I=pow(RIN/rc,1.5)*pow(D,3.)*gas(x,rc,dir,flujo)*edge;
    I+=pulse*1.4*exp(-pow((rc-RIN-.6)/.8,2.))*pow(D,3.);
    col+=tr*paleta(clamp(rn*1.15-(D-1.)*.6,0.,1.))*I*brillo;tr*=1.-.8*edge*clamp(I*1.2,0.,1.);}}
  pos=np;if(rr>18.&&dot(pos,vel)>0.)break;}
 return vec4(col,cap);}
`;

/**
 * AE1 black hole with the lens of the PC portal: every pixel at distance r shows
 * the desktop at r minus the Schwarzschild-shaped deflection, so the screen is
 * squeezed and arced around the shadow (and a thin inverted secondary image sits
 * between the Einstein ring and the horizon).
 */
export const AE1_NEGRO_LENTE = COMUN + `vec3 paleta(float t){return mix(vec3(1.,.92,.78),vec3(1.,.45,.14),sm(0.,.65,t))*mix(1.,.5,t);}
uniform float reposo;uniform float discoReposo;` + CIELO_AE + TRAZO_AE1 + `
uniform sampler2D bg;uniform float lente;
const float LENTE_TE=1.20;const float LENTE_RMAX=3.3;
float desvio(float s){float c=LENTE_TE/-log(1.-1./LENTE_TE);return -c*log(1.-1./max(s,1.004))*(1.-sm(LENTE_TE,LENTE_RMAX,s));}
vec3 muestra(vec2 q){vec2 uv=(uC+q-scrO)/scrS;return texture2D(bg,clamp(1.-abs(1.-abs(uv)),0.,1.)).rgb;}
void main(){vec2 p=P();float g=1.+.05*sin(3.14159*pulse);vec2 s=p/(R*g);float r=length(s);if(r>9.){gl_FragColor=vec4(0.);return;}
 float tr=1.;vec4 d=vec4(0.);
 if(r<4.6)d=trazar(s,1.,T*.45*(1.+en),vis*mix(.42+.62*en,discoReposo,reposo),tr);
 vec3 rgb=d.rgb;
 vec3 aire=vec3(1.,.62,.32)*vis*mix(.5+en,.25,reposo)*(.05*exp(-max(r-1.,0.)*.8)+.02*exp(-max(r-1.,0.)*.28)*sm(9.,5.,r));
 vec3 fondo=cielo(p,1.9*R,1.,1.2*en+5.*pulse+T*.15)*vis;
 float a=0.;vec3 cap=vec3(0.);
 if(lente>.001){float Rg=R*g;float kv=min(vis,1.);float dl=desvio(r)*kv;float b0=r-dl;
  float b1=r+1./Rg-desvio(r+1./Rg)*kv;float huella=clamp(abs(b1-b0)*Rg,1.,14.)-1.;
  vec2 dir=s/max(r,.001);
  for(int i=0;i<5;i++)cap+=muestra(dir*(b0*Rg+(float(i)-2.)*.25*huella));
  cap*=.2*sm(1.,1.12,r);
  a=lente*sm(.5,3.,length(dir*dl*Rg))*bordes();
  fondo*=1.-a;}
 rgb+=(1.-d.a)*tr*(aire+fondo);
 rgb+=(1.-d.a)*vec3(1.,.8,.55)*aroDentro(r)*vis*1.4;
 rgb=1.-exp(-rgb*1.3);
 float paso=1.-d.a*vis;
 rgb=rgb*bordes()+paso*a*cap;
 float alfa=clamp(1.-paso*(1.-a),0.,1.);
 gl_FragColor=vec4(max(rgb+trama(),0.),alfa);}`;

/** AE1 white hole: the gas flows out, the sky moves aside and the core is pure, opaque white. */
export const AE1_BLANCO = COMUN + `vec3 paleta(float t){return mix(vec3(1.,1.,1.),vec3(.42,.6,1.),pow(t,.8));}` + CIELO_AE + TRAZO_AE1 + `
void main(){vec2 p=P();float g=1.+.09*sin(3.14159*pulse);vec2 s=p/(R*g);float r=length(s);if(r>9.){gl_FragColor=vec4(0.);return;}
 float tr=1.;vec4 d=vec4(0.);
 if(r<4.6)d=trazar(s,-1.,-T*.45-pull*1.2,vis*(.5+.8*en),tr);
 vec3 rgb=d.rgb;
 rgb+=(1.-d.a)*tr*(vec3(.6,.74,1.)*vis*((.12+.1*en)*exp(-max(r-.9,0.)*.9)+.06*exp(-max(r-1.,0.)*.3)*sm(9.,5.,r))+cielo(p,1.5*R,-1.,-1.-3.*pulse)*vis*.8);
 if(pulse>0.){float k=1.-pulse;float w1=2.*U*pulse+.5;
  rgb+=vec3(.9,.95,1.)*pulse*(1.-smoothstep(w1*.5,w1*.5+1.6,abs(r-(1.08+k*5.5))*R));
  rgb+=vec3(.92,.96,1.)*sparks(s,T,36.,5.5,.9,1.)*pulse*1.3;}
 if(closing>0.)rgb+=vec3(1.)*closing*exp(-r*r*(1.6-closing))*.9;
 rgb=1.-exp(-rgb*1.2);
 float nucleo=(1.-sm(.84,1.,r))*d.a*vis;
 rgb=mix(rgb,vec3(1.),nucleo);
 gl_FragColor=vec4(max(rgb*bordes()+trama(),0.),max(nucleo,d.a*vis*.35));}`;

/**
 * "A los dos" (Shift): two portals that merge into one bigger hole. Own uniforms:
 * uC2, fase, uno, onda, oval, estrellas; `fusion.ts` in Olimpo drives them.
 */
export const BINARIO = COMUN + `
vec3 pal2(float t,float frio){vec3 a=mix(vec3(1.,.93,.8),vec3(1.,.42,.12),sm(0.,.8,t))*mix(1.,.55,t);
 vec3 b=mix(vec3(1.),vec3(.42,.6,1.),pow(t,.8));return mix(a,b,frio);}
float gas2(float ang,float rho,float fl){return .35+1.3*smoothstep(.3,.8,vn(vec2(ang*3.,rho*2.6+fl))*.6+vn(vec2(ang*9.,rho*6.+fl*2.))*.4);}
vec4 discoFino(vec2 s,float dir,float fl,float br,float frio,out vec3 atras){
 float c=cos(-.2),sn=sin(-.2);vec2 q=vec2(s.x*c+s.y*sn,-s.x*sn+s.y*c);
 float rho=length(vec2(q.x,q.y/.21));float ang=atan(q.y/.21,q.x);
 float band=sm(1.4,1.75,rho)*(1.-sm(2.8,4.3,rho));
 float dop=1.+.6*dir*(-q.x)/max(rho,.001);
 float I=band*pow(1.6/rho,1.3)*dop*dop*gas2(ang-dir*(spin*1.6)/rho,rho,fl);
 float delante=sm(-.02,.06,q.y)+ (1.-sm(-.02,.06,q.y))*sm(1.05,1.25,length(q));
 vec3 front=pal2(sm(1.4,4.,rho)-(dop-1.)*.4,frio)*I*br*delante;
 float fa=clamp(I*1.6,0.,1.)*band*delante;
 float r=length(q);float an=atan(q.x,-q.y);
 float arco=sm(1.08,1.2,r)*(1.-sm(1.35,1.85,r));
 float arriba=sm(-.35,.5,-q.y/max(r,.001));
 float abajo=sm(.2,.9,q.y/max(r,.001))*.35*(1.-sm(1.12,1.3,r));
 float dop2=1.+.5*dir*(-q.x)/max(r,.001);
 float I2=arco*(arriba+abajo)*pow(1.25/r,2.2)*dop2*dop2*(.55+.45*gas2(an*1.2-dir*spin*1.2,r*1.2,fl*.5));
 atras=pal2(sm(1.08,2.1,r),frio)*I2*br;
 atras+=mix(vec3(1.,.9,.74),vec3(.9,.95,1.),frio)*exp(-pow((r-1.035)*R/(1.3*U),2.))*(.55+.45*dop2)*br*1.1;
 return vec4(front,fa);}

uniform vec2 uC2;uniform float fase;uniform float uno;uniform float onda;uniform float oval;uniform float estrellas;
vec2 desv(vec2 p,vec2 c,float b){vec2 d=p-c;return d*b*b/max(dot(d,d),1.);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
void main(){vec2 f=gl_FragCoord.xy;f.y=uRes.y-f.y;
 vec2 c1=uC,c2=uC2;float b=R*1.75;float k2=1.-uno;
 vec2 dv=c2-c1;float dd=length(dv)/R;vec2 eje=dd>.01?dv/length(dv):vec2(1.,0.);
 float cerca=sm(.3,1.5,dd);
 vec2 L=f-desv(f,c1,b)-desv(f,c2,b)*k2;
 {vec2 cm=(c1+c2)*.5;float dm=length(f-cm);float rw=(1.-onda)*14.*R+2.5*R;
  L+=(f-cm)/max(dm,1.)*sin((dm-rw)/R*3.)*onda*7.*U*exp(-pow((dm-rw)/(2.2*R),2.))*sm(2.*R,3.*R,dm);}
 vec2 s1=(f-c1-desv(f,c2,b*.85)*k2*cerca)/R, s2=(f-c2-desv(f,c1,b*.85)*k2*cerca)/R;
 s1=vec2(s1.x/(1.+oval),s1.y*(1.+oval));
 float marea=.22*sm(7.,2.5,dd)*k2*cerca;
 vec2 m1=s1-eje*dot(s1,eje)*marea, m2=s2-eje*dot(s2,eje)*marea;
 float br=vis*(.55+.7*en+.6*pulse);
 vec3 a1,a2;vec4 d1=discoFino(m1,1.,T*.5,br,0.,a1);vec4 d2=discoFino(m2,1.,T*.5+3.7,br,0.,a2);
 float dl=length(f-c2)-length(f-c1);float w1=.22+.78*sm(-R*.6,R*.6,dl),w2=.22+.78*sm(R*.6,-R*.6,dl);
 w1=mix(w1,1.,uno);w2*=k2;a1*=w1;a2*=w2;d1*=w1;d2*=w2;
 float r1=length(vec2((f-c1).x/(1.+oval),(f-c1).y*(1.+oval))),r2=length(f-c2);
 float kk=R*.9*sm(3.2,1.2,dd)*k2;float ds=k2>.001?smin(r1,r2,max(kk,.001)):r1;
 float px=1./R;float sombra=(1.-smoothstep(1.-px,1.+px,ds/R))*vis;
 float o1=1.-smoothstep(1.-px,1.+px,r1/R),o2=(1.-smoothstep(1.-px,1.+px,r2/R))*k2;
 vec3 cie=vec3(0.);if(estrellas>.001){vec2 g=L/(16.*U);vec2 i=floor(g),fr=fract(g)-.5;float h=h21(i);
  if(h>.72){vec2 o=(vec2(h21(i+3.1),h21(i+7.7))-.5)*.6;float kq=length(fr-o);
   float mag=1.+1.4*(sm(2.4,1.1,length(f-c1)/R)+sm(2.4,1.1,length(f-c2)/R)*k2);
   cie=mix(vec3(.72,.8,1.),vec3(1.,.88,.74),h21(i+1.3))*smoothstep(.07+.1*h21(i+5.5),0.,kq)*(h-.72)*2.2*mag*estrellas;}
  cie*=sm(1.15,1.5,ds/R);}
 vec2 med=(c1+c2)*.5;vec2 nor=vec2(-eje.y,eje.x);vec2 ctrl=med+nor*length(c2-c1)*.28*sin(fase);
 float best=1e9,bt=0.;for(int i=0;i<=24;i++){float t=float(i)/24.;vec2 q=mix(mix(c1,ctrl,t),mix(ctrl,c2,t),t);float kq=length(f-q);if(kq<best){best=kq;bt=t;}}
 float ancho=R*(.12+.2*sin(3.14159*bt));
 float hilo=exp(-pow(best/ancho,2.))*sm(.0,.18,bt)*sm(1.,.82,bt)*sm(6.5,3.,dd)*sm(.9,1.8,dd)*k2;
 float grumo=.45+.9*fbm(vec2(bt*9.-T*1.6,best/R*2.));
 vec3 puente=vec3(1.,.66,.36)*hilo*grumo*vis*(.9+.8*en+1.5*pulse);
 vec3 rgb=(cie*vis+a1+a2+puente+vec3(1.,.62,.32)*vis*.05*(exp(-max(r1/R-1.,0.)*.6)+exp(-max(r2/R-1.,0.)*.6)*k2))*(1.-max(d1.a,d2.a))*(1.-sombra);
 rgb+=(d1.rgb*(1.-o2)+d2.rgb*(1.-o1));
 float rr=1.04+1.6*sqrt(pulse);float ww=.04+.06*sqrt(pulse);rgb+=vec3(1.,.8,.55)*1.4*sm(0.,.04,pulse)*sm(1.,.55,pulse)*exp(-pow((r1/R-rr)/ww,2.))*vis*(1.-sombra);
 rgb+=vec3(.9,.95,1.)*onda*onda*.07*exp(-pow((length(f-med)-((1.-onda)*14.*R+2.5*R))/(.5*R),2.));
 rgb=1.-exp(-rgb*1.35);
 gl_FragColor=vec4(max(rgb*bordes()+trama(),0.),sombra);}`;
