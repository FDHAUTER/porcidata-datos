const zones={todos:'Todos',cabeza:'Cabeza',paleta:'Paleta',lomo:'Lomo',costilla:'Costilla',barriga:'Barriga',pierna:'Pierna',otros:'Otros productos'};
const products=[
['Chuleta de lomo','lomo','Corte de lomo con hueso. Consulta grosor, porcionado y presentación.'],
['Lomo de cerdo','lomo','Pieza del dorso. Consulta presentación entera o porcionada.'],
['Solomito de cerdo','lomo','Corte pequeño del interior del lomo. Consulta disponibilidad y presentación.'],
['Cabeza de lomo','lomo','Corte de la zona anterior del lomo. Confirma la denominación y el desposte con nuestro equipo.'],
['Costilla de cerdo','costilla','Costillar para distintas preparaciones. Consulta corte, tamaño y presentación.'],
['Costilla porcionada','costilla','Costilla cortada en porciones. El tamaño se acuerda al consultar.'],
['Tocino barriguero','barriga','Corte de la barriga con capas de carne y grasa. Consulta presentación.'],
['Panceta','barriga','Referencia de barriga de cerdo. Confirma si la presentación lleva piel.'],
['Paleta de cerdo','paleta','Pieza del cuarto delantero. Consulta opciones con hueso o deshuesadas.'],
['Brazuelo','paleta','Corte del miembro delantero. Consulta tipo de desposte y presentación.'],
['Codillo delantero','paleta','Corte de la extremidad delantera. Consulta porcionado y disponibilidad.'],
['Pierna de cerdo','pierna','Pieza del cuarto trasero. Consulta opciones con hueso o deshuesadas.'],
['Pulpa de pierna','pierna','Carne deshuesada de pierna. Confirma selección, empaque y presentación.'],
['Codillo trasero','pierna','Corte de la extremidad trasera. Consulta presentación y disponibilidad.'],
['Cabeza de cerdo','cabeza','Consulta disponibilidad, limpieza y forma de entrega.'],
['Papada','cabeza','Corte de la zona inferior de la cabeza. Consulta presentación.'],
['Orejas','cabeza','Producto bajo consulta. Confirma limpieza y presentación.'],
['Pulpa de cerdo','otros','Consulta origen del corte, selección y presentación.'],
['Recortes de cerdo','otros','Consulta composición y proporción de carne y grasa; no se presupone una especificación.'],
['Grasa de cerdo','otros','Consulta tipo, presentación y destino de uso.'],
['Piel de cerdo','otros','Consulta limpieza, tamaño y presentación.'],
['Patas de cerdo','otros','Consulta presentación y disponibilidad.'],
['Vísceras','otros','Consulta el producto específico y las condiciones de suministro.']
];
const wa=text=>'https://wa.me/573113298884?text='+encodeURIComponent(text);
let selected='todos';
const filters=document.querySelector('#filters'),cards=document.querySelector('#cards'),search=document.querySelector('#search');
for(const [key,label] of Object.entries(zones)){const b=document.createElement('button');b.textContent=label;b.dataset.zone=key;b.addEventListener('click',()=>select(key));filters.append(b)}
document.querySelectorAll('svg .zone').forEach(p=>{p.setAttribute('role','button');p.setAttribute('tabindex','0');p.setAttribute('aria-label','Ver cortes de '+zones[p.dataset.zone]);p.addEventListener('click',()=>select(p.dataset.zone));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(p.dataset.zone)}})});
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function select(key){selected=key;render()}
function render(){document.querySelectorAll('[data-zone]').forEach(el=>{const active=el.dataset.zone===selected;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active))});const list=products.filter(([name,z])=>(selected==='todos'||selected===z)&&normalize(name).includes(normalize(search.value)));cards.replaceChildren();for(const [name,z,desc]of list){const article=document.createElement('article');article.className='card';article.innerHTML='<div class="art"><span>'+zones[z]+'</span><svg viewBox="0 0 120 80" aria-hidden="true"><path d="M19 53Q5 31 30 19Q45 8 60 20Q85 2 106 22Q119 42 99 59Q64 82 19 53Z" fill="#d2a690" stroke="#7c2938" stroke-width="2"/><path d="M28 43Q48 21 86 33M39 58Q59 39 99 44" fill="none" stroke="#fffcf1" stroke-width="5" stroke-linecap="round"/></svg></div><div class="body"><span class="badge">Bajo consulta · Ilustración orientativa</span><h3></h3><p></p><a target="_blank" rel="noopener">Consultar por WhatsApp ↗</a></div>';article.querySelector('h3').textContent=name;article.querySelector('p').textContent=desc;const a=article.querySelector('a');a.href=wa('Hola, ALGROPORK. Quisiera consultar disponibilidad, presentación y precio de: '+name+'.');a.setAttribute('aria-label','Consultar '+name+' por WhatsApp');cards.append(article)}document.querySelector('#results-title').textContent=selected==='todos'?'Todos los cortes':zones[selected];document.querySelector('#count').textContent=list.length+' referencias';document.querySelector('#empty').hidden=list.length>0}
search.addEventListener('input',render);document.querySelector('#general').href=wa('Hola, ALGROPORK. Quisiera consultar disponibilidad y precios de sus cortes de cerdo.');render();
