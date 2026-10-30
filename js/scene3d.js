import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const OPENED_KEY = "cartas-para-a-nana:opened";

function getOpenedIds() {
  try {
    const v = JSON.parse(localStorage.getItem(OPENED_KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function saveOpenedIds(arr) {
  localStorage.setItem(OPENED_KEY, JSON.stringify(arr));
}
function jitter(seed) {
  const x = Math.sin(seed * 999.7) * 10000;
  return x - Math.floor(x) - 0.5; // -0.5..0.5
}

let scene, camera, renderer, raycaster, pointer, clock;
let candleLight, flameSprite, flameFlicker = 0;
let container;
const envelopes = []; // records
let pendingRec = null;
let hovered = null;
let stackHintEl = null;
let frameCount = 0;
const tmpVec = new THREE.Vector3();

function init() {
  container = document.getElementById("scene-container");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x120d08);
  scene.fog = new THREE.FogExp2(0x120d08, 0.07);

  camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 3.4, 6.2);
  camera.lookAt(0, 0.3, 0);

  // tablets/celulares costumam ter devicePixelRatio alto (2-3x), o que fica
  // muito pesado pra renderizar sombras em tempo real — limitamos mais ali
  const isTouchDevice = matchMedia("(pointer: coarse)").matches || /Mobi|Android|iPad|iPhone/i.test(navigator.userAgent);
  const maxPixelRatio = isTouchDevice ? 1.5 : 2;

  renderer = new THREE.WebGLRenderer({ antialias: !isTouchDevice, powerPreference: "high-performance" });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  buildLights();
  buildDesk();
  buildCandle(-2.3, 0.5);
  buildCandle(2.5, -0.3, 0.75);
  buildVase();
  buildEasterEggs();
  buildEnvelopeStack();

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  clock = new THREE.Clock();

  renderer.domElement.addEventListener("click", onClick);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  window.addEventListener("resize", onResize);

  document.getElementById("close-letter").addEventListener("click", closeLetter);
  document.getElementById("letter-overlay").addEventListener("click", (e) => {
    if (e.target.id === "letter-overlay") closeLetter();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLetter();
  });

  initMusic();

  document.getElementById("scene-loading").style.display = "none";

  stackHintEl = document.getElementById("stack-hint");

  initRevisitPanel();

  animate();
}

// ---------- reler carta já lida, por data ----------

function initRevisitPanel() {
  const toggle = document.getElementById("revisit-toggle");
  const panel = document.getElementById("revisit-panel");
  const closeBtn = document.getElementById("revisit-close");

  toggle.addEventListener("click", () => {
    populateRevisitList();
    panel.classList.remove("hidden");
    toggle.setAttribute("aria-expanded", "true");
  });
  const close = () => {
    panel.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");
  };
  closeBtn.addEventListener("click", close);
  panel.addEventListener("click", (e) => {
    if (e.target.id === "revisit-panel") close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.classList.contains("hidden")) close();
  });

  refreshRevisitToggle();
}

function refreshRevisitToggle() {
  const toggle = document.getElementById("revisit-toggle");
  if (!toggle) return;
  toggle.classList.toggle("hidden", getOpenedIds().length === 0);
}

function populateRevisitList() {
  const list = document.getElementById("revisit-list");
  const opened = getOpenedIds();
  list.innerHTML = "";
  LETTERS.filter((letter) => opened.includes(letter.id)).forEach((letter) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "revisit-item-btn";
    btn.textContent = letter.date || letter.title;
    btn.addEventListener("click", () => {
      document.getElementById("revisit-panel").classList.add("hidden");
      document.getElementById("revisit-toggle").setAttribute("aria-expanded", "false");
      const rec = envelopes.find((r) => r.letter.id === letter.id);
      if (rec) openLetter(rec);
    });
    li.appendChild(btn);
    list.appendChild(li);
  });
}

// mantém o brilho exatamente em cima do envelope que deve ser clicado,
// seguindo a posição 3D projetada na tela a cada frame
function updateStackHint() {
  if (!stackHintEl) return;
  const target = envelopes.find((r) => r.interactive && r.pile === "unread" && !r.opening);
  if (!target) {
    stackHintEl.classList.add("hidden");
    return;
  }
  target.group.getWorldPosition(tmpVec);
  tmpVec.y += 0.12;
  const screen = worldToScreen(tmpVec);
  const containerRect = container.getBoundingClientRect();
  stackHintEl.style.left = `${screen.x - containerRect.left}px`;
  stackHintEl.style.top = `${screen.y - containerRect.top}px`;
  stackHintEl.classList.remove("hidden");
}

function buildLights() {
  const hemi = new THREE.HemisphereLight(0x6a5338, 0x14100a, 1.1);
  scene.add(hemi);

  candleLight = new THREE.PointLight(0xffb067, 5.5, 13, 1.8);
  candleLight.position.set(-2.3, 1.15, 0.5);
  candleLight.castShadow = true;
  candleLight.shadow.mapSize.set(512, 512);
  candleLight.shadow.bias = -0.003;
  scene.add(candleLight);

  const candleLight2 = new THREE.PointLight(0xffb067, 2.6, 10, 1.8);
  candleLight2.position.set(2.5, 1.15, -0.3);
  scene.add(candleLight2);

  const fill = new THREE.PointLight(0xffdca8, 1.1, 16);
  fill.position.set(2.5, 2.8, 3.5);
  scene.add(fill);

  const eggFill = new THREE.PointLight(0xffcf9e, 1.4, 9, 1.6);
  eggFill.position.set(0, 1.6, -1.2);
  scene.add(eggFill);

  const rim = new THREE.PointLight(0x6a4a2c, 0.6, 16);
  rim.position.set(0, 2, -3);
  scene.add(rim);
}

function woodTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#4a3220";
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 40; i++) {
    const y = (i / 40) * 512 + Math.sin(i) * 4;
    ctx.strokeStyle = `rgba(0,0,0,${0.06 + Math.random() * 0.08})`;
    ctx.lineWidth = 2 + Math.random() * 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * 0.03 + i) * 3);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

const TABLE_H = 1.25; // height of the tabletop surface above the floor

function buildDesk() {
  const topThickness = 0.22;
  const topW = 7.6, topD = 4.6;
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTexture(),
    roughness: 0.78,
    metalness: 0.04,
  });

  const top = new THREE.Mesh(new THREE.BoxGeometry(topW, topThickness, topD), woodMat);
  top.position.y = -topThickness / 2;
  top.castShadow = true;
  top.receiveShadow = true;
  scene.add(top);

  const legGeo = new THREE.CylinderGeometry(0.1, 0.09, TABLE_H - topThickness, 10);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x2e1f12, roughness: 0.6 });
  const legOffsets = [
    [topW / 2 - 0.35, topD / 2 - 0.35],
    [-(topW / 2 - 0.35), topD / 2 - 0.35],
    [topW / 2 - 0.35, -(topD / 2 - 0.35)],
    [-(topW / 2 - 0.35), -(topD / 2 - 0.35)],
  ];
  legOffsets.forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(x, -topThickness - (TABLE_H - topThickness) / 2, z);
    leg.castShadow = true;
    leg.receiveShadow = true;
    scene.add(leg);
  });

  buildFloorAndRug();
}

function rugTexture() {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#5c1f22";
  ctx.fillRect(0, 0, size, size);

  // border
  ctx.strokeStyle = "#caa15a";
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, size - 40, size - 40);
  ctx.strokeStyle = "#3c1416";
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, size - 80, size - 80);

  // diamond lattice motif
  ctx.strokeStyle = "rgba(202,161,90,0.55)";
  ctx.lineWidth = 2;
  const step = 48;
  for (let x = 70; x < size - 70; x += step) {
    for (let y = 70; y < size - 70; y += step) {
      ctx.beginPath();
      ctx.moveTo(x + step / 2, y);
      ctx.lineTo(x + step, y + step / 2);
      ctx.lineTo(x + step / 2, y + step);
      ctx.lineTo(x, y + step / 2);
      ctx.closePath();
      ctx.stroke();
    }
  }

  // central medallion
  ctx.fillStyle = "rgba(202,161,90,0.5)";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 54, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#5c1f22";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 38, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildFloorAndRug() {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: 0x1b140d, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -TABLE_H;
  floor.receiveShadow = true;
  scene.add(floor);

  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 6.5),
    new THREE.MeshStandardMaterial({ map: rugTexture(), roughness: 0.95 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.y = -TABLE_H + 0.01;
  rug.receiveShadow = true;
  scene.add(rug);
}

function makeFlameTexture() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size * 0.62, 2, size / 2, size * 0.55, size / 2);
  grad.addColorStop(0, "rgba(255,255,225,1)");
  grad.addColorStop(0.35, "rgba(255,170,60,0.95)");
  grad.addColorStop(1, "rgba(255,70,10,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

const flames = [];

function buildCandle(x, z, scale = 1) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.scale.setScalar(scale);

  const waxMat = new THREE.MeshStandardMaterial({ color: 0xf2e6c9, roughness: 0.45 });
  const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.85, 24), waxMat);
  wax.position.y = 0.425;
  wax.castShadow = true;
  wax.receiveShadow = true;
  group.add(wax);

  // a little dripped wax pool for realism
  const pool = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.03, 24),
    new THREE.MeshStandardMaterial({ color: 0xe8d9b0, roughness: 0.5 })
  );
  pool.position.y = 0.015;
  pool.receiveShadow = true;
  group.add(pool);

  const wick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.08, 6),
    new THREE.MeshStandardMaterial({ color: 0x1a1512 })
  );
  wick.position.y = 0.89;
  group.add(wick);

  const flameMat = new THREE.SpriteMaterial({
    map: makeFlameTexture(),
    color: 0xffb257,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const flame = new THREE.Sprite(flameMat);
  flame.scale.set(0.22, 0.36, 1);
  flame.position.y = 1.02;
  group.add(flame);
  flames.push(flame);

  const glow = new THREE.PointLight(0xffa94d, 0.5, 2.2, 2);
  glow.position.y = 1.02;
  group.add(glow);
  flames.push(glow);

  scene.add(group);
}

function buildVase() {
  const group = new THREE.Group();
  group.position.set(-2.3, 0, -1.1);

  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.13, 0.5, 16, 1, true),
    new THREE.MeshPhysicalMaterial({
      color: 0xbcd4e0,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 0.2,
    })
  );
  glass.position.y = 0.25;
  group.add(glass);

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x6b7a4e, roughness: 0.8 });
  const petalMat = new THREE.MeshStandardMaterial({ color: 0xcf8f7a, roughness: 0.7 });

  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.55, 6), stemMat);
    stem.position.set(Math.cos(a) * 0.05, 0.5 + i * 0.03, Math.sin(a) * 0.05);
    stem.rotation.z = Math.cos(a) * 0.25;
    stem.rotation.x = Math.sin(a) * 0.25;
    stem.castShadow = true;
    group.add(stem);

    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), petalMat);
    petal.position.set(Math.cos(a) * 0.14, 0.78 + i * 0.03, Math.sin(a) * 0.14);
    petal.scale.set(1, 0.7, 1);
    petal.castShadow = true;
    group.add(petal);
  }

  scene.add(group);
}

// ---------- Easter eggs: objetos do relacionamento ----------

