#!/bin/sh
# Gera assets/game/index.html a partir de game_src/ (fontes locais, documento completo)
cd "$(dirname "$0")"
OUT=assets/game/index.html
python3 - "$OUT" <<'PY'
import sys,re
src=open('game_src/p1.html').read()
src=re.sub(r'<link rel="preconnect"[^>]*>\n','',src)
src=re.sub(r'<link href="https://fonts.googleapis.com[^>]*>\n','',src)
src=src.replace('<meta name="claude:viewport-fit-sides" content="cover">\n','')
import base64,os
fd=os.path.join(os.path.dirname(sys.argv[1]),'fonts')
def b64(f): return base64.b64encode(open(os.path.join(fd,f),'rb').read()).decode()
fonts=('<style>\n'
 "@font-face{font-family:'Lilita One';src:url(data:font/ttf;base64,"+b64('LilitaOne-Regular.ttf')+") format('truetype');font-weight:400;font-display:block}\n"
 "@font-face{font-family:'Nunito';src:url(data:font/ttf;base64,"+b64('Nunito-Variable.ttf')+") format('truetype');font-weight:200 1000;font-display:block}\n"
 "@font-face{font-family:'Baloo 2';src:url(data:font/ttf;base64,"+b64('Baloo2-Bold.ttf')+") format('truetype');font-weight:700 900;font-display:block}\n"
 'html,body{margin:0;padding:0}\n</style>\n')
title=re.search(r'<title>.*?</title>\n',src).group(0)
body=src.replace(title,'')
js=''.join(open('game_src/'+f).read() for f in ['p2.js','p3.js','p4.js','p5.js','p6.js'])
doc=('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
 '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">\n'
 +title+fonts+'</head>\n<body>\n'+body+'<script>\n(()=>{\'use strict\';\n'+js+'})();\n</script>\n</body>\n</html>\n')
open(sys.argv[1],'w').write(doc)
print('ok',len(doc))
PY
