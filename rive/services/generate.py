from pathlib import Path
import math
base=Path(__file__).resolve().parent
root=base.parents[1]
for kind in ['transformer','breaker','meter','seal']:
    layers=[];tracks=[]
    def shape(path,fill=None,stroke=None,width=1,id=None,x=0,y=0,opacity=1):
        ident=f' id="0:{id}"' if id else ''
        paint=(f'<Fill><SolidColor colorValue="FF{fill}"/></Fill>' if fill else '')+(f'<Stroke thickness="{width}" cap="round" join="round"><SolidColor colorValue="FF{stroke}"/></Stroke>' if stroke else '')
        layers.append(f'<Shape{ident} x="{x}" y="{y}" opacity="{opacity}">{path}{paint}</Shape>')
    def rect(x,y,w,h,c,stroke=None,id=None):shape(f'<Rectangle width="{w}" height="{h}" cornerRadiusTL="5"/>',c,stroke,id=id,x=x,y=y)
    def circle(x,y,r,c=None,stroke=None,width=1,id=None):shape(f'<Ellipse width="{r*2}" height="{r*2}"/>',c,stroke,width,id,x,y)
    def line(pts,c='A5AF9C',width=2,id=None,opacity=1):shape('<PointsPath isClosed="false">'+''.join(f'<StraightVertex x="{x}" y="{y}"/>' for x,y in pts)+'</PointsPath>',None,c,width,id,opacity=opacity)
    def track(id,key,frames):tracks.append(f'<KeyedObject objectId="0:{id}"><KeyedProperty propertyKey="{key}">'+''.join(f'<KeyFrameDouble value="{v}" frame="{f}" interpolationType="linear"/>' for f,v in frames)+'</KeyedProperty></KeyedObject>')
    circle(160,90,72,'EBEEE5')
    circle(160,90,63,None,'D3DBCC')
    if kind=='transformer':
        line([(30,90),(94,90)],'84977A',3);line([(226,90),(290,90)],'84977A',3)
        rect(160,93,130,80,'3B4F48');rect(160,87,119,64,'728377')
        for x in range(110,216,12):rect(x,92,5,50,'BDC7B2')
        rect(160,128,144,8,'33483F')
        for x in [124,196]:
            rect(x,43,8,28,'8F9C84')
            for y in [34,42,50]:rect(x,y,20,4,'B7A27A')
        circle(160,90,15,'EDEBDD');line([(154,91),(159,97),(170,83)],'536B49',2,id=88,opacity=0)
        circle(30,90,5,'C0A16B',id=80)
        track(80,13,[(0,30),(90,94),(150,226),(240,290)])
        track(80,18,[(0,0),(15,1),(220,1),(240,0)])
        track(88,18,[(0,0),(130,0),(155,1),(240,1)])
    elif kind=='breaker':
        rect(160,93,102,131,'33483F');rect(160,88,94,123,'D1D8C9');rect(160,91,64,81,'768573');rect(160,91,51,70,'283C35')
        rect(160,109,45,26,'B8A47E',id=80);rect(160,108,34,2,'EAE2CF',id=81)
        for x in [124,196]:circle(x,37,3,'5E7058');circle(x,143,3,'5E7058')
        circle(160,48,5,'6A805A');circle(160,48,5,'DEC391',id=88)
        line([(56,116),(84,116),(84,70),(105,70)],'91A186',2);line([(212,110),(239,110),(239,64),(266,64)],'91A186',2)
        for id in [80,81]:track(id,14,[(0,109 if id==80 else 108),(45,109 if id==80 else 108),(80,77 if id==80 else 76),(240,77 if id==80 else 76)])
        track(88,18,[(0,0),(75,0),(100,1),(240,1)])
    elif kind=='meter':
        circle(160,91,59,'34473E');circle(160,91,54,'B5A37E');circle(160,91,49,'F9F6E9')
        for i in range(15):
            a=math.pi*1.12+i*math.pi*.76/14
            line([(160+math.cos(a)*39,104+math.sin(a)*39),(160+math.cos(a)*45,104+math.sin(a)*45)],'7A846D',1.3)
        layers.append('<Node id="0:80" x="160" y="104"><Shape><PointsPath isClosed="false"><StraightVertex x="0" y="0"/><StraightVertex x="0" y="-40"/></PointsPath><Stroke thickness="2.5" cap="round"><SolidColor colorValue="FF947D51"/></Stroke></Shape></Node>')
        circle(160,104,5,'45573C');rect(160,124,29,5,'C0CAB2')
        track(80,15,[(0,-1.1),(45,-1.1),(100,.7),(125,.36),(150,.48),(240,.48)])
    else:
        rect(149,85,86,118,'AAB69F');rect(155,79,86,118,'F6F2E5','CAD2BF')
        for y,w in [(47,47),(59,47),(71,34),(83,40)]:rect(150,y,w,3,'B7C1AA')
        circle(190,110,31,'B49D71');circle(190,110,26,'ECE6D3');circle(190,110,22,None,'B49D71')
        line([(177,109),(188,119),(204,99)],'57734D',3,id=88,opacity=0)
        track(88,18,[(0,0),(60,0),(110,1),(240,1)])
    # Hold the finished pose, then smoothly return to the initial state.
    import re
    for n, track_xml in enumerate(tracks):
        first = re.search(r'<KeyFrameDouble value="([^"]+)"', track_xml).group(1)
        track_xml = track_xml.replace('frame="240"', 'frame="330"')
        tracks[n] = track_xml.replace('</KeyedProperty>', f'<KeyFrameDouble value="{first}" frame="450" interpolationType="linear"/><KeyFrameDouble value="{first}" frame="480" interpolationType="linear"/></KeyedProperty>')
    folder=base/kind;folder.mkdir(parents=True,exist_ok=True)
    (folder/'rive.yaml').write_text(f'name: service-{kind}\n')
    (folder/'scene.rml').write_text('<Rive version="1" kind="fragment"><Artboard width="320" height="180" name="Service detail" id="0:2">'+''.join(reversed(layers))+'<LinearAnimation name="Activate" duration="480" fps="60" loopValue="loop" id="0:200">'+''.join(tracks)+'</LinearAnimation></Artboard></Rive>')
