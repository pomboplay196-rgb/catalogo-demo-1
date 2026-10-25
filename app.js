(() => {
  const cfg = window.CATALOG_CONFIG || {};
  const products = Array.isArray(window.CATALOG_PRODUCTS) ? window.CATALOG_PRODUCTS : [];
  const $ = (id) => document.getElementById(id);
  const state = { filtered: [], selected: null, quantity: 1, cart: [] };
  const money = (v) => new Intl.NumberFormat(cfg.locale || "pt-BR",{style:"currency",currency:cfg.currency||"BRL"}).format(v);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const waNumber = String(cfg.whatsapp || "").replace(/\D/g,"");
  const waUrl = (message) => `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  function toast(message){ const el=$("toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2600); }
  function setStoreText(){
    $("storeName").textContent=cfg.storeName||"VITRINE";
    $("footerStoreName").textContent=cfg.storeName||"VITRINE";
    $("footerStoreName2").textContent=cfg.storeName||"Vitrine";
    $("storeSubtitle").textContent=cfg.storeSubtitle||"CATÁLOGO DIGITAL";
    $("heroEyebrow").textContent=cfg.heroEyebrow||"CATÁLOGO DIGITAL";
    $("heroTitle").innerHTML=cfg.heroTitle||"Encontre o que<br><em>combina com você.</em>";
    $("heroDescription").textContent=cfg.heroDescription||"Explore nossos produtos e fale com a loja.";
    $("year").textContent=new Date().getFullYear();
    $("contactButton").href=waUrl("Olá! Gostaria de informações sobre os produtos do catálogo.");
  }
  function buildCategories(){
    const select=$("categoryFilter");
    [...new Set(products.map(p=>p.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"pt-BR")).forEach(cat=>{
      const option=document.createElement("option"); option.value=cat; option.textContent=cat; select.appendChild(option);
    });
  }
  function productCard(p){
    return `<article class="product-card">
      <div class="product-image-wrap" data-detail="${esc(p.id)}" tabindex="0" role="button" aria-label="Ver detalhes de ${esc(p.name)}">
        <img class="product-image" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.background='#dedbd3';this.parentElement.insertAdjacentHTML('beforeend','<span style=&quot;padding:20px;color:#555&quot;>Adicione a foto do produto</span>')">
        <span class="product-tag">${esc(p.tag||"DESTAQUE")}</span><button class="quick-view" data-detail="${esc(p.id)}">Ver detalhes</button>
      </div>
      <div class="product-meta"><span class="product-category">${esc(p.category)}</span>
        <div class="product-title-row"><span class="product-title">${esc(p.name)}</span><span class="product-price">${money(p.price)}</span></div>
        <p class="product-description">${esc(p.description)}</p>
        <div class="card-actions"><button class="small-button" data-detail="${esc(p.id)}">Detalhes</button><button class="small-button dark" data-order="${esc(p.id)}">Pedir ↗</button></div>
      </div></article>`;
  }
  function applyFilters(){
    const query=$("searchInput").value.trim().toLocaleLowerCase("pt-BR");
    const category=$("categoryFilter").value;
    const sort=$("sortSelect").value;
    let list=products.filter(p=>{
      const hay=[p.name,p.category,p.description,p.tag].join(" ").toLocaleLowerCase("pt-BR");
      return hay.includes(query)&&(category==="all"||p.category===category);
    });
    if(sort==="price-asc") list.sort((a,b)=>a.price-b.price);
    else if(sort==="price-desc") list.sort((a,b)=>b.price-a.price);
    else if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
    else list.sort((a,b)=>Number(b.featured)-Number(a.featured));
    state.filtered=list;
    $("productGrid").innerHTML=list.map(productCard).join("");
    $("resultsCount").textContent=`${list.length} ${list.length===1?"produto":"produtos"}`;
    $("emptyState").classList.toggle("hidden",list.length>0);
    $("productGrid").classList.toggle("hidden",list.length===0);
  }
  function openProduct(id){
    const p=products.find(item=>item.id===id); if(!p)return;
    state.selected=p;state.quantity=1;
    $("modalCategory").textContent=p.category||"PRODUTO";
    $("modalTitle").textContent=p.name;
    $("modalPrice").textContent=money(p.price);
    $("modalDescription").textContent=p.description;
    $("qtyValue").textContent="1";
    $("modalImage").innerHTML=`<img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.outerHTML='<p style=&quot;padding:20px;color:#555&quot;>Adicione a foto real deste produto</p>'">`;
    $("productModal").classList.remove("hidden");document.body.style.overflow="hidden";
  }
  function closeProduct(){ $("productModal").classList.add("hidden");document.body.style.overflow=""; }
  function directOrder(p,qty=1){
    if(!waNumber){toast("Configure o número de WhatsApp em config.js.");return;}
    const msg=`${cfg.whatsappGreeting||"Olá! Tenho interesse neste produto:"}\n• ${p.name}\n• Quantidade: ${qty}\n• Preço de referência: ${money(p.price)}\n\nVi este item no catálogo. Pode confirmar disponibilidade e condições?`;
    window.open(waUrl(msg),"_blank","noopener");
  }
  function addToCart(p,qty=1){
    const existing=state.cart.find(i=>i.id===p.id);
    if(existing)existing.qty+=qty;else state.cart.push({id:p.id,qty});
    renderCart();closeProduct();toast("Produto adicionado ao pedido.");
  }
  function renderCart(){
    $("cartCount").textContent=state.cart.reduce((n,i)=>n+i.qty,0);
    if(!state.cart.length){$("cartItems").innerHTML='<div class="empty-state"><span>▤</span><h3>Seu pedido está vazio</h3><p>Adicione produtos para montar sua solicitação.</p></div>';}
    else $("cartItems").innerHTML=state.cart.map(item=>{
      const p=products.find(x=>x.id===item.id);if(!p)return "";
      return `<div class="cart-item"><img src="${esc(p.image)}" alt=""><div><h3>${esc(p.name)}</h3><p>Qtd. ${item.qty} × ${money(p.price)}</p><button data-remove="${esc(p.id)}">Remover</button></div><strong>${money(p.price*item.qty)}</strong></div>`;
    }).join("");
    const total=state.cart.reduce((sum,item)=>{const p=products.find(x=>x.id===item.id);return sum+(p?p.price*item.qty:0)},0);
    $("cartTotal").textContent=money(total);
  }
  function openCart(){ $("cartBackdrop").classList.remove("hidden");$("cartDrawer").classList.add("open");$("cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"; }
  function closeCart(){ $("cartBackdrop").classList.add("hidden");$("cartDrawer").classList.remove("open");$("cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow=""; }
  function checkout(){
    if(!state.cart.length){toast("Adicione pelo menos um produto.");return;}
    if(!waNumber){toast("Configure o número de WhatsApp em config.js.");return;}
    const lines=state.cart.map(item=>{const p=products.find(x=>x.id===item.id);return p?`• ${p.name} — ${item.qty} × ${money(p.price)} = ${money(p.price*item.qty)}`:"";}).filter(Boolean);
    const total=state.cart.reduce((sum,item)=>{const p=products.find(x=>x.id===item.id);return sum+(p?p.price*item.qty:0)},0);
    const msg=`${cfg.whatsappGreeting||"Olá! Gostaria de fazer um pedido:"}\n\n${lines.join("\n")}\n\nTotal estimado: ${money(total)}\n\nSei que os preços e a disponibilidade precisam ser confirmados pela loja.`;
    window.open(waUrl(msg),"_blank","noopener");
  }
  $("searchInput").addEventListener("input",applyFilters);
  $("categoryFilter").addEventListener("change",applyFilters);
  $("sortSelect").addEventListener("change",applyFilters);
  $("clearFilters").addEventListener("click",()=>{$("searchInput").value="";$("categoryFilter").value="all";$("sortSelect").value="featured";applyFilters();});
  $("productGrid").addEventListener("click",e=>{
    const detail=e.target.closest("[data-detail]");const order=e.target.closest("[data-order]");
    if(detail){e.preventDefault();openProduct(detail.dataset.detail);}
    else if(order){e.preventDefault();const p=products.find(x=>x.id===order.dataset.order);if(p)directOrder(p);}
  });
  $("productGrid").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-detail]")){e.preventDefault();openProduct(e.target.dataset.detail);}});
  $("modalClose").addEventListener("click",closeProduct);
  $("productModal").addEventListener("click",e=>{if(e.target===$("productModal"))closeProduct();});
  $("qtyMinus").addEventListener("click",()=>{state.quantity=Math.max(1,state.quantity-1);$("qtyValue").textContent=state.quantity;});
  $("qtyPlus").addEventListener("click",()=>{state.quantity=Math.min(99,state.quantity+1);$("qtyValue").textContent=state.quantity;});
  $("addToCart").addEventListener("click",()=>{if(state.selected)addToCart(state.selected,state.quantity);});
  $("modalWhatsApp").addEventListener("click",()=>{if(state.selected)directOrder(state.selected,state.quantity);});
  $("cartButton").addEventListener("click",openCart);$("cartClose").addEventListener("click",closeCart);$("cartBackdrop").addEventListener("click",closeCart);
  $("cartItems").addEventListener("click",e=>{const btn=e.target.closest("[data-remove]");if(btn){state.cart=state.cart.filter(i=>i.id!==btn.dataset.remove);renderCart();}});
  $("checkoutButton").addEventListener("click",checkout);
  $("emptyCart").addEventListener("click",()=>{state.cart=[];renderCart();toast("Pedido esvaziado.");});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeProduct();closeCart();}});
  setStoreText();buildCategories();applyFilters();renderCart();
})();