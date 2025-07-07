import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

let mixer, avatar, waveAction;
let speechBubble = document.createElement('div');

// Scene setup
const scene = new THREE.Scene();
// Remove the white background - make it transparent
scene.background = null;

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 3);

// Enable transparency for the renderer
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,           // Enable transparency
    premultipliedAlpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Transparent background
document.getElementById('avatar-container').appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.update();

// Lighting - Enhanced for better visibility without background
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
scene.add(light);

// Add directional light for better avatar visibility
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Load avatar
const loader = new GLTFLoader();
loader.load('avatar.glb', function (gltf) {
  avatar = gltf.scene;
  // Scale up the avatar to make it bigger
  avatar.scale.set(1.3, 1.3, 1.3);
  scene.add(avatar);

  // Animations
  mixer = new THREE.AnimationMixer(avatar);
  const clips = gltf.animations;

  // Try to find a clip with "wave" in the name
  waveAction = mixer.clipAction(clips.find(clip => clip.name.toLowerCase().includes('wave')));
}, undefined, function (error) {
  console.error(error);
});

// Speech Bubble (style itttt 😍)
speechBubble.textContent = 'Hi 💖';
speechBubble.style.position = 'absolute';
speechBubble.style.top = '20px';
speechBubble.style.left = '50%';
speechBubble.style.transform = 'translateX(-50%)';
speechBubble.style.padding = '10px 20px';
speechBubble.style.borderRadius = '20px';
speechBubble.style.background = '#fff3f8';
speechBubble.style.color = '#e91e63';
speechBubble.style.fontWeight = 'bold';
speechBubble.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
speechBubble.style.display = 'none';
document.body.appendChild(speechBubble);

// Raycaster for hover detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove);

// Animate
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  if (avatar) {
    // Raycast to detect hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(avatar, true);

    if (intersects.length > 0) {
      // Show text
      speechBubble.style.display = 'block';

      // Play wave animation if available
      if (waveAction && !waveAction.isRunning()) {
        waveAction.reset().play();
      }
    } else {
      speechBubble.style.display = 'none';
    }
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});