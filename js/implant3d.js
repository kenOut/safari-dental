// The implant that builds itself as you scroll (our-services.html, #implant-build).
// Three parts drawn in code with three.js: the titanium post, the abutment and the crown.
// The section is three screens tall; its inner panel stays pinned while the scroll moves the parts
// together. three.js loads only when the section comes near. Reduced motion: the assembled implant, still.
// Without WebGL the clinic photograph in the stage stays in place.

const section = document.querySelector('#implant-build');
if (section) init(section);

function init(section) {
  const stage = section.querySelector('.implant3d__stage');
  const steps = [...section.querySelectorAll('.implant3d__step')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let started = false;

  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting) && !started) { started = true; io.disconnect(); start(); }
  }, { rootMargin: '600px 0px' });
  io.observe(section);

  async function start() {
    const probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return;
    let THREE;
    try { THREE = await import('../assets/vendor/three.module.min.js'); } catch { return; }
    build(THREE);
  }

  function build(THREE) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const canvas = renderer.domElement;
    canvas.className = 'implant3d__canvas';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'A dental implant: a titanium post, an abutment and a white crown fitting together');
    stage.appendChild(canvas);
    stage.classList.add('is-3d');

    const scene = new THREE.Scene();
    scene.environment = makeEnvironment(THREE, renderer);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(6, 10, 8); scene.add(key);
    const rim = new THREE.DirectionalLight(0xcfe8d4, 0.8); rim.position.set(-8, 4, -6); scene.add(rim);

    const titanium = new THREE.MeshStandardMaterial({ color: 0xb8bec6, metalness: 1, roughness: 0.28 });
    const abutMat = new THREE.MeshStandardMaterial({ color: 0xc9b98f, metalness: 1, roughness: 0.22 });
    const enamel = new THREE.MeshPhysicalMaterial({ color: 0xf6f3ec, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0.4, sheenColor: 0xffffff, side: THREE.DoubleSide });

    const smooth = (pts, n = 48) => new THREE.SplineCurve(pts.map(([x, y]) => new THREE.Vector2(x, y))).getPoints(n);

    // the post: a tapered body with a rounded tip and a helical thread
    const post = new THREE.Group();
    const bodyPts = [[0, -9], [0.75, -8.92], [1.12, -8.6], [1.27, -8.1], [1.5, -4.5], [1.72, -0.7], [1.75, -0.15], [1.7, 0], [0.95, 0], [0.95, -0.35], [0, -0.35]].map(([x, y]) => new THREE.Vector2(x, y));
    post.add(new THREE.Mesh(new THREE.LatheGeometry(bodyPts, 72), titanium));
    const rAt = (y) => 1.27 + (1.72 - 1.27) * ((y + 8.1) / 7.4);
    class Helix extends THREE.Curve {
      getPoint(t, target = new THREE.Vector3()) {
        const y = -8.2 + t * 7.3, a = t * Math.PI * 2 * 9;
        const r = rAt(y) + 0.05;
        return target.set(Math.cos(a) * r, y, Math.sin(a) * r);
      }
    }
    post.add(new THREE.Mesh(new THREE.TubeGeometry(new Helix(), 720, 0.17, 10, false), titanium));

    // the abutment: a collar and a tapered post that the crown sits on
    const abut = new THREE.Mesh(new THREE.LatheGeometry(smooth([[0.001, 0], [1.05, 0.02], [1.25, 0.35], [1.68, 0.75], [1.62, 1.1], [1.38, 2.4], [1.18, 3.7], [0.9, 4.05], [0.001, 4.1]], 40), 72), abutMat);

    // the crown: a lathe that bulges at the sides, with four cusps raised on its biting surface
    const crownGeo = new THREE.LatheGeometry(smooth([[1.7, 0.6], [2.2, 1.25], [2.58, 2.4], [2.62, 3.4], [2.42, 4.35], [2.0, 4.95], [1.25, 5.2], [0.55, 4.95], [0.001, 4.85]], 64), 128);
    const pos = crownGeo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const r = Math.hypot(v.x, v.z), a = Math.atan2(v.z, v.x);
      const top = smoothstep(3.9, 5.1, v.y) * Math.min(1, r / 1.6);
      v.y += 0.42 * Math.max(0, Math.cos(4 * a + 0.4)) * top;
      v.z *= 0.9;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    crownGeo.computeVertexNormals();
    const crown = new THREE.Mesh(crownGeo, enamel);

    // a soft shadow on the ground under the post
    const sh = document.createElement('canvas'); sh.width = sh.height = 128;
    const g = sh.getContext('2d'), grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, 'rgba(21,32,26,0.35)'); grad.addColorStop(1, 'rgba(21,32,26,0)');
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -9.6;

    const implant = new THREE.Group();
    implant.add(post, abut, crown, shadow);
    const rig = new THREE.Group(); rig.add(implant); scene.add(rig);
    rig.rotation.x = 0.18;

    // pointer and phone tilt: a few degrees, eased
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    if (!reduced) {
      addEventListener('pointermove', (e) => { look.tx = (e.clientX / innerWidth - 0.5) * 0.35; look.ty = (e.clientY / innerHeight - 0.5) * 0.18; }, { passive: true });
    }

    function progress() {
      if (reduced) return 1;
      const r = section.getBoundingClientRect();
      const travel = r.height - innerHeight;
      return clamp(-r.top / Math.max(1, travel), 0, 1);
    }

    function resize() {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(stage);
    resize();

    let active = -1, visible = true, last = performance.now(), spin = 0;
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) requestAnimationFrame(frame); }).observe(section);

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const p = progress();

      // 0 to 0.28: the post turns into place; 0.3 to 0.56: the abutment drops on; 0.6 to 0.88: the crown
      const a = ease(seg(p, 0.0, 0.28)), b = ease(seg(p, 0.3, 0.56)), c = ease(seg(p, 0.6, 0.88));
      post.position.y = lerp(3.2, 0, a);
      post.rotation.y = lerp(Math.PI * 3, 0, a);
      abut.position.y = lerp(8.5, 0, b);
      crown.position.y = lerp(15.5, 0.2, c);
      abut.visible = p > 0.22; crown.visible = p > 0.52;
      abut.material.opacity = 1;

      // the camera comes closer as the parts close up
      const span = lerp(25, 19.5, seg(p, 0.25, 0.95));
      const dist = (span / 2) / Math.tan((camera.fov * Math.PI) / 360) * (camera.aspect < 0.9 ? 1.25 : 1);
      const centre = lerp(1.5, -1.6, seg(p, 0.2, 0.95));
      camera.position.set(0, centre + 1, dist);
      camera.lookAt(0, centre, 0);

      if (!reduced) spin += dt * 0.25;
      look.x += (look.tx - look.x) * 0.06; look.y += (look.ty - look.y) * 0.06;
      implant.rotation.y = spin + look.x;
      rig.rotation.x = 0.18 + look.y;

      const step = p < 0.3 ? 0 : p < 0.6 ? 1 : 2;
      if (!reduced && step !== active) { active = step; steps.forEach((s, i) => s.classList.toggle('is-active', i === step)); }

      renderer.render(scene, camera);
      if (visible && !reduced) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    if (reduced) { steps.forEach((s) => s.classList.add('is-active')); }
  }
}

