const IMAGES = [
  "./assets/campi-diomedei-scavo-panorama.jpg",
  "./assets/campi-diomedei-ricostruzione.jpg",
  "./assets/campi-diomedei-park.jpg",
  "./assets/campi-diomedei-compound.jpg",
];
let currentImage = IMAGES[0];

function renderImageStage(stage, src){
  stage.innerHTML = `<div class="overlayTag" id="stageTag">IMMAGINI</div>`;
  const wrap = document.createElement("div");
  wrap.className = "stageImgWrap";
  const img = document.createElement("img");
  img.className = "stageImg";
  img.src = src;
  img.alt = "Campi Diomedei";
  img.addEventListener("click", ()=> openImageModal(src));
  wrap.appendChild(img);
  stage.appendChild(wrap);
}

function setActiveTool(tool){
  qsa(".toolChip").forEach(c => c.classList.toggle("active", c.dataset.tool === tool));
  const stage = qs("#mediaStage");

  const youtubeId = "jQPxf3NOF0w";
  const mapsUrl = "https://www.google.com/maps?q=41.458009,15.560695&z=16&output=embed";
  const mapsLink = "https://www.google.com/maps?q=41.458009,15.560695";

  // clear
  stage.innerHTML = `<div class="overlayTag" id="stageTag">${tool.toUpperCase()}</div>`;

  // default: hide gallery and external
  qs("#galleryWrap").style.display = "none";
  const out = qs("#openExternal");
  if(out){ out.style.display = "none"; out.href = "#"; }

  if(tool === "video"){
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`;
    iframe.title = "Video - Campi Diomedei";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    stage.appendChild(iframe);
  } else if(tool === "map"){
    stage.innerHTML = `<div class="overlayTag" id="stageTag">MAP</div>`;
    const iframe = document.createElement("iframe");
    iframe.title = "Google Maps - Campi Diomedei";
    iframe.src = mapsUrl;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;
    stage.appendChild(iframe);

    if(out){
      out.href = mapsLink;
      out.style.display = "inline-flex";
      out.dataset.kind = "maps";
    }
  } else if(tool === "immagini"){
    qs("#galleryWrap").style.display = "block";
    renderImageStage(stage, currentImage);
  } else if(tool === "3d"){
    stage.innerHTML = `<div class="overlayTag" id="stageTag">3D</div>`;
    const iframe = document.createElement("iframe");
    iframe.title = "Villaggio Campi Diomedei - Foggia (Sketchfab)";
    iframe.src = "https://sketchfab.com/models/0a306cc6e14647f1960cd30c82fe0b2c/embed";
    iframe.allow = "autoplay; fullscreen; xr-spatial-tracking";
    iframe.setAttribute("xr-spatial-tracking","true");
    iframe.allowFullscreen = true;
    stage.appendChild(iframe);

    if(out){
      out.href = "https://sketchfab.com/models/0a306cc6e14647f1960cd30c82fe0b2c";
      out.style.display = "inline-flex";
      out.dataset.kind = "sketchfab";
    }
  } else {
    // fallback: show images picker stage
    qs("#galleryWrap").style.display = "block";
    renderImageStage(stage, currentImage);
  }
}

async function loadText(){
  const box = qs("#textContent");
  try{
    const res = await fetch("./txt/Diomedei.txt", {cache:"no-cache"});
    const txt = await res.text();
    box.textContent = txt;
  }catch(e){
    box.innerHTML = `<span class="muted">Non riesco a caricare il testo (Diomedei.txt). Controlla che sia in /txt.</span>`;
  }
}

function initGallery(){
  const wrap = qs("#gallery");
  wrap.innerHTML = "";
  IMAGES.forEach((src, idx)=>{
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Campi Diomedei";
    img.loading = "lazy";
    img.classList.toggle("selected", src === currentImage);

    img.addEventListener("click", ()=>{
      currentImage = src;
      qsa("#gallery img").forEach(i => i.classList.toggle("selected", i === img));
      if(qs(".toolChip.active")?.dataset.tool === "immagini"){
        renderImageStage(qs("#mediaStage"), currentImage);
      }
    });

    // long press / double tap: open fullscreen
    img.addEventListener("dblclick", ()=> openImageModal(src));
    wrap.appendChild(img);
  });
}

function openImageModal(src){
  const bd = qs("#imgModal");
  const img = qs("#modalImg");
  img.src = src;
  bd.classList.add("open");
}
function closeImageModal(){
  qs("#imgModal").classList.remove("open");
}

function initCampi(){
  renderDrawer();
  initTheme(qs("#themeSelect"));
  initPWA();

  // header actions
  qs("#btnMenu")?.addEventListener("click", openDrawer);
  qs("#drawerBackdrop")?.addEventListener("click", closeDrawer);
  qs("#btnCloseDrawer")?.addEventListener("click", closeDrawer);

  qs("#btnChat")?.addEventListener("click", ()=> window.open(APP.CHATBOT_URL, "_blank"));

  // tools
  qsa(".toolChip").forEach(chip=>{
    chip.addEventListener("click", ()=> setActiveTool(chip.dataset.tool));
  });

  // modal
  qs("#modalClose")?.addEventListener("click", closeImageModal);
  qs("#imgModal")?.addEventListener("click", (e)=>{ if(e.target.id==="imgModal") closeImageModal(); });

  initGallery();
  loadText();
  setActiveTool("video");
}

document.addEventListener("DOMContentLoaded", initCampi);
