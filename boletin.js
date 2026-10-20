// Rendered from the same validated snapshot as the dashboard, never from today's date.
async function iniciarBoletin() {
  const section=document.createElement('section');section.id='boletin';
  section.innerHTML='<div class="section-title"><h2>Boletín para compartir</h2></div><p>Referencias nacionales oficiales · Instagram y Facebook · formato vertical 4:5.</p><p id="boletin-fecha" role="status">Preparando boletín…</p><div class="boletin-layout"><canvas id="boletin-canvas" width="1080" height="1350" role="img" aria-label="Boletín de precios nacionales PorciData"></canvas><div><div class="boletin-actions"><button id="boletin-png" disabled>Descargar imagen PNG</button><button id="boletin-pdf" disabled>Descargar PDF</button></div><p class="note">Ambas descargas usan los mismos datos del tablero. La fecha indicada corresponde a la fuente, no al día de descarga.</p><p class="note">Esta versión automática contiene precios oficiales. El consolidado experimental propio no se calcula ni se sustituye automáticamente.</p><a id="boletin-fuente" target="_blank" rel="noopener">Consultar fuente oficial ↗</a><p id="boletin-error" role="status"></p></div></div>';
  document.getElementById('metodologia').before(section);
  const style=document.createElement('link');style.rel='stylesheet';style.href='boletin.css';document.head.append(style);
  const nav=document.createElement('a');nav.href='#boletin';nav.textContent='↓  Boletín y descargas';document.querySelector('nav').append(nav);
  const $=id=>document.getElementById(id);
  try {
    if(!data) throw Error('No hay un corte validado');validate(data);
    const d=data;
    document.getElementById('status').textContent='● Corte disponible · '+date(d.fechaISO)+' · Fuente oficial verificable';
    const methodNote=document.querySelector('.source > p.note');
    if(methodNote) methodNote.textContent='Revisión programada los lunes a las 5:00 a. m. de Colombia. Solo se publican cortes nuevos validados; la fecha del dato no cambia si no hay novedades.';
    const logo=new Image();logo.src='algropork-logo.png';await logo.decode();
    const canvas=$('boletin-canvas'),ctx=canvas.getContext('2d');
    const cream='#eee3b0',wine='#42151a',gold='#c4a25a',white='#faf6e4';
    ctx.fillStyle=cream;ctx.fillRect(0,0,1080,1350);
    // Crop only the blank margins of the existing square logo at draw time.
    ctx.drawImage(logo,190,570,1040,270,240,40,600,156);
    const text=(s,x,y,size=28,color=wine,weight=500,align='left')=>{ctx.fillStyle=color;ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.textAlign=align;ctx.fillText(s,x,y);};
    const line=y=>{ctx.strokeStyle=gold;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(1020,y);ctx.stroke();};
    const box=(y,h,dark=false)=>{ctx.fillStyle=dark?wine:white;ctx.strokeStyle=gold;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(60,y,960,h,26);ctx.fill();ctx.stroke();};
    line(207);text('PORCIDATA',540,282,72,wine,800,'center');
    text('PRECIOS NACIONALES PORCINOS · COLOMBIA',540,326,29,wine,700,'center');
    text(`CORTE DE FUENTE · ${date(d.fechaISO).toUpperCase()}`,540,378,27,wine,700,'center');
    const names=['CERDO EN PIE','CANAL CALIENTE','CANAL FRÍA'];
    categories.forEach(([key],i)=>{const y=417+i*239,dark=i===0,color=dark?white:wine;box(y,218,dark);text(names[i],98,y+48,31,color,800);text(money(d.referenciasNacionales[key]),98,y+135,88,color,800);text('COP/kg',970,y+128,29,color,700,'right');text('Promedio nacional publicado · Porkcolombia-FNP',98,y+174,25,color);text(`Cobertura regional: ${d.cobertura[key]} de 6 plazas`,98,y+204,24,color);});
    line(1155);text(`Datos base: Porkcolombia-FNP · Boletín quincenal #${d.numeroBoletin}`,540,1196,26,wine,700,'center');
    text('Precios informativos. Cada productor define su referencia.',540,1234,24,wine,500,'center');
    text('La cobertura puede variar entre cortes.',540,1267,23,wine,500,'center');
    text('porcidata.algropork.com',540,1314,32,wine,800,'center');
    $('boletin-fecha').textContent=`Boletín #${d.numeroBoletin} · ${date(d.fechaISO)} · ${d.unidad}`;
    canvas.setAttribute('aria-label',`Boletín #${d.numeroBoletin}, ${date(d.fechaISO)}. `+categories.map(([k,n])=>`${n}: ${money(d.referenciasNacionales[k])} COP/kg, cobertura ${d.cobertura[k]} de 6 plazas`).join('. '));
    $('boletin-fuente').href=d.fuenteUrl;
    const save=(blob,ext)=>{const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=`porcidata-${d.fechaISO}-boletin-${d.numeroBoletin}.${ext}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);};
    $('boletin-png').onclick=()=>canvas.toBlob(b=>{if(b)save(b,'png');else $('boletin-error').textContent='No se pudo generar la imagen.';},'image/png');
    $('boletin-pdf').onclick=()=>{try{save(pdfDeCanvas(canvas),'pdf');}catch{$('boletin-error').textContent='No se pudo generar el PDF. Intenta descargar la imagen.';}};
    $('boletin-png').disabled=false;$('boletin-pdf').disabled=false;
  } catch { $('boletin-fecha').textContent='Descargas no disponibles: no se pudo preparar un boletín validado.';$('boletin-canvas').hidden=true; }
}
// One-page PDF embeds the same canvas as JPEG; offsets count bytes, not characters.
function pdfDeCanvas(canvas) {
  const jpg=Uint8Array.from(atob(canvas.toDataURL('image/jpeg',.96).split(',')[1]),c=>c.charCodeAt(0));
  const enc=new TextEncoder(),parts=[],offsets=[0];let size=0;
  const push=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);size+=b.length;};
  const obj=(n,s)=>{offsets[n]=size;push(`${n} 0 obj\n${s}\nendobj\n`);};
  push('%PDF-1.4\n');obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 576 720] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
  offsets[4]=size;push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);push(jpg);push('\nendstream\nendobj\n');
  const stream='q\n576 0 0 720 0 0 cm\n/Im0 Do\nQ\n';obj(5,`<< /Length ${enc.encode(stream).length} >>\nstream\n${stream}endstream`);
  const xref=size;push('xref\n0 6\n0000000000 65535 f \n');for(let n=1;n<=5;n++)push(`${String(offsets[n]).padStart(10,'0')} 00000 n \n`);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts,{type:'application/pdf'});
}
iniciarBoletin();