function addMesh(group, geo, mat, x, y, z, opts = {}) {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  if (opts.scale) mesh.scale.set(...opts.scale);
  if (opts.rotation) mesh.rotation.set(...opts.rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function buildEasterEggs() {
  // espalhados pela mesa em profundidades e ângulos diferentes, não em fileira
  buildCapybara(-1.9, -0.55);
  buildGuaravita(-0.9, -0.1);
  buildStamp(0.5, -1.9, 0.3);
  buildLapras(1.7, -0.6);
  buildMacawFigurine(0.9, -0.1);
  buildPictureFrame(-3.0, -1.7);
  buildPaintedBox(-1.15, 1.3, -0.2);
}

// caixinha de madeira com a tampa pintada à mão pela Nana (casa voadora com
// balões, estilo "Up") — a arte vem de assets/caixa-casa-baloes.png
function buildPaintedBox(x, z, rotY = 0) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotY;

  const boxW = 0.78, boxH = 0.16, boxD = 0.78;
  const sideMat = new THREE.MeshStandardMaterial({ color: 0x241810, roughness: 0.7 });
  const bottomMat = new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.8 });

  const lidTex = new THREE.TextureLoader().load("assets/caixa-casa-baloes.png?v=2");
  lidTex.colorSpace = THREE.SRGBColorSpace;
  const lidMat = new THREE.MeshStandardMaterial({ map: lidTex, roughness: 0.6 });

  // ordem das faces do BoxGeometry: +x, -x, +y (topo), -y (fundo), +z, -z
  const materials = [sideMat, sideMat, lidMat, bottomMat, sideMat, sideMat];
  const box = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, boxD), materials);
  box.position.y = boxH / 2;
  box.castShadow = true;
  box.receiveShadow = true;
  group.add(box);

  // luz própria, pra garantir que a arte pintada apareça bem mesmo longe das velas
  const boxLight = new THREE.PointLight(0xfff0d8, 0.45, 2.2, 2);
  boxLight.position.set(0, 0.6, 0.15);
  group.add(boxLight);

  scene.add(group);
}

function buildCapybara(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = jitter(x * 7) * 1.2;

  const furMat = new THREE.MeshStandardMaterial({ color: 0x6b4a30, roughness: 0.95 });
  const scarfMat = new THREE.MeshStandardMaterial({ color: 0xee8a1a, roughness: 0.8 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.6 });

  const body = addMesh(group, new THREE.SphereGeometry(0.26, 20, 16), furMat, 0, 0.22, 0, { scale: [1, 0.8, 1.15] });
  const head = addMesh(group, new THREE.SphereGeometry(0.19, 20, 16), furMat, 0, 0.38, 0.22, { scale: [1, 0.92, 0.95] });
  addMesh(group, new THREE.SphereGeometry(0.1, 10, 8), furMat, -0.12, 0.5, 0.16, { scale: [0.8, 0.7, 0.6] });
  addMesh(group, new THREE.SphereGeometry(0.1, 10, 8), furMat, 0.12, 0.5, 0.16, { scale: [0.8, 0.7, 0.6] });

  // lenço laranja no pescoço
  addMesh(group, new THREE.TorusGeometry(0.17, 0.065, 10, 20), scarfMat, 0, 0.3, 0.14, { rotation: [Math.PI / 2 + 0.25, 0, 0] });

  // rosto
  addMesh(group, new THREE.SphereGeometry(0.018, 6, 6), darkMat, -0.07, 0.4, 0.38);
  addMesh(group, new THREE.SphereGeometry(0.018, 6, 6), darkMat, 0.07, 0.4, 0.38);
  addMesh(group, new THREE.SphereGeometry(0.014, 6, 6), darkMat, 0, 0.33, 0.4);

  // patinhas
  [-0.14, 0.14].forEach((px) => {
    addMesh(group, new THREE.SphereGeometry(0.07, 10, 8), furMat, px, 0.06, 0.16, { scale: [1, 0.7, 1] });
  });

  scene.add(group);
}

function lapracTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#a9d6ea";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "#f3e2a4";
  ctx.beginPath();
  ctx.ellipse(64, 95, 48, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6fb9d6";
  [[30, 55], [55, 70], [40, 90]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, 7, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
  });
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildLapras(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = jitter(x * 5) * 1.2;

  const skinMat = new THREE.MeshStandardMaterial({ map: lapracTexture(), roughness: 0.9 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.4 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

  // corpo mais arredondado e cheio (menos "espremido")
  addMesh(group, new THREE.SphereGeometry(0.3, 22, 18), skinMat, 0, 0.24, 0, { scale: [1.25, 0.95, 1.1] });
  // casco nas costas, pra dar volume de concha
  addMesh(group, new THREE.SphereGeometry(0.24, 18, 14), skinMat, 0, 0.42, -0.04, { scale: [1, 0.55, 0.85] });
  const head = addMesh(group, new THREE.SphereGeometry(0.19, 18, 14), skinMat, 0, 0.4, 0.3, { scale: [0.95, 0.9, 0.95] });

  // "chifres" curvos
  [-0.1, 0.1].forEach((hx) => {
    addMesh(group, new THREE.TorusGeometry(0.065, 0.026, 8, 12, Math.PI * 1.3), skinMat, hx, 0.52, 0.24, {
      rotation: [0.3, hx > 0 ? -0.6 : 0.6, 0.6],
    });
  });

  // olhos simétricos (os dois lados)
  [-0.1, 0.1].forEach((ex) => {
    addMesh(group, new THREE.SphereGeometry(0.055, 10, 8), whiteMat, ex, 0.43, 0.45, { scale: [1, 1.3, 0.6] });
    addMesh(group, new THREE.SphereGeometry(0.03, 8, 8), darkMat, ex, 0.43, 0.49);
  });

  // nadadeiras
  [-0.27, 0.27].forEach((fx) => {
    addMesh(group, new THREE.SphereGeometry(0.12, 10, 8), skinMat, fx, 0.12, 0.12, { scale: [0.6, 0.5, 1.1] });
  });

  scene.add(group);
}

function guaravitaTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#d8d8d8";
  ctx.fillRect(0, 0, 128, 128);
  ctx.save();
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, Math.PI * 2);
  ctx.clip();
  const stripes = ["#2e9b4f", "#f2c12e", "#5a2e86", "#f2c12e"];
  stripes.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.save();
    ctx.translate(64, 64);
    ctx.rotate(-0.35);
    ctx.fillRect(-70, -64 + i * 32, 140, 30);
    ctx.restore();
  });
  ctx.restore();
  ctx.fillStyle = "#c0392b";
  ctx.font = "bold 20px Georgia";
  ctx.textAlign = "center";
  ctx.fillText("Guaravita", 64, 70);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildGuaravita(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = jitter(x * 9) * 1.5;
  group.scale.setScalar(1.6);

  const cupLight = new THREE.PointLight(0xffd9a0, 0.7, 2.2, 2);
  cupLight.position.set(0, 0.2, 0.08);
  group.add(cupLight);

  const cupMat = new THREE.MeshStandardMaterial({ color: 0xf1e4c0, roughness: 0.3, metalness: 0.1 });
  addMesh(group, new THREE.CylinderGeometry(0.095, 0.08, 0.14, 20), cupMat, 0, 0.07, 0);

  const lidMat = new THREE.MeshStandardMaterial({
    map: guaravitaTexture(),
    metalness: 0.75,
    roughness: 0.3,
  });
  addMesh(group, new THREE.CylinderGeometry(0.1, 0.1, 0.012, 24), lidMat, 0, 0.145, 0);

  scene.add(group);
}

