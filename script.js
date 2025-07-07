import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

let avatar, rightArm, rightForearm;
let speechBubble = document.createElement('div');
let hasPlayedIntro = false;

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

  // Find arm bones for waving animation
  avatar.traverse((child) => {
    if (child.isBone) {
      const name = child.name.toLowerCase();
      // Look for right arm bones
      if (name.includes('rightarm') || name.includes('right_arm') || 
          name.includes('arm.r') || name.includes('upperarm_r') ||
          name.includes('shoulder_r') || name.includes('rightshoulder')) {
        rightArm = child;
      }
      // Look for right forearm bones
      if (name.includes('rightforearm') || name.includes('right_forearm') || 
          name.includes('forearm.r') || name.includes('lowerarm_r') ||
          name.includes('righthand') || name.includes('right_hand')) {
        rightForearm = child;
      }
    }
  });

  console.log('Right arm found:', rightArm ? rightArm.name : 'Not found');
  console.log('Right forearm found:', rightForearm ? rightForearm.name : 'Not found');

  // Start the intro sequence after avatar loads
  setTimeout(() => {
    playIntroSequence();
  }, 500);
  
}, undefined, function (error) {
  console.error(error);
});

// Speech Bubble setup
speechBubble.style.position = 'absolute';
speechBubble.style.top = '15%';
speechBubble.style.right = '10%';
speechBubble.style.padding = '15px 25px';
speechBubble.style.borderRadius = '25px';
speechBubble.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
speechBubble.style.color = 'white';
speechBubble.style.fontWeight = 'bold';
speechBubble.style.fontSize = '18px';
speechBubble.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
speechBubble.style.display = 'none';
speechBubble.style.zIndex = '1000';
speechBubble.style.opacity = '0';
speechBubble.style.transform = 'translateY(20px) scale(0.8)';
speechBubble.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
speechBubble.style.maxWidth = '300px';
speechBubble.style.textAlign = 'center';
document.body.appendChild(speechBubble);

// Intro sequence function
function playIntroSequence() {
  if (hasPlayedIntro || !avatar) return;
  hasPlayedIntro = true;

  // Show speech bubble with welcome message
  speechBubble.textContent = 'Hi there! 👋 Welcome to my wonderland! ✨';
  speechBubble.style.display = 'block';
  
  setTimeout(() => {
    speechBubble.style.opacity = '1';
    speechBubble.style.transform = 'translateY(0) scale(1)';
  }, 100);

  // Start waving animation
  startWaveAnimation();

  // Hide speech bubble after 5 seconds
  setTimeout(() => {
    speechBubble.style.opacity = '0';
    speechBubble.style.transform = 'translateY(-20px) scale(0.8)';
    setTimeout(() => {
      speechBubble.style.display = 'none';
    }, 500);
  }, 5000);
}

// Custom wave animation function
function startWaveAnimation() {
  const waveStartTime = Date.now();
  const waveDuration = 3000; // 3 seconds of waving
  const waveSpeed = 4; // Wave cycles per second

  function animateWave() {
    const elapsed = Date.now() - waveStartTime;
    const progress = elapsed / waveDuration;
    
    if (progress >= 1) {
      // Reset arm positions to original
      if (rightArm) {
        rightArm.rotation.z = 0;
        rightArm.rotation.x = 0;
      }
      if (rightForearm) {
        rightForearm.rotation.z = 0;
        rightForearm.rotation.x = 0;
      }
      return; // Animation complete
    }

    const waveTime = elapsed / 1000; // Convert to seconds
    const intensity = Math.sin(progress * Math.PI); // Fade in and out

    // Animate right arm (shoulder)
    if (rightArm) {
      rightArm.rotation.z = Math.sin(waveTime * waveSpeed * Math.PI) * 0.8 * intensity;
      rightArm.rotation.x = Math.sin(waveTime * waveSpeed * Math.PI * 0.5) * 0.3 * intensity;
    }

    // Animate right forearm (elbow)
    if (rightForearm) {
      rightForearm.rotation.z = Math.sin(waveTime * waveSpeed * Math.PI + Math.PI/4) * 0.6 * intensity;
    }

    // Add slight body movement
    avatar.rotation.y = Math.sin(waveTime * 2) * 0.05 * intensity;

    requestAnimationFrame(animateWave);
  }

  animateWave();
}

// Raycaster for hover detection (optional - for future interactions)
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

  // Add subtle idle breathing animation after intro
  if (avatar && hasPlayedIntro) {
    const time = clock.getElapsedTime();
    avatar.position.y += Math.sin(time * 1.5) * 0.002; // Gentle breathing
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});