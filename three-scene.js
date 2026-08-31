/* three-scene.js — Three.js WebGL — sage green palette */
(function () {
  const canvas = document.getElementById('webgl-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 12);

  // Sage green materials
  const sageMat   = new THREE.LineBasicMaterial({ color: 0x8fbc8f, transparent: true, opacity: 0.75 });
  const greenMat  = new THREE.LineBasicMaterial({ color: 0x4ecb71, transparent: true, opacity: 0.55 });
  const dimMat    = new THREE.LineBasicMaterial({ color: 0x2d5a27, transparent: true, opacity: 0.35 });
  const brightMat = new THREE.LineBasicMaterial({ color: 0xa8d5a2, transparent: true, opacity: 0.4  });

  // 1. Icosahedron (hero centrepiece)
  const icoGeo   = new THREE.IcosahedronGeometry(2.8, 1);
  const icoEdges = new THREE.EdgesGeometry(icoGeo);
  const ico      = new THREE.LineSegments(icoEdges, sageMat.clone());
  scene.add(ico);

  // inner icosahedron
  const icoGeo2   = new THREE.IcosahedronGeometry(1.6, 0);
  const icoEdges2 = new THREE.EdgesGeometry(icoGeo2);
  const ico2      = new THREE.LineSegments(icoEdges2, greenMat.clone());
  scene.add(ico2);

  // 2. Tetrahedron
  const tetraGeo   = new THREE.TetrahedronGeometry(3.5, 0);
  const tetraEdges = new THREE.EdgesGeometry(tetraGeo);
  const tetra      = new THREE.LineSegments(tetraEdges, new THREE.LineBasicMaterial({ color: 0x3a7a32, transparent: true, opacity: 0.38 }));
  scene.add(tetra);

  // 3. Grid helper
  const gridHelper = new THREE.GridHelper(40, 28, 0x1a3d18, 0x0d2010);
  gridHelper.position.set(0, -6, 0);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.5;
  scene.add(gridHelper);

  // 4. Particles
  const partCount = 200;
  const partGeo   = new THREE.BufferGeometry();
  const partPos   = new Float32Array(partCount * 3);
  const partSpd   = [];
  for (let i = 0; i < partCount; i++) {
    partPos[i*3]   = (Math.random() - 0.5) * 32;
    partPos[i*3+1] = (Math.random() - 0.5) * 22;
    partPos[i*3+2] = (Math.random() - 0.5) * 16;
    partSpd.push({
      x: (Math.random() - 0.5) * 0.0035,
      y: (Math.random() - 0.5) * 0.0035,
      z: (Math.random() - 0.5) * 0.003,
    });
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
  const partMat    = new THREE.PointsMaterial({ color: 0x8fbc8f, size: 0.06, transparent: true, opacity: 0.65 });
  const particles  = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // 5. Orbital rings
  function makeRing(r, tilt, color, op) {
    const g = new THREE.TorusGeometry(r, 0.012, 6, 80);
    const m = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: op });
    const mesh = new THREE.Mesh(g, m);
    mesh.rotation.x = tilt;
    return mesh;
  }
  const ring1 = makeRing(4.2,  Math.PI/3,   0x8fbc8f, 0.22);
  const ring2 = makeRing(5.0, -Math.PI/4,   0x4ecb71, 0.16);
  const ring3 = makeRing(3.6,  Math.PI/1.5, 0x6b9e6b, 0.2 );
  [ring1, ring2, ring3].forEach(r => scene.add(r));

  // Scroll state
  let scrollY = 0, targetZ = 12, targetY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const prog = scrollY / (document.body.scrollHeight - window.innerHeight);
    targetZ = 12 - prog * 5;
    targetY = -prog * 3;
  });

  // Mouse parallax
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animate loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.x += (mx * 1.2 - camera.position.x) * 0.03;
    camera.lookAt(0, camera.position.y * 0.4, 0);

    ico.rotation.y  = t * 0.23;
    ico.rotation.x  = t * 0.14 + Math.sin(t * 0.35) * 0.1;
    ico2.rotation.y = -t * 0.32;
    ico2.rotation.z =  t * 0.18;
    tetra.rotation.x = t * 0.11;
    tetra.rotation.y = t * 0.08;
    tetra.rotation.z = t * 0.065;

    ring1.rotation.z = t * 0.16;
    ring2.rotation.z = -t * 0.12;
    ring3.rotation.x = t * 0.1;

    gridHelper.material.opacity = 0.32 + Math.sin(t * 0.75) * 0.12;

    const pos = partGeo.attributes.position.array;
    for (let i = 0; i < partCount; i++) {
      pos[i*3]   += partSpd[i].x;
      pos[i*3+1] += partSpd[i].y;
      pos[i*3+2] += partSpd[i].z;
      if (Math.abs(pos[i*3])   > 16) partSpd[i].x *= -1;
      if (Math.abs(pos[i*3+1]) > 11) partSpd[i].y *= -1;
      if (Math.abs(pos[i*3+2]) > 8 ) partSpd[i].z *= -1;
    }
    partGeo.attributes.position.needsUpdate = true;

    const fade = Math.max(0.08, 1 - scrollY / (window.innerHeight * 0.9));
    ico.material.opacity   = 0.75 * fade;
    ico2.material.opacity  = 0.55 * fade;
    tetra.material.opacity = 0.38 * fade;
    [ring1, ring2, ring3].forEach(r => r.material.opacity *= (0.9 + fade * 0.1));

    renderer.render(scene, camera);
  }
  animate();

  window.threeScene = { scene, camera, renderer, ico, ico2, tetra };
})();