// a small studio room baked into an environment map, so the metal and the enamel have something to reflect
function makeEnvironment(THREE, renderer) {
  const scene = new THREE.Scene();
  const box = new THREE.BoxGeometry();
  const room = new THREE.Mesh(box, new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: 0xdfe6e0 }));
  room.position.set(-0.757, 13.219, 0.717); room.scale.set(31.713, 28.305, 28.591);
  scene.add(room);
  const light = new THREE.PointLight(0xffffff, 900, 28, 2); light.position.set(0.418, 16.199, 0.3); scene.add(light);
  const panel = (x, y, z, sx, sy, sz, k) => {
    const m = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    m.material.color.setScalar(k); m.position.set(x, y, z); m.scale.set(sx, sy, sz); scene.add(m);
  };
  panel(-16.116, 14.37, 8.208, 0.1, 2.428, 2.739, 50);
  panel(-16.109, 18.021, -8.207, 0.1, 2.425, 2.751, 50);
  panel(14.904, 12.198, -1.832, 0.15, 4.265, 6.331, 17);
  panel(-0.462, 8.89, 14.52, 4.38, 5.441, 0.088, 43);
  panel(3.235, 11.486, -12.541, 2.5, 2.0, 0.1, 20);
  panel(0.0, 20.0, 0.0, 1.0, 0.1, 1.0, 100);
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(scene, 0.04).texture;
  pm.dispose();
  return tex;
}

function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
function ease(t) { return 1 - Math.pow(1 - t, 3); }
function smoothstep(a, b, x) { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