function buildStamp(x, z, rotY = 0) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotY;

  const padMat = new THREE.MeshStandardMaterial({ color: 0x15151a, roughness: 0.7 });
  addMesh(group, new THREE.BoxGeometry(0.34, 0.022, 0.26), padMat, 0, 0.011, 0);

  const woodMat = new THREE.MeshStandardMaterial({ color: 0xcfa05c, roughness: 0.6 });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0xb6833f, roughness: 0.6 });
  addMesh(group, new THREE.CylinderGeometry(0.11, 0.1, 0.05, 8), darkWood, 0.03, 0.045, 0);
  addMesh(group, new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8), woodMat, 0.03, 0.09, 0);
  addMesh(group, new THREE.CylinderGeometry(0.018, 0.028, 0.1, 10), woodMat, 0.03, 0.17, 0);
  addMesh(group, new THREE.SphereGeometry(0.035, 10, 8), woodMat, 0.03, 0.235, 0, { scale: [1, 1.2, 1] });

  scene.add(group);
}

// arara-azul (hyacinth macaw) empoleirada na borda do ninho, cabeça baixa — baseado no suvenir de cerâmica
function buildOneMacaw(parent, angle, scale = 1) {
  const rimR = 0.15;
  const rimY = 0.175;

  const perch = new THREE.Group();
  perch.position.set(Math.cos(angle) * rimR, rimY, Math.sin(angle) * rimR);
  // a posição usa (cos,sin), mas a direção "pra frente" de um objeto com rotation.y=φ
  // é (sinφ,cosφ) — por isso "angle + PI" ficava 90° torto. Fórmula certa pra olhar pro centro:
  perch.rotation.y = -angle - Math.PI / 2;
  perch.rotation.x = -0.25; // corpo só levemente inclinado pra dentro
  perch.scale.setScalar(scale);

  const bird = new THREE.Group();
  perch.add(bird);

  const blueMat = new THREE.MeshStandardMaterial({ color: 0x2f7dc4, roughness: 0.5 });
  const blueDarkMat = new THREE.MeshStandardMaterial({ color: 0x1d5a9a, roughness: 0.55 });
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf2cf3a, roughness: 0.5 });
  const beakMat = new THREE.MeshStandardMaterial({ color: 0x2c2c2c, roughness: 0.3 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.3 });
  const footMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.6 });

  // pés agarrados na borda do pote
  [-0.03, 0.03].forEach((fx) => {
    addMesh(bird, new THREE.SphereGeometry(0.016, 8, 6), footMat, fx, 0, 0, { scale: [1, 0.6, 1.3] });
  });

  // corpo, parado e arredondado, quase horizontal
  addMesh(bird, new THREE.SphereGeometry(0.075, 16, 12), blueMat, 0, 0.07, -0.01, { scale: [0.9, 1, 1.35] });

  // pescoço + cabeça, dobrados pra baixo olhando pro ninho
  const neck = new THREE.Group();
  neck.position.set(0, 0.11, 0.07);
  neck.rotation.x = 1.1; // dobra a cabeça pra baixo, não o corpo inteiro
  bird.add(neck);

  addMesh(neck, new THREE.SphereGeometry(0.05, 16, 12), blueMat, 0, 0, 0.03, { scale: [1, 1, 1.05] });

  // "mancha" amarela ao redor do olho (marca da arara-azul) + olho
  [-0.032, 0.032].forEach((ex) => {
    addMesh(neck, new THREE.TorusGeometry(0.015, 0.007, 8, 12), yellowMat, ex, 0.01, 0.075, {
      rotation: [0, ex > 0 ? -0.3 : 0.3, 0],
    });
    addMesh(neck, new THREE.SphereGeometry(0.008, 6, 6), eyeMat, ex, 0.01, 0.078);
  });

  // bico grande, grosso e bem curvado pra baixo (característico da arara-azul)
  addMesh(neck, new THREE.SphereGeometry(0.028, 12, 10), beakMat, 0, -0.015, 0.085, { scale: [0.85, 0.85, 1] });
  addMesh(neck, new THREE.ConeGeometry(0.02, 0.04, 10), beakMat, 0, -0.04, 0.095, {
    rotation: [Math.PI / 1.35, 0, 0],
  });

  // asas azul-escuro abertas pros lados, bem visíveis no perfil
  [-1, 1].forEach((side) => {
    const wing = new THREE.Group();
    wing.position.set(0.07 * side, 0.09, -0.03);
    wing.rotation.z = side * 0.55;
    wing.rotation.y = side * 0.25;
    addMesh(wing, new THREE.SphereGeometry(0.055, 10, 8), blueDarkMat, 0, 0, 0, { scale: [0.55, 0.8, 1.7] });
    bird.add(wing);
  });

  // cauda longa, pra trás e levemente erguida
  const tail = new THREE.Group();
  tail.position.set(0, 0.05, -0.08);
  tail.rotation.x = -0.55;
  addMesh(tail, new THREE.ConeGeometry(0.032, 0.3, 8), blueMat, 0, -0.14, 0, { rotation: [Math.PI, 0, 0] });
  addMesh(tail, new THREE.ConeGeometry(0.017, 0.12, 6), blueDarkMat, 0, -0.27, 0, { rotation: [Math.PI, 0, 0] });
  bird.add(tail);

  parent.add(perch);
  return perch;
}

