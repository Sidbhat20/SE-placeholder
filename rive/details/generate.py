from pathlib import Path
root=Path(__file__).resolve().parents[2]
base=Path(__file__).resolve().parent
for kind in ['portrait','plan','install','test','handover']:
    shapes=[]; tracks=[]
    def path(points,color='FF65765D',width=2,id=None):
        attr=f' id="0:{id}" opacity="0"' if id else ''
        shapes.append(f'<Shape{attr}><PointsPath isClosed="false">'+''.join(f'<StraightVertex x="{x}" y="{y}"/>' for x,y in points)+f'</PointsPath><Stroke thickness="{width}" cap="round" join="round"><SolidColor colorValue="{color}"/></Stroke></Shape>')
    def track(id,key,values):
        tracks.append(f'<KeyedObject objectId="0:{id}"><KeyedProperty propertyKey="{key}">'+''.join(f'<KeyFrameDouble frame="{f}" value="{v}" interpolationType="linear"/>' for f,v in values)+'</KeyedProperty></KeyedObject>')
    if kind=='portrait':
        pts=[(35,70),(80,70),(115,70),(138,57),(155,78),(173,55),(190,70),(230,70),(285,70),(355,70)]
    elif kind=='plan':
        pts=[(95,120),(95,35),(285,35),(285,120),(95,120),(155,120),(155,75),(220,75),(220,120)]
        path([(95,60),(135,60),(135,35)],'FFC0C9B8',1)
    elif kind=='install':
        pts=[(50,78),(104,78),(104,52),(158,52),(158,78),(217,78),(217,108),(273,108),(273,78),(340,78)]
        for x in [105,220,305]:path([(x-14,60),(x+14,60),(x+14,94),(x-14,94),(x-14,60)],'FFADB99F',1)
    elif kind=='test':
        pts=[(95,110),(95,65),(120,37),(160,25),(210,25),(255,40),(280,70),(280,110),(95,110)]
        path([(190,100),(224,52)],'FFB29962',3,88);track(88,18,[(0,0),(90,0),(120,1),(210,1)])
    else:
        pts=[(135,125),(135,25),(230,25),(260,55),(260,125),(135,125)]
        path([(230,25),(230,55),(260,55)],'FFADB99F',1)
        path([(157,88),(179,105),(228,63)],'FF65765D',4,88);track(88,18,[(0,0),(90,0),(135,1),(210,1)])
    for i in range(len(pts)-1):
        id=100+i;path(pts[i:i+2],id=id);start=10+i*8;track(id,18,[(0,0),(start,0),(start+12,1),(210,1)])
    shapes.insert(0,'<Shape x="35" y="70" id="0:80" opacity="0"><Ellipse width="7" height="7"/><Fill><SolidColor colorValue="FFB89C62"/></Fill></Shape>')
    track(80,13,[(0,pts[0][0])]+[(10+i*8,x) for i,(x,y) in enumerate(pts)]+[(210,pts[-1][0])])
    track(80,14,[(0,pts[0][1])]+[(10+i*8,y) for i,(x,y) in enumerate(pts)]+[(210,pts[-1][1])])
    track(80,18,[(0,0),(10,1),(120,1),(150,0),(210,0)])
    folder=base/kind;folder.mkdir(parents=True,exist_ok=True)
    (folder/'rive.yaml').write_text(f'name: {kind}\n')
    (folder/'scene.rml').write_text('<Rive version="1" kind="fragment"><Artboard width="390" height="150" name="Detail" id="0:2">'+''.join(shapes)+'<LinearAnimation name="Reveal" duration="210" fps="60" id="0:200">'+''.join(tracks)+'</LinearAnimation></Artboard></Rive>')
