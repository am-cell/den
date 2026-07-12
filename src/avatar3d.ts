import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelUrl from './avatar.glb';

export function initAvatar3D(): void {
  const container = document.getElementById('avatar-3d');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9090b0, 1.7));
  const dir = new THREE.DirectionalLight(0xffffff, 1.1);
  dir.position.set(4, 8, 6);
  scene.add(dir);

  const pivot = new THREE.Group();
  scene.add(pivot);

  new GLTFLoader().load(modelUrl, (gltf) => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    model.position.sub(center);
    model.scale.setScalar(2 / size.y);
    pivot.add(model);
  });

  camera.position.set(0, 0.05, 3.2);

  let targetRotY = 0;
  let targetRotX = 0;
  window.addEventListener('mousemove', (e) => {
    targetRotY = ((e.clientX / window.innerWidth) * 2 - 1) * 0.5;
    targetRotX = ((e.clientY / window.innerHeight) * 2 - 1) * 0.15;
  });

  const resize = (): void => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(container);

  const clock = new THREE.Clock();
  const animate = (): void => {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const idleSway = Math.sin(t * 0.6) * 0.15;
    pivot.rotation.y += (targetRotY + idleSway - pivot.rotation.y) * 0.06;
    pivot.rotation.x += (targetRotX - pivot.rotation.x) * 0.06;
    pivot.position.y = Math.sin(t * 1.4) * 0.04;
    renderer.render(scene, camera);
  };
  animate();
}