function buildMacawFigurine(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  // gira o conjunto pra que as duas araras fiquem lado a lado de frente pra
  // câmera (perfil bem visível: bico, mancha amarela do olho, asa, cauda),
  // em vez de uma atrás da outra escondendo a de trás
  group.rotation.y = -0.7;
  group.scale.setScalar(1.7);

  // luz própria, pra garantir que o azul das araras apareça mesmo longe das velas
  const birdLight = new THREE.PointLight(0xfff0d8, 1.1, 2.6, 2);
  birdLight.position.set(0, 0.35, 0.15);
  group.add(birdLight);

  // base de madeira
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x8a6436, roughness: 0.8 });
  addMesh(group, new THREE.BoxGeometry(0.42, 0.028, 0.3), baseMat, 0, 0.014, 0);

  // potinho de barro (ninho) — perfil torneado, aberto em cima
  const potMat = new THREE.MeshStandardMaterial({ color: 0x332a24, roughness: 0.95 });
  const profile = [
    new THREE.Vector2(0.02, 0),
    new THREE.Vector2(0.1, 0.012),
    new THREE.Vector2(0.15, 0.05),
    new THREE.Vector2(0.165, 0.1),
    new THREE.Vector2(0.15, 0.155),
    new THREE.Vector2(0.145, 0.175),
  ];
  const pot = new THREE.Mesh(new THREE.LatheGeometry(profile, 28), potMat);
  pot.position.y = 0.028;
  pot.castShadow = true;
  pot.receiveShadow = true;
  group.add(pot);

  // palha/ninho dentro do pote
  const strawMat = new THREE.MeshStandardMaterial({ color: 0xd9c48f, roughness: 1 });
  addMesh(group, new THREE.SphereGeometry(0.13, 14, 8), strawMat, 0, 0.165, 0, { scale: [1, 0.3, 1] });

  // ovinhos brancos
  const eggMat = new THREE.MeshStandardMaterial({ color: 0xfaf6ea, roughness: 0.5 });
  addMesh(group, new THREE.SphereGeometry(0.028, 10, 8), eggMat, -0.025, 0.178, 0.01, { scale: [1, 1.15, 1] });
  addMesh(group, new THREE.SphereGeometry(0.028, 10, 8), eggMat, 0.025, 0.178, -0.015, { scale: [1, 1.15, 1] });

  // casal de araras-azuis debruçadas sobre o ninho, uma de cada lado
  buildOneMacaw(group, Math.PI * 0.78, 1);
  buildOneMacaw(group, -Math.PI * 0.22, 0.92);

  scene.add(group);
}

// desenha um rosto em blocos de pixel, com cabelo só acima/ao lado do rosto
// (nunca cruzando queixo/boca, pra não virar uma mancha tipo "barba")
function drawPixelPortrait(ctx, cx, topY, opts) {
  const { skin, hair, shirt, outline, longHair, bangs, glasses } = opts;
  const o = outline;

  const headTop = topY + 10;
  const headBot = topY + 30;
  const headL = cx - 10;
  const headR = cx + 10;

  // cabelo comprido (mechas laterais), atrás do rosto, sem tocar o queixo na frente
  if (longHair) {
    ctx.fillStyle = o;
    ctx.fillRect(headL - 3, headTop - 1, 5, 38);
    ctx.fillRect(headR - 2, headTop - 1, 5, 38);
    ctx.fillStyle = hair;
    ctx.fillRect(headL - 2, headTop, 3, 36);
    ctx.fillRect(headR - 1, headTop, 3, 36);
  }

  // pescoço (pele) antes do cabelo/ombros, pra não grudar no queixo
  ctx.fillStyle = skin;
  ctx.fillRect(cx - 5, headBot - 1, 10, 7);

  // contorno + rosto (bloco central, redondo o bastante em baixa resolução)
  ctx.fillStyle = o;
  ctx.fillRect(headL - 1, headTop - 1, headR - headL + 2, headBot - headTop + 2);
  ctx.fillStyle = skin;
  ctx.fillRect(headL, headTop, headR - headL, headBot - headTop);
  // cantos arredondados (corta quinas)
  ctx.fillStyle = o;
  ctx.fillRect(headL, headTop, 2, 2);
  ctx.fillRect(headR - 2, headTop, 2, 2);
  ctx.fillRect(headL, headBot - 2, 2, 2);
  ctx.fillRect(headR - 2, headBot - 2, 2, 2);
  ctx.fillStyle = skin;

  // topo do cabelo / franja
  ctx.fillStyle = hair;
  ctx.fillRect(headL - 1, headTop - 5, headR - headL + 2, 7);
  if (bangs === "side") {
    ctx.fillRect(headL + 2, headTop, 9, 6); // franja jogada de lado
  }

  // olhos (traço fino, sem virar bloco grande)
  ctx.fillStyle = o;
  ctx.fillRect(cx - 6, headTop + 10, 4, 2);
  ctx.fillRect(cx + 2, headTop + 10, 4, 2);

  if (glasses) {
    ctx.strokeStyle = o;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 8, headTop + 8, 7, 6);
    ctx.strokeRect(cx + 1, headTop + 8, 7, 6);
    ctx.beginPath();
    ctx.moveTo(cx - 1, headTop + 11);
    ctx.lineTo(cx + 1, headTop + 11);
    ctx.stroke();
  }

  // sorriso, isolado — nada de cabelo/sombra encostando nele
  ctx.fillStyle = "#a6432f";
  ctx.fillRect(cx - 4, headTop + 17, 8, 2);

  // corpo (blusa/suéter), separado do rosto pelo pescoço
  ctx.fillStyle = o;
  ctx.fillRect(cx - 15, headBot + 5, 30, 26);
  ctx.fillStyle = shirt;
  ctx.fillRect(cx - 14, headBot + 6, 28, 25);
}

