"""Native Rive lighting sculpture; layered gradient materials, eight-second loop."""
from pathlib import Path
import math
base=Path(__file__).resolve().parent
layers=[]; tracks=[]
def solid(c):return f'<SolidColor colorValue="{c}"/>'
def gradient(w,h,colors,radial=False):
    tag='RadialGradient' if radial else 'LinearGradient'
    return f'<{tag} startX="{-w/2 if not radial else 0}" startY="0" endX="{w/2}" endY="{h/4 if not radial else 0}">'+''.join(f'<GradientStop colorValue="{c}" position="{i/(len(colors)-1)}"/>' for i,c in enumerate(colors))+f'</{tag}>'
metal=['FF69573B','FFE4D8B5','FFB49A62','FFF4E6BC','FF796344']
glass=['FF35433F','FF85908A','FF33433C','FF182E27','FF66766A']
def shape(path,x,y,fill=None,stroke=None,width=1,id=None,opacity=1,name='Detail'):
    ident=f' id="0:{id}"' if id else ''
    layers.append(f'<Shape x="{x}" y="{y}" opacity="{opacity}" name="{name}"{ident}>{path}'+(f'<Fill>{fill}</Fill>' if fill else '')+(f'<Stroke thickness="{width}" cap="round" join="round">{stroke}</Stroke>' if stroke else '')+'</Shape>')
def ellipse(x,y,w,h,fill=None,stroke=None,width=1,id=None,opacity=1,name='Detail'):
    shape(f'<Ellipse width="{w}" height="{h}"/>',x,y,fill,stroke,width,id,opacity,name)
def rect(x,y,w,h,fill,r=3,stroke=None,id=None):shape(f'<Rectangle width="{w}" height="{h}" cornerRadiusTL="{r}" cornerRadiusTR="{r}" cornerRadiusBL="{r}" cornerRadiusBR="{r}"/>',x,y,fill,stroke,1,id)
def line(pts,c,width=1,id=None,opacity=1):shape('<PointsPath isClosed="false">'+''.join(f'<StraightVertex x="{x}" y="{y}"/>' for x,y in pts)+'</PointsPath>',0,0,None,solid(c),width,id,opacity)
def track(id,key,frames):tracks.append(f'<KeyedObject objectId="0:{id}"><KeyedProperty propertyKey="{key}">'+''.join(f'<KeyFrameDouble frame="{f}" value="{v}" interpolationType="linear"/>' for f,v in frames)+'</KeyedProperty></KeyedObject>')
# Soft ambient light; transparent edge, no rectangular background.
ellipse(300,505,270,27,gradient(270,27,['263B4436','003B4436'],True))
ellipse(300,270,490,490,gradient(490,490,['0CDBC794','00DBC794'],True))
line([(300,0),(300,109)],'FF7B7E6C',1)
rect(300,100,29,11,gradient(29,11,metal))
for y,w in [(116,40),(124,48),(132,44),(140,34)]:rect(300,y,w,7,gradient(w,7,['FFB4BAAA','FFF8F5E9','FFCBCFBD']))
# Rear orbit.
ellipse(300,268,290,114,None,gradient(290,114,metal),3)
ellipse(300,268,286,110,None,solid('66EAE2CA'),.7)
# Four swept arms, asymmetrical height provides depth.
ends=[(123,243),(463,212),(164,377),(451,354)]
paths=[[(300,227),(252,205),(191,205),(123,225),(123,243)],[(300,228),(344,183),(402,183),(463,194),(463,212)],[(300,307),(254,346),(208,346),(164,359),(164,377)],[(300,307),(344,324),(403,324),(451,336),(451,354)]]
for i,pts in enumerate(paths):
    line(pts,'FF68573E',5)
    line([(x,y-1) for x,y in pts],'FFD2C09A',1.5)
    x,y=ends[i]
    ellipse(x,y+36,114,114,gradient(114,114,['55F1CA7C','00F1CA7C'],True),id=100+i,opacity=0)
    # Glass bulb, socket and filament.
    ellipse(x,y+32,43,60,gradient(43,60,['3352614F','997E8B75','335D7059']),solid('99B7BDA3'),.8)
    ellipse(x-10,y+29,4,32,solid('66FFFAE9'))
    line([(x-5,y+15),(x-7,y+40),(x,y+32),(x+7,y+40),(x+5,y+15)],'FFB7A275',1)
    line([(x-5,y+15),(x-7,y+40),(x,y+32),(x+7,y+40),(x+5,y+15)],'FFFFE3A1',1.8,id=110+i,opacity=0)
    rect(x,y,27,17,gradient(27,17,metal))
    for dy in [-6,-2,2,6]:line([(x-12,y+dy),(x+12,y+dy)],'887A6549',.7)
    # A moving contact rides each routed arm.
    ellipse(pts[0][0],pts[0][1],6,6,solid('FFFFE1A0'),id=120+i,opacity=0)
    start=75+i*28
    frames=[(0,pts[0][0])]+[(start+j*14,p[0]) for j,p in enumerate(pts)]+[(480,pts[0][0])]
    track(120+i,13,frames)
    track(120+i,14,[(0,pts[0][1])]+[(start+j*14,p[1]) for j,p in enumerate(pts)]+[(480,pts[0][1])])
    track(120+i,18,[(0,0),(start,0),(start+6,1),(start+56,1),(start+64,0),(480,0)])
    for id,peak in [(100+i,.85),(110+i,1)]:track(id,18,[(0,0),(start+45,0),(start+80,peak),(330,peak),(445,0),(480,0)])
