"""One vector source for the streetscape SVG fallback and native Rive artwork.
Run npm run rive to regenerate both assets. Rive's painter order is reversed.
"""
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
INK = '#24464F'
shapes = []
def poly(points, fill=None, stroke=INK, width=1.5, name='Detail', id=None):
    shapes.append(dict(kind='polygon',points=points,fill=fill,stroke=stroke,width=width,name=name,id=id))
def rect(x,y,w,h,fill,stroke=INK,width=1.5,name='Detail',id=None):
    poly([(x,y),(x+w,y),(x+w,y+h),(x,y+h)],fill,stroke,width,name,id)
def line(points,stroke=INK,width=1.5,name='Detail'):
    poly(points,None,stroke,width,name)
def ellipse(x,y,w,h,fill,stroke=None,name='Detail',id=None):
    shapes.append(dict(kind='ellipse',x=x,y=y,w=w,h=h,fill=fill,stroke=stroke,width=1.5,name=name,id=id))
# Quiet ground plane and four individually composed buildings.
ellipse(600,350,1090,44,'#EBEEE4',name='Street shadow')
line([(22,348),(1178,348)],'#B9CBBE',1)
# Corner cafe, peach plaster and green awning.
poly([(100,172),(117,160),(287,160),(270,172)],'#F7EBDD',name='Cafe roof')
poly([(270,172),(287,160),(287,339),(270,350)],'#E3C7AD',name='Cafe return wall')
rect(100,172,170,176,'#F5DDC7',name='Cafe facade')
rect(111,188,148,29,'#FCF8ED',name='Cafe sign fascia')
rect(116,248,87,84,'#9CBEB6',name='Cafe window')
rect(216,248,39,100,'#86ABA5',name='Cafe entrance')
rect(118,250,83,80,'#FFE8B6',None,name='Cafe light',id=80)
rect(218,250,35,96,'#FFE8B6',None,name='Cafe door light',id=84)
line([(159,248),(159,332)],'#355F60',2)
line([(116,294),(203,294)],'#355F60',2)
ellipse(244,303,4,4,INK)
# Interior shelves and counter visible through glass.
line([(123,276),(194,276)],'#638A7E',2)
for x in [130,144,176]: rect(x,268,7,7,'#F8F5E4',None)
rect(120,316,79,9,'#BD9676',None)
# Awning valance.
poly([(107,224),(261,224),(272,248),(97,248)],'#7BA695',name='Cafe awning',id=85)
for x in range(111,253,28): poly([(x,225),(x+13,225),(x+17,247),(x-4,247)],'#ECF2DA',None)
rect(97,248,175,6,'#5D8879',None)
# Pavement cafe table and chairs.
ellipse(79,320,30,7,'#F6E3BC',INK)
line([(79,324),(79,347),(67,347),(91,347)],INK,1.5)
line([(57,315),(57,334),(67,334),(67,347)],INK,1.5)
line([(97,315),(97,334),(87,334),(87,347)],INK,1.5)
# Office: taller, mint/blue, paired window bays.
poly([(340,104),(358,93),(550,93),(532,104)],'#F6F7EE',name='Office roof')
poly([(532,104),(550,93),(550,337),(532,348)],'#A9C5B9',name='Office side')
rect(340,104,192,244,'#D8E6DC',name='Office facade')
rect(330,104,213,10,'#F7F6E9',name='Office cornice')
for row,y in enumerate([133,199]):
    for col,x in enumerate([357,414,471]):
        rect(x,y,43,48,'#8DADA8',name='Office glazing')
        rect(x+2,y+2,39,44,'#FFF0C9',None,name='Office window illumination',id=100+row*3+col)
        line([(x+21,y),(x+21,y+48)],'#496F6D',1)
        line([(x,y+31),(x+43,y+31)],'#496F6D',1)
        rect(x+3,y+41,14,4,'#72908B',None)