function coupleArtTexture() {
  const W = 100, H = 130;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  // fundo quentinho com flores lilás no topo (lembrando a foto de referência)
  ctx.fillStyle = "#e8f0e4";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#c9a8d8";
  for (let i = 0; i < 7; i++) {
    ctx.fillRect(4 + i * 5, 0, 3, 10 + (i % 3) * 4);
    ctx.fillRect(W - 10 - i * 5, 0, 3, 8 + (i % 2) * 5);
  }

  // ele (atrás, mais alto, cabelo castanho, óculos, suéter mostarda)
  drawPixelPortrait(ctx, W * 0.62, 6, {
    skin: "#e7b98c",
    hair: "#8a5a33",
    shirt: "#c9a35c",
    outline: "#2a1d14",
    longHair: false,
    bangs: "side",
    glasses: true,
  });

  // ela (frente, mais baixa, cabelo escuro e comprido, blusa branca, sem barba)
  drawPixelPortrait(ctx, W * 0.32, 24, {
    skin: "#f0c9a0",
    hair: "#241a1a",
    shirt: "#ffffff",
    outline: "#2a1d14",
    longHair: true,
    bangs: false,
    glasses: false,
  });

  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildPictureFrame(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = 0.5;
  group.rotation.x = -0.12; // leve inclinação pra trás, apoiado

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x8a5a2e, roughness: 0.6 });
  const frameW = 0.62, frameH = 0.82, border = 0.07;

  addMesh(group, new THREE.BoxGeometry(frameW, frameH, 0.035), frameMat, 0, frameH / 2, 0);

  const photoMat = new THREE.MeshStandardMaterial({ map: coupleArtTexture(), roughness: 0.8 });
  addMesh(
    group,
    new THREE.PlaneGeometry(frameW - border * 2, frameH - border * 2),
    photoMat,
    0,
    frameH / 2,
    0.019
  );

  // pezinho de apoio atrás
  const stand = addMesh(group, new THREE.BoxGeometry(0.03, 0.38, 0.03), frameMat, 0, 0.19, -0.045, {
    rotation: [0.5, 0, 0],
  });

  scene.add(group);
}

// ---------- Envelope stack ----------

// geometrias e materiais do envelope são idênticos em todas as cartas, então
// são criados uma única vez e reaproveitados (em vez de 1x por carta) —
// evita recriar textura/canvas e geometrias repetidas com várias dezenas de
// envelopes na pilha
const ENV_W = 1.15, ENV_H = 0.74, ENV_D = 0.03;
let envelopeAssets = null;

function getEnvelopeAssets() {
  if (envelopeAssets) return envelopeAssets;
  const w = ENV_W, h = ENV_H, d = ENV_D;
  envelopeAssets = {
    pocketGeo: new THREE.BoxGeometry(w, d, h),
    pocketMat: new THREE.MeshStandardMaterial({ color: 0xc7a06c, roughness: 0.75 }),
    edgeGeo: new THREE.PlaneGeometry(w, h),
    edgeMat: new THREE.MeshStandardMaterial({ map: airmailEdgeTexture(), transparent: true, roughness: 0.8 }),
    paperGeo: new THREE.BoxGeometry(w * 0.9, d * 0.5, h * 0.9),
    paperMat: new THREE.MeshStandardMaterial({ color: 0xf1e7c9, roughness: 0.95 }),
    flapGeo: new THREE.BoxGeometry(w * 0.99, 0.01, h * 0.58),
    flapMat: new THREE.MeshStandardMaterial({ color: 0xb98e58, roughness: 0.72, side: THREE.DoubleSide }),
    sealGeo: new THREE.CylinderGeometry(0.06, 0.06, 0.012, 16),
    sealMat: new THREE.MeshStandardMaterial({ color: 0x8c2f2f, roughness: 0.5, metalness: 0.1 }),
  };
  return envelopeAssets;
}

