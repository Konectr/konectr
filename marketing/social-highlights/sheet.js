const { chromium } = require('playwright'); const fs=require('fs'),path=require('path');
(async()=>{
 const dir=process.argv[2], out=process.argv[3], w=+process.argv[4]||180;
 const files=[]; (function walk(d){for(const f of fs.readdirSync(d).sort()){const p=path.join(d,f); fs.statSync(p).isDirectory()?walk(p):p.endsWith('.png')&&files.push(p)}})(dir);
 const html=`<body style="margin:0;background:#888;display:flex;flex-wrap:wrap;gap:6px;padding:6px;width:${(w+6)*8+6}px">${files.map(f=>`<img src="${require("url").pathToFileURL(path.resolve(f)).href}" style="width:${w}px">`).join('')}</body>`;
 fs.writeFileSync(__dirname+'/_sheet.html',html);
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
 const p=await b.newPage({viewport:{width:(w+6)*8+12,height:600}}); await p.goto('file://'+__dirname+'/_sheet.html',{waitUntil:'load'});
 await p.screenshot({path:out,fullPage:true}); await b.close();})();
