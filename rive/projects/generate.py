"""Generate six category illustrations and single-play native Rive field notes."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
BASE=Path(__file__).resolve().parent
names=['substation','healthcare','industrial','residential','hospitality','institutional']
for kind in names:
    shapes=[]
    def path(points,fill=None,stroke='#5C655B',width=1,id=None):
        shapes.append((points,fill,stroke,width,id))
    def box(x,y,w,h,fill,stroke='#5C655B',id=None):path([(x,y),(x+w,y),(x+w,y+h),(x,y+h)],fill,stroke,1,id)
    def window(x,y,w=25,h=32):
        box(x,y,w,h,'#87958B');box(x+2,y+2,w-4,h-4,'#E4D2AB',None,100+len(lights));lights.append(100+len(lights))
        path([(x+w/2,y),(x+w/2,y+h)],None,'#657366',.7)
    lights=[]
    path([(60,270),(405,292),(545,247),(210,225)],'#E8E8DE',None)
    if kind=='substation':
        for x in [150,330]:
            box(x,164,92,90,'#CBCFC2');path([(x,164),(x+25,150),(x+116,150),(x+92,164)],'#E7E7DC')
            path([(x+92,164),(x+116,150),(x+116,240),(x+92,254)],'#ABB8A5')
            for a in range(8,86,10):box(x+a,184,3,58,'#8B9B88',None)
            for a in [18,64]:
                box(x+a,131,8,34,'#879883')
                for y in [133,141,149]:box(x+a-4,y,16,3,'#C0CAB7')
            window(x+36,171,18,9)
        path([(114,254),(114,102),(476,102),(476,250)],None,'#687763',3)
        for x in [176,354]:path([(x,103),(x,132)],None,'#9C8B67',2)
    else:
        buildings={'healthcare':[(153,105,286,153)],'industrial':[(132,157,331,105)],'residential':[(125,119,120,142),(275,92,128,173),(424,160,64,106)],'hospitality':[(164,76,268,189)],'institutional':[(102,158,128,102),(248,107,128,153),(393,157,108,103)]}[kind]
        for x,y,w,h in buildings:
            box(x,y,w,h,'#D9DACE')
            path([(x+w,y),(x+w+18,y-11),(x+w+18,y+h-11),(x+w,y+h)],'#B8BFB0')
            path([(x,y),(x+18,y-11),(x+w+18,y-11),(x+w,y)],'#F0EEE5')
            box(x-4,y,w+8,5,'#EEECE1')
            if kind=='industrial':
                for xx in range(x,x+w-30,65):path([(xx,y),(xx+40,y-30),(xx+40,y)],'#B7C4BF');path([(xx+5,y-2),(xx+36,y-25),(xx+36,y-7)],'#849791')
                for xx in [x+23,x+128,x+233]:
                    window(xx,y+38,70,65)
                    for yy in range(y+40,y+57,5):path([(xx,yy),(xx+70,yy)],None,'#7E8B7A',.7)
                continue
            start=y+38 if kind=='healthcare' else y+22
            for yy in range(start,y+h-46,43):
                for xx in range(x+15,x+w-25,43):window(xx,yy,25,28)
            window(x+w//2-21,y+h-43,42,43)
            path([(x+w//2,y+h-43),(x+w//2,y+h)],None,'#657366',1)
            if kind in ['hospitality','healthcare']:
                path([(x+w//2-46,y+h-48),(x+w//2+46,y+h-48),(x+w//2+57,y+h-36),(x+w//2-57,y+h-36)],'#B3BBA7')
        if kind=='healthcare':
            box(284,113,7,23,'#7F927B',None);box(276,121,23,7,'#7F927B',None)
        if kind=='hospitality':
            for x in [182,219,256,293,330,367,404]:path([(x,83),(x,218)],None,'#ACB5A2',.5)
        if kind=='institutional':
            path([(230,213),(248,213),(248,223),(230,223)],'#AAB8A2');path([(376,213),(393,213),(393,223),(376,223)],'#AAB8A2')
    # Landscape planters and entry steps, without cartoon foliage.
    for x in [92,488]:
        box(x,239,23,26,'#C8BEAA');box(x-3,234,29,8,'#A8B39A',None)
        for dx in [2,8,15,21]:path([(x+dx,237),(x+dx-4,217)],None,'#8E9D7E',1)
    path([(61,281),(539,281)],None,'#C2C6B7',1)
    cable=[(55,300),(132,300),(286,300),(458,300),(544,300)]
    path(cable,None,'#697B62',2)
    for x in [177,352,458]:path([(x,300),(x,264)],None,'#78866D',1)
    box(36,289,21,22,'#D4D8C8');box(42,295,9,5,'#6F7E64')
    box(-10,-2,20,4,'#C7AB71',None,90)
    def svg(s):
        p,f,c,w,i=s
        if i==90:return ''
        tag='polygon' if f else 'polyline'
        return f'<{tag} points="'+ ' '.join(f'{x},{y}' for x,y in p)+f'" fill="{f or "none"}" stroke="{c or "none"}" stroke-width="{w}" stroke-linejoin="round"/>'
    (ROOT/f'public/project-{kind}.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340">'+''.join(svg(s) for s in shapes)+'</svg>')
    def rml(s):
        p,f,c,w,i=s
        id=f' id="0:{i}"' if i else ''
        opacity=' opacity="0"' if i in lights or i==90 else ''
        paint=(f'<Fill><SolidColor colorValue="FF{f[1:]}"/></Fill>' if f else '')+(f'<Stroke thickness="{w}"><SolidColor colorValue="FF{c[1:]}"/></Stroke>' if c else '')
        return f'<Shape{id}{opacity}><PointsPath isClosed="{str(bool(f)).lower()}">'+''.join(f'<StraightVertex x="{x}" y="{y}"/>' for x,y in p)+'</PointsPath>'+paint+'</Shape>'
    def track(i,k,frames):return f'<KeyedObject objectId="0:{i}"><KeyedProperty propertyKey="{k}">'+''.join(f'<KeyFrameDouble frame="{t}" value="{v}" interpolationType="linear"/>' for t,v in frames)+'</KeyedProperty></KeyedObject>'
    tracks=track(90,13,[(0,55),(30,55),(300,544),(360,544)])+track(90,14,[(0,300),(360,300)])+track(90,18,[(0,0),(30,1),(300,1),(330,0),(360,0)])
    for n,i in enumerate(lights):
        t=60+int(190*n/max(1,len(lights)-1))
        tracks+=track(i,18,[(0,0),(t,0),(t+30,.95),(360,.95)])
    folder=BASE/kind;folder.mkdir(parents=True,exist_ok=True)
    (folder/'rive.yaml').write_text('name: project-'+kind+'\n')
    (folder/'scene.rml').write_text('<Rive version="1" kind="fragment"><Artboard width="600" height="340" name="Field note" id="0:2"><Node>'+''.join(rml(s) for s in reversed(shapes))+'</Node><LinearAnimation name="Energize" duration="360" fps="60" id="0:200">'+tracks+'</LinearAnimation></Artboard></Rive>')
print('Generated six SVG covers and six one-shot Rive animations')