function createEnvelopeMesh() {
  const group = new THREE.Group();
  const w = ENV_W, h = ENV_H, d = ENV_D;
  const a = getEnvelopeAssets();

  const pocket = new THREE.Mesh(a.pocketGeo, a.pocketMat);
  pocket.castShadow = true;
  pocket.receiveShadow = true;
  group.add(pocket);

  // airmail striped edge band (thin frame slightly above pocket)
  const edge = new THREE.Mesh(a.edgeGeo, a.edgeMat);
  edge.rotation.x = -Math.PI / 2;
  edge.position.y = d / 2 + 0.001;
  group.add(edge);

  const paper = new THREE.Mesh(a.paperGeo, a.paperMat);
  paper.position.set(0, d * 0.05, 0);
  paper.castShadow = true;
  paper.receiveShadow = true;
  group.add(paper);

  const flapPivot = new THREE.Group();
  flapPivot.position.set(0, d / 2, -h / 2);
  const flap = new THREE.Mesh(a.flapGeo, a.flapMat);
  flap.position.set(0, 0, h * 0.29);
  flap.castShadow = true;
  flapPivot.add(flap);
  group.add(flapPivot);

  // wax seal at flap tip
  const seal = new THREE.Mesh(a.sealGeo, a.sealMat);
  seal.rotation.x = Math.PI / 2;
  seal.position.set(0, 0.006, h * 0.56);
  flap.add(seal);

  scene.add(group);

  return { group, pocket, paper, flapPivot, seal, paperBaseY: paper.position.y, paperBaseZ: 0 };
}