# Central smoked capsule and large material highlights.
rect(300,258,103,206,gradient(103,206,glass),49,solid('FF969D87'))
ellipse(300,257,80,188,gradient(80,188,['00E5BB69','88E5BB69','00E5BB69']),id=90,opacity=0)
for y in range(183,327,12):ellipse(300,y,37,10,None,solid('FFAC9568'),1)
line([(292,176),(292,327),(308,327),(308,176)],'FFE2C489',1.3)
line([(300,175),(300,329)],'FFFFE8B4',3,id=91,opacity=0)
rect(266,252,4,147,solid('55F4F6E9'),2)
rect(273,232,2,93,solid('99E8ECDC'),1)
rect(333,277,2,113,solid('4484947A'),1)
for y in [158,173,341,355]:
    rect(300,y,111 if y in [173,341] else 81,9,gradient(111,9,metal),3)
ellipse(300,369,34,12,gradient(34,12,metal))
# Foreground ellipse rings, finely lit; animate width to suggest turning.
ellipse(300,253,151,238,None,gradient(151,238,metal),3,id=70)
ellipse(300,254,156,242,None,solid('55EADDB5'),.7,id=71)
track(70,16,[(0,1),(120,.83),(240,1),(360,1.12),(480,1)])
track(71,16,[(0,1),(120,.83),(240,1),(360,1.12),(480,1)])
track(90,18,[(0,0),(30,0),(90,.8),(325,.8),(450,0),(480,0)])
track(91,18,[(0,0),(40,0),(95,1),(320,1),(445,0),(480,0)])
track(20,14,[(0,0),(120,-5),(240,0),(360,5),(480,0)])
(base/'rive.yaml').write_text('name: power-core\n')
(base/'scene.rml').write_text('<Rive version="1" kind="fragment"><Artboard width="600" height="550" name="Suspended power core" id="0:2" defaultStateMachineId="0:7"><Node id="0:20">'+''.join(reversed(layers))+'</Node><LinearAnimation name="Illuminate" duration="480" fps="60" loopValue="loop" id="0:200">'+''.join(tracks)+'</LinearAnimation><StateMachine name="Core loop" id="0:7"><StateMachineLayer name="Lighting"><EntryState><StateTransition stateToId="0:10"/></EntryState><AnimationState animationId="0:200" id="0:10"/></StateMachineLayer></StateMachine></Artboard></Rive>')
