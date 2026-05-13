const sampleProperties = [
  {id:1,title:'Cozy Family House',city:'Austin',price:320000,beds:3,baths:2,tag:'New',img:'https://picsum.photos/seed/1/600/400'},
  {id:2,title:'Modern Apartment',city:'Seattle',price:450000,beds:2,baths:1,tag:'Featured',img:'https://picsum.photos/seed/2/600/400'},
  {id:3,title:'Beachside Villa',city:'Miami',price:1250000,beds:4,baths:3,tag:'Luxury',img:'https://picsum.photos/seed/3/600/400'},
  {id:4,title:'Downtown Loft',city:'New York',price:780000,beds:1,baths:1,tag:'Hot',img:'https://picsum.photos/seed/4/600/400'},
  {id:5,title:'Suburban Home',city:'Austin',price:410000,beds:4,baths:3,tag:'Family',img:'https://picsum.photos/seed/5/600/400'},
  {id:6,title:'Country Cottage',city:'Nashville',price:225000,beds:2,baths:1,tag:'Cozy',img:'https://picsum.photos/seed/6/600/400'}
];

const state = { items: sampleProperties.slice(), page:1, perPage:6, filters:{min:0,max:9999999,sort:'newest',q:''} };

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function formatPrice(n){ return '$' + n.toLocaleString(); }

function render(){
  const listings = $('#listings'); listings.innerHTML='';
  const filtered = applyFilterLogic();
  const start=(state.page-1)*state.perPage; const pageItems = filtered.slice(start,start+state.perPage);
  if(pageItems.length===0){ listings.innerHTML = '<div class="muted">No properties found.</div>'; renderPagination(filtered.length); return }
  pageItems.forEach(p=>{
    const el = document.createElement('article'); el.className='card';
    el.innerHTML = `
      <div class="thumb" style="background-image:url('${p.img}')"></div>
      <div class="card-body">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3>${p.title}</h3><span class="badge">${p.tag}</span>
        </div>
        <div class="meta">
          <div>${p.city} · ${p.beds} bd · ${p.baths} ba</div>
          <div class="price">${formatPrice(p.price)}</div>
        </div>
      </div>
    `;
    listings.appendChild(el);
  });
  renderPagination(filtered.length);
}

function applyFilterLogic(){
  let arr = state.items.slice();
  const f = state.filters;
  if(f.q){ const q=f.q.toLowerCase(); arr = arr.filter(x=> (x.title+" "+x.city+" "+x.tag).toLowerCase().includes(q)); }
  arr = arr.filter(x=> x.price >= f.min && x.price <= f.max);
  if(f.sort==='price-asc') arr.sort((a,b)=>a.price-b.price);
  else if(f.sort==='price-desc') arr.sort((a,b)=>b.price-a.price);
  else arr.sort((a,b)=> b.id - a.id);
  return arr;
}

function renderPagination(total){
  const pages = Math.max(1, Math.ceil(total/state.perPage));
  const nav = $('#pagination'); nav.innerHTML='';
  for(let i=1;i<=pages;i++){
    const btn = document.createElement('button'); btn.className='page-btn'; btn.textContent = i;
    if(i===state.page) btn.disabled=true;
    btn.addEventListener('click',()=>{ state.page=i; render(); });
    nav.appendChild(btn);
  }
}

function bind(){
  $('#applyFilters').addEventListener('click',()=>{
    state.filters.min = Number($('#minPrice').value) || 0;
    state.filters.max = Number($('#maxPrice').value) || 9999999;
    state.filters.sort = $('#sortSelect').value;
    state.page=1; render();
  });
  $('#resetFilters').addEventListener('click',()=>{
    $('#minPrice').value=''; $('#maxPrice').value=''; $('#sortSelect').value='newest'; $('#searchInput').value='';
    state.filters = {min:0,max:9999999,sort:'newest',q:''}; state.page=1; render();
  });
  $('#searchBtn').addEventListener('click',()=>{ state.filters.q = $('#searchInput').value.trim(); state.page=1; render(); });
  $('#searchInput').addEventListener('keyup',e=>{ if(e.key==='Enter'){ $('#searchBtn').click(); } });
}

document.addEventListener('DOMContentLoaded',()=>{
  $('#year').textContent = new Date().getFullYear();
  bind(); render();
});