function airmailEdgeTexture() {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  const stripe = 14;
  ctx.save();
  ctx.strokeStyle = "transparent";
  const colors = ["#8c2f2f", "#f0e6cc", "#2c4f7f", "#f0e6cc"];
  const border = 10;
  // draw border frame with diagonal stripes using repeating pattern on a thin ring
  ctx.beginPath();
  ctx.rect(0, 0, size, border);
  ctx.rect(0, size - border, size, border);
  ctx.rect(0, 0, border, size);
  ctx.rect(size - border, 0, border, size);
  ctx.save();
  ctx.clip();
  for (let i = -size; i < size * 2; i += stripe) {
    ctx.fillStyle = colors[(Math.floor(i / stripe) + 4) % 4];
    ctx.save();
    ctx.translate(i, 0);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(0, -size, stripe, size * 3);
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildEnvelopeStack() {
  const opened = getOpenedIds();
  const unread = LETTERS.filter((l) => !opened.includes(l.id));
  const read = opened.map((id) => LETTERS.find((l) => l.id === id)).filter(Boolean);

  LETTERS.forEach((letter) => {
    const mesh = createEnvelopeMesh();
    const rec = {
      letter,
      ...mesh,
      pile: "unread",
      index: 0,
      interactive: false,
      opening: false,
      pos: new THREE.Vector3(),
      rotY: 0,
      flapAngle: 0,
      flapTarget: 0,
      paperOffset: 0,
      paperTarget: 0,
    };
    envelopes.push(rec);
  });

  layoutStack(unread, read);
}

function layoutStack(unread, read) {
  unread.forEach((letter, i) => setPile(letter.id, "unread", i));
  read.forEach((letter, i) => setPile(letter.id, "read", i));
  updateInteractivity();
}

function setPile(id, pile, index) {
  const rec = envelopes.find((r) => r.letter.id === id);
  if (!rec) return;
  rec.pile = pile;
  rec.index = index;

  const j = jitter(index + id.length);
  const baseX = pile === "unread" ? 1.9 : -1.9;
  rec.pos.set(baseX + j * 0.12, 0.016 + index * 0.028, 0.3 + index * 0.025);
  rec.rotY = j * 0.5;
  rec.flapTarget = pile === "read" ? 0.85 : 0; // radians, positive = opened back
  rec.paperTarget = pile === "read" ? 0.05 : 0;
}

let interactiveGroupsCache = [];

function updateInteractivity() {
  envelopes.forEach((r) => (r.interactive = false));
  const unread = envelopes.filter((r) => r.pile === "unread").sort((a, b) => a.index - b.index);
  if (unread.length) unread[0].interactive = true;
  envelopes.filter((r) => r.pile === "read").forEach((r) => (r.interactive = true));
  refreshInteractiveGroupsCache();
}

// evita recalcular/alocar esse array em todo movimento de mouse; só muda
// quando um envelope troca de pilha ou começa/termina de abrir
function refreshInteractiveGroupsCache() {
  interactiveGroupsCache = envelopes.filter((r) => r.interactive && !r.opening).map((r) => r.group);
}

function recomputeStack() {
  const opened = getOpenedIds();
  const unread = LETTERS.filter((l) => !opened.includes(l.id));
  const read = opened.map((id) => LETTERS.find((l) => l.id === id)).filter(Boolean);
  layoutStack(unread, read);
}

// ---------- interaction ----------

function onPointerMove(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(interactiveGroupsCache, true);
  const rec = hits.length ? findRec(hits[0].object) : null;

  if (hovered !== rec) {
    hovered = rec;
    renderer.domElement.style.cursor = rec ? "pointer" : "default";
  }
}

function findRec(obj) {
  let o = obj;
  while (o) {
    const rec = envelopes.find((r) => r.group === o);
    if (rec) return rec;
    o = o.parent;
  }
  return null;
}

function onClick(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(interactiveGroupsCache, true);
  if (!hits.length) return;

  const rec = findRec(hits[0].object);
  if (rec) openLetter(rec);
}

let resizePending = false;
function onResize() {
  // várias vezes por segundo durante um redimensionamento/rotação de tela —
  // agrupa num único ajuste por frame em vez de recalcular a cada evento
  if (resizePending) return;
  resizePending = true;
  requestAnimationFrame(() => {
    resizePending = false;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// ---------- ambient music (gerada por código, sem arquivo externo) ----------

let musicEnabled = true;
let audioCtx = null;
let masterGain = null;
let bellTimer = null;

function initMusic() {
  // sem botão: a música liga sozinha assim que o navegador permitir
  // (no primeiro clique/toque na página) e passa a tocar ao abrir cartas
  const unlock = () => {
    ensureAudioEngine();
    if (audioCtx.state === "suspended") audioCtx.resume();
    document.removeEventListener("pointerdown", unlock);
    document.removeEventListener("keydown", unlock);
  };
  document.addEventListener("pointerdown", unlock, { once: true });
  document.addEventListener("keydown", unlock, { once: true });
}

function ensureAudioEngine() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioCtx.destination);

  // leve eco para dar sensação de ambiente/sala
  const delay = audioCtx.createDelay(2.0);
  delay.delayTime.value = 0.55;
  const feedback = audioCtx.createGain();
  feedback.gain.value = 0.28;
  const delayFilter = audioCtx.createBiquadFilter();
  delayFilter.type = "lowpass";
  delayFilter.frequency.value = 1800;
  delay.connect(feedback).connect(delayFilter).connect(delay);
  masterGain.connect(delay);
  delay.connect(audioCtx.destination);

  buildPad();
  bellTimer = setInterval(() => {
    if (Math.random() < 0.5) playBell();
  }, 4200);
}

function buildPad() {
  // acorde calmo e sustentado (A3, C4, E4, G4 — como um Am7 suave)
  const freqs = [220.0, 261.63, 329.63, 392.0];
  freqs.forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = f;

    // leve vibrato lento pra não soar estático/eletrônico
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.07 + i * 0.015;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 1.8;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.1 - i * 0.012;

    osc.connect(filter).connect(gain).connect(masterGain);
    osc.start();
  });
}

function playBell() {
  if (!audioCtx) return;
  const scale = [523.25, 587.33, 659.25, 783.99, 880.0]; // pentatônica calma
  const f = scale[Math.floor(Math.random() * scale.length)];

  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = f;

  const gain = audioCtx.createGain();
  gain.gain.value = 0;
  osc.connect(gain).connect(masterGain);

  const now = audioCtx.currentTime;
  gain.gain.linearRampToValueAtTime(0.055, now + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.6);
  osc.start(now);
  osc.stop(now + 2.7);
}

function fadeMusic(fadeIn) {
  if (!musicEnabled) fadeIn = false;
  if (fadeIn) {
    ensureAudioEngine();
    if (audioCtx.state === "suspended") audioCtx.resume();
  }
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(fadeIn ? 0.5 : 0, now + 1.1);
}

// ---------- opening / closing ----------

function worldToScreen(vec3) {
  const v = vec3.clone().project(camera);
  const rect = renderer.domElement.getBoundingClientRect();
  return {
    x: rect.left + (v.x * 0.5 + 0.5) * rect.width,
    y: rect.top + (-v.y * 0.5 + 0.5) * rect.height,
  };
}

function openLetter(rec) {
  pendingRec = rec;
  rec.opening = true;
  rec.flapTarget = 1;
  rec.paperTarget = 0.55;
  refreshInteractiveGroupsCache();

  const worldPos = new THREE.Vector3();
  rec.group.getWorldPosition(worldPos);
  worldPos.y += 0.3;
  const screen = worldToScreen(worldPos);

  const overlay = document.getElementById("letter-overlay");
  const sheet = overlay.querySelector(".letter-sheet");
  const content = document.getElementById("letter-content");

  content.innerHTML = `
    ${rec.letter.date ? `<span class="letter-date">${rec.letter.date}</span>` : ""}
    ${escapeHtml(rec.letter.body)}
  `;
  sheet.scrollTop = 0;

  sheet.style.setProperty("--origin-x", `${screen.x}px`);
  sheet.style.setProperty("--origin-y", `${screen.y}px`);

  overlay.classList.remove("hidden");
  setTimeout(() => overlay.classList.add("visible"), 520);

  fadeMusic(true);
}

function closeLetter() {
  const overlay = document.getElementById("letter-overlay");
  overlay.classList.remove("visible");

  fadeMusic(false);

  setTimeout(() => {
    overlay.classList.add("hidden");

    if (pendingRec) {
      const opened = getOpenedIds();
      if (!opened.includes(pendingRec.letter.id)) {
        opened.push(pendingRec.letter.id);
        saveOpenedIds(opened);
      }
      pendingRec.opening = false;
      pendingRec = null;
      recomputeStack();
      refreshRevisitToggle();
    }
  }, 380);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- animation loop ----------

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  // candle flicker
  flameFlicker = Math.sin(t * 13) * 0.08 + Math.sin(t * 5.3) * 0.05 + Math.sin(t * 23) * 0.03;
  candleLight.intensity = 3.2 + flameFlicker * 2.6;
  for (let i = 0; i < flames.length; i++) {
    const f = flames[i];
    const s = 1 + flameFlicker * 0.4;
    if (f.isSprite) {
      f.scale.set(0.22 * s, 0.36 * s, 1);
      f.position.x = Math.sin(t * 7 + i) * 0.01;
    } else if (f.isPointLight) {
      f.intensity = 0.5 + flameFlicker * 0.4;
    }
  }

  // envelopes: ease toward target pile position + flap/paper animation
  envelopes.forEach((rec) => {
    const hoverLift = rec === hovered && rec.interactive && !rec.opening ? 0.1 : 0;
    tmpVec.copy(rec.pos);
    tmpVec.y += hoverLift;

    rec.group.position.lerp(tmpVec, 1 - Math.pow(0.001, dt));
    rec.group.rotation.y += (rec.rotY - rec.group.rotation.y) * (1 - Math.pow(0.001, dt));

    const flapGoal = rec.opening ? 1 : rec.flapTarget;
    rec.flapAngle += (flapGoal - rec.flapAngle) * (1 - Math.pow(0.0005, dt));
    rec.flapPivot.rotation.x = -rec.flapAngle * 2.7;

    const paperGoal = rec.opening ? 0.55 : rec.paperTarget;
    rec.paperOffset += (paperGoal - rec.paperOffset) * (1 - Math.pow(0.0005, dt));
    rec.paper.position.z = -rec.paperOffset * 0.4;
    rec.paper.position.y = rec.paperBaseY + rec.paperOffset * 0.25;
  });

  frameCount++;
  if (frameCount % 4 === 0) updateStackHint();

  renderer.render(scene, camera);
}

init();