rect(359,282,57,66,'#86AAA5',name='Office lobby')
rect(361,284,53,62,'#FFF0C9',None,name='Lobby light',id=106)
line([(387,282),(387,348)],INK,1)
rect(435,282,72,39,'#9AB8AD',name='Office ground window')
line([(459,282),(459,321),(483,321),(483,282)],'#567D73',1)
rect(350,261,172,8,'#FBF9EF',None)
# Flat-roof rooftop plant.
rect(473,78,39,25,'#B9CDC1',name='Office rooftop unit')
for y in [84,89,94]: line([(479,y),(506,y)],'#6F8F84',1)
# Workshop: sawtooth roof, warm lavender metal cladding.
poly([(616,210),(661,177),(661,210),(707,177),(707,210),(754,177),(788,195),(788,348),(616,348)],'#DDDDE8',name='Workshop facade')
poly([(616,210),(661,177),(661,191),(632,213)],'#9EBFC2',name='Workshop skylight')
poly([(661,210),(707,177),(707,191),(677,213)],'#9EBFC2')
poly([(707,210),(754,177),(754,191),(723,213)],'#9EBFC2')
rect(634,254,92,94,'#819C9E',name='Workshop opening')
rect(636,256,88,90,'#FDE4B8',None,name='Workshop interior light',id=82)
for y in [256,263,270]: line([(635,y),(724,y)],'#5D7B7F',1)
rect(744,271,28,77,'#A5B6B6',name='Workshop door')
rect(640,316,76,11,'#839D91',name='Workbench')
line([(646,327),(646,345),(710,345),(710,327)],INK,1.5)
# Machine wheel is animated in place.
ellipse(678,305,24,24,'#648B83',INK,name='Workshop machine wheel')
poly([(669,304),(678,297),(687,304),(678,312)],'#C6DBCA',None,name='Machine rotation',id=88)
line([(643,237),(768,237)],'#9299AD',1)
# Hospital: sky facade and entrance canopy, cross rather than tiny text.
poly([(883,139),(899,128),(1084,128),(1068,139)],'#F1F7F0',name='Hospital roof')
poly([(1068,139),(1084,128),(1084,338),(1068,348)],'#AFC6D1',name='Hospital side')
rect(883,139,185,209,'#DFEAF0',name='Hospital facade')
rect(948,153,13,37,'#5F8D89',None,name='Hospital cross')
rect(936,165,37,13,'#5F8D89',None)
for x in [901,962,1023]:
    rect(x,211,29,40,'#8FACB8',name='Hospital window')
    rect(x+2,213,25,36,'#FFF0CD',None,name='Hospital window light',id=110+(x-901)//61)
    line([(x,232),(x+29,232)],'#527581',1)
rect(938,280,73,68,'#84AAA9',name='Hospital entrance')
rect(940,282,69,64,'#FFF0CD',None,name='Hospital entrance light',id=83)
line([(974,281),(974,348)],'#456D6C',2)
poly([(924,268),(1019,268),(1031,283),(912,283)],'#ADCBC5',name='Hospital canopy')
rect(912,283,119,5,'#719D95',None)
line([(921,288),(921,347),(1023,347),(1023,288)],'#638B83',2)
# Fine architectural detailing: stone joints, recessed lintels and bronze frames.
for y in [181,220,260,300,338]:
    line([(102,y),(110,y)],'#B3A997',0.55)
    line([(258,y),(268,y)],'#B3A997',0.55)
for x in [347,407,464,524]:
    line([(x,116),(x,253)],'#B6B8AE',0.55)
for y in [124,190,254,275]:
    line([(342,y),(530,y)],'#B6B8AE',0.5)
for y in range(221,348,9):
    line([(619,y),(630,y)],'#AEA9A3',0.5)
    line([(776,y),(786,y)],'#AEA9A3',0.5)
for x in [889,935,1014,1061]:
    line([(x,196),(x,264)],'#BCB9AF',0.55)
# Reflections are narrow, restrained planes instead of flat pastel glass.
for x,y,w,h in [(120,251,12,60),(220,251,5,82),(362,135,4,42),(419,135,4,42),(476,135,4,42),(362,201,4,42),(419,201,4,42),(476,201,4,42),(903,215,3,33),(964,215,3,33),(1025,215,3,33)]:
    rect(x,y,w,h,'#D9DCD4',None,name='Glass reflection')
# Human-scale landscaping, lamps and entry steps.
for x,y in [(304,335),(570,335),(838,335),(1121,335)]:
    line([(x,y+12),(x,y-28)],'#688873',2)
    ellipse(x-7,y-22,24,33,'#BBD2B2',name='Street planting')
    ellipse(x+6,y-35,25,36,'#A3C4A7',name='Street planting')
    poly([(x-12,y-4),(x+14,y-4),(x+10,y+13),(x-8,y+13)],'#E1C6AD',None)
for x in [327,813]:
    line([(x,347),(x,242),(x+18,242)],'#496B65',2)
    ellipse(x+18,245,16,7,'#FBEDCA',INK)
for x,w in [(210,52),(352,72),(932,84)]: rect(x,347,w,4,'#C9D4C7',None)
# A continuous supply cable crosses the ground; vertical taps serve each place.
route=[(28,302),(28,374),(184,374),(433,374),(681,374),(975,374),(1170,374),(1170,335)]
line(route,'#DEE6DB',9,name='Cable sleeve')
line(route,'#315D59',3,name='Continuous supply cable')
for x,y in [(184,332),(433,321),(681,344),(975,348)]:
    line([(x,374),(x,y)],'#315D59',2,name='Building connection')
    ellipse(x,374,8,8,'#F9F8EF','#315D59')
# The lead continues from the headline's SVG cable into the supply unit.
line([(28,0),(28,260)],'#9AB5A5',1.5,name='Incoming supply')
# Supply unit at the beginning of the line.
rect(9,260,38,46,'#E5EBDD',name='Supply unit')
rect(18,271,20,16,'#BCCDC2',None)
rect(22,278,12,5,'#315D59',None,name='Main breaker',id=87)
# A short luminous travelling segment with a soft trail, not a flashing bolt.
rect(-25,-4,25,8,'#B6D9BE',None,name='Current trail',id=91)
ellipse(0,0,9,9,'#F0BB65',name='Current tip',id=90)

# A mineral palette: limestone, pewter, smoked glass and restrained champagne light.
# Preserve geometry and motion; remove the pastel/cartoon colour separation.
palette = {
 '#24464F':'#444C49', '#EBEEE4':'#EAE7DE', '#B9CBBE':'#CBC7BC',
 '#F7EBDD':'#F0ECE3', '#E3C7AD':'#BEB4A1', '#F5DDC7':'#DDD5C6',
 '#FCF8ED':'#F4F1E9', '#9CBEB6':'#89928B', '#86ABA5':'#717D76',
 '#FFE8B6':'#E8D4A8', '#355F60':'#525C56', '#638A7E':'#7C8475',
 '#BD9676':'#98856C', '#7BA695':'#555F53', '#ECF2DA':'#DDD9C9',
 '#5D8879':'#525A4D', '#F6E3BC':'#D2C3A4', '#F6F7EE':'#F2EFE8',
 '#A9C5B9':'#A7A99E', '#D8E6DC':'#DBDDD4', '#F7F6E9':'#EEECE3',
 '#8DADA8':'#7A8985', '#FFF0C9':'#E8D9B9', '#496F6D':'#59615B',
 '#72908B':'#72786D', '#86AAA5':'#78837A', '#9AB8AD':'#8E978C',
 '#567D73':'#666E60', '#FBF9EF':'#EEECE4', '#B9CDC1':'#B8BAAF',
 '#6F8F84':'#7F8476', '#DDDDE8':'#D2CEC7', '#9EBFC2':'#929B99',
 '#819C9E':'#7A8583', '#FDE4B8':'#E4CFAB', '#5D7B7F':'#616961',
 '#A5B6B6':'#A4A69C', '#839D91':'#8F9586', '#648B83':'#697666',
 '#C6DBCA':'#C4C4AE', '#9299AD':'#93958A', '#F1F7F0':'#F0EEE6',
 '#AFC6D1':'#B0B7B0', '#DFEAF0':'#E3E3DC', '#5F8D89':'#788474',
 '#8FACB8':'#82948F', '#FFF0CD':'#EDE0C0', '#527581':'#647369',
 '#84AAA9':'#88998F', '#456D6C':'#5C695B', '#ADCBC5':'#BBBFB0',
 '#719D95':'#8B9580', '#638B83':'#75806C', '#688873':'#7D8370',
 '#BBD2B2':'#BDC1AD', '#A3C4A7':'#A3AE95', '#E1C6AD':'#C5BCA8',
 '#496B65':'#676F60', '#FBEDCA':'#E5D7B7', '#C9D4C7':'#C7C9BB',
 '#DEE6DB':'#DFDFD4', '#315D59':'#656D5A', '#F9F8EF':'#F4F1E9',
 '#9AB5A5':'#B8B7A4', '#E5EBDD':'#DDDCCF', '#BCCDC2':'#BCC0AC',
 '#B6D9BE':'#E1D4AE', '#F0BB65':'#C5A267'
}
for shape in shapes:
    shape['fill'] = palette.get(shape['fill'], shape['fill'])
    shape['stroke'] = palette.get(shape['stroke'], shape['stroke'])
    # Fine material boundaries, not heavy illustrated outlines.
    shape['width'] *= 0.56 if shape['name'] not in ['Continuous supply cable','Building connection'] else 0.8

def svg(s):
    attrs=f'fill="{s["fill"] or "none"}" stroke="{s["stroke"] or "none"}" stroke-width="{s["width"]}" stroke-linejoin="round" stroke-linecap="round"'
    if s['id'] in [90,91]: return ''
    if s['kind']=='ellipse':return f'<ellipse cx="{s["x"]}" cy="{s["y"]}" rx="{s["w"]/2}" ry="{s["h"]/2}" {attrs}/>'
    tag='polygon' if s['fill'] else 'polyline'
    return f'<{tag} points="'+ ' '.join(f'{x},{y}' for x,y in s['points'])+f'" {attrs}/>'
(ROOT/'public/building.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 410"><title>A connected street: cafe, office, workshop and hospital</title>'+''.join(svg(s) for s in shapes)+'</svg>')
light_ids=[80,84,82,83,*range(100,107),*range(110,113)]
def rml(s):
    ident=f' id="0:{s["id"]}"' if s['id'] else ''
    opacity=' opacity="0"' if s['id'] in light_ids+[90,91] else ''
    pos=''
    if s['kind']=='ellipse':
        pos=f' x="{s["x"]}" y="{s["y"]}"'
        path=f'<Ellipse width="{s["w"]}" height="{s["h"]}"/>'
    else:
        path='<PointsPath isClosed="'+('true' if s['fill'] else 'false')+'">'+''.join(f'<StraightVertex x="{x}" y="{y}"/>' for x,y in s['points'])+'</PointsPath>'
    paint=(f'<Fill><SolidColor colorValue="FF{s["fill"][1:]}"/></Fill>' if s['fill'] else '')+(f'<Stroke thickness="{s["width"]}" cap="round" join="round"><SolidColor colorValue="FF{s["stroke"][1:]}"/></Stroke>' if s['stroke'] else '')
    shape=f'<Shape name="{s["name"]}"{ident}{pos}{opacity}>{path}{paint}</Shape>'
    if s['id']==88:
        shape=shape.replace(' id="0:88"','')
        return '<Node x="678" y="305" id="0:88"><Node x="-678" y="-305">'+shape+'</Node></Node>'
    return shape

def track(id,key,frames):
    return f'<KeyedObject objectId="0:{id}"><KeyedProperty propertyKey="{key}">'+''.join(f'<KeyFrameDouble frame="{f}" value="{v}" interpolationType="linear"/>' for f,v in frames)+'</KeyedProperty></KeyedObject>'
anims=[]
for id in light_ids:
    start=115 if id in [80,84] else 240 if id in range(100,107) else 365 if id==82 else 510
    anims.append(track(id,18,[(0,0),(start,0),(start+25,0.94),(625,0.94),(710,0),(720,0)]))
# Path follows each straight run, including the vertical beginning and end.
frames=[0,25,60,135,260,385,530,625,650,680,720]
points=[route[0],route[0],route[1],route[2],route[3],route[4],route[5],route[6],route[7],route[0],route[0]]
for id in [90,91]:
    anims.append(track(id,13,list(zip(frames,[p[0] for p in points]))))
    anims.append(track(id,14,list(zip(frames,[p[1] for p in points]))))
    anims.append(track(id,18,[(0,0),(20,0),(25,1),(625,1),(645,0),(720,0)]))
# Orient the trail to each segment, switching only at corners.
anims.append(track(91,15,[(0,1.570796),(59,1.570796),(60,0),(624,0),(625,-1.570796),(650,-1.570796),(680,1.570796),(720,1.570796)]))
anims.append(track(87,14,[(0,0),(10,0),(25,-5),(625,-5),(710,0),(720,0)]))
anims.append(track(88,15,[(0,0),(390,0),(625,12.5663706),(710,12.5663706),(720,12.5663706)]))
scene='<Rive version="1" kind="fragment"><Artboard width="1200" height="410" name="Follow the current" id="0:2" defaultStateMachineId="0:7">'+''.join(rml(s) for s in reversed(shapes))+'<LinearAnimation name="Follow the current" id="0:200" duration="720" fps="60" loopValue="loop">'+''.join(anims)+'</LinearAnimation><StateMachine name="Street loop" id="0:7"><StateMachineLayer name="Power"><EntryState><StateTransition stateToId="0:10"/></EntryState><AnimationState animationId="0:200" id="0:10"/></StateMachineLayer></StateMachine></Artboard></Rive>'
(HERE/'scene.rml').write_text(scene)
print('Generated panoramic streetscape: shared SVG and native Rive vectors')
