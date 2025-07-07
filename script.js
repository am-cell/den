import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

let avatar, rightArm, leftArm, rightForearm, leftForearm;
let speechBubble = document.createElement('div');
let hasPlayedChickenIntro = false;

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

  // Find arm bones for chicken flapping animation
  avatar.traverse((child) => {
    if (child.isBone) {
      const name = child.name.toLowerCase();
      
      // Look for right arm bones
      if (name.includes('rightarm') || name.includes('right_arm') || 
          name.includes('arm.r') || name.includes('upperarm_r') ||
          name.includes('shoulder_r') || name.includes('rightshoulder')) {
        rightArm = child;
      }
      // Look for left arm bones
      if (name.includes('leftarm') || name.includes('left_arm') || 
          name.includes('arm.l') || name.includes('upperarm_l') ||
          name.includes('shoulder_l') || name.includes('leftshoulder')) {
        leftArm = child;
      }
      // Look for right forearm bones
      if (name.includes('rightforearm') || name.includes('right_forearm') || 
          name.includes('forearm.r') || name.includes('lowerarm_r') ||
          name.includes('righthand') || name.includes('right_hand')) {
        rightForearm = child;
      }
      // Look for left forearm bones
      if (name.includes('leftforearm') || name.includes('left_forearm') || 
          name.includes('forearm.l') || name.includes('lowerarm_l') ||
          name.includes('lefthand') || name.includes('left_hand')) {
        leftForearm = child;
      }
    }
  });

  console.log('Right arm found:', rightArm ? rightArm.name : 'Not found');
  console.log('Left arm found:', leftArm ? leftArm.name : 'Not found');
  console.log('Right forearm found:', rightForearm ? rightForearm.name : 'Not found');
  console.log('Left forearm found:', leftForearm ? leftForearm.name : 'Not found');

  // Start the chicken intro sequence after avatar loads
  setTimeout(() => {
    playChickenIntroSequence();
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
speechBubble.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)';
speechBubble.style.color = 'white';
speechBubble.style.fontWeight = 'bold';
speechBubble.style.fontSize = '22px';
speechBubble.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
speechBubble.style.display = 'none';
speechBubble.style.zIndex = '1000';
speechBubble.style.opacity = '0';
speechBubble.style.transform = 'translateY(20px) scale(0.8)';
speechBubble.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
speechBubble.style.maxWidth = '250px';
speechBubble.style.textAlign = 'center';
speechBubble.style.fontFamily = 'Comic Sans MS, cursive';
document.body.appendChild(speechBubble);

// Chicken intro sequence function
function playChickenIntroSequence() {
  if (hasPlayedChickenIntro || !avatar) return;
  hasPlayedChickenIntro = true;

  // Array of chicken sounds and messages
  const chickenMessages = [
    'QUACK QUACK! 🐔',
    'BAWK BAWK! 🐓',
    'CLUCK CLUCK! 🐔',
    'QUACK! 🐣'
  ];

  let messageIndex = 0;
  
  // Show first message
  showChickenMessage(chickenMessages[messageIndex]);
  
  // Start the chicken flapping animation
  startChickenFlapping();

  // Change messages every 800ms
  const messageInterval = setInterval(() => {
    messageIndex++;
    if (messageIndex < chickenMessages.length) {
      showChickenMessage(chickenMessages[messageIndex]);
    } else {
      clearInterval(messageInterval);
      // Hide final message after 1.5 seconds
      setTimeout(() => {
        hideChickenMessage();
      }, 1500);
    }
  }, 800);
}

// Show chicken message function
function showChickenMessage(message) {
  speechBubble.textContent = message;
  speechBubble.style.display = 'block';
  
  setTimeout(() => {
    speechBubble.style.opacity = '1';
    speechBubble.style.transform = 'translateY(0) scale(1)';
  }, 50);
}

// Hide chicken message function
function hideChickenMessage() {
  speechBubble.style.opacity = '0';
  speechBubble.style.transform = 'translateY(-20px) scale(0.8)';
  setTimeout(() => {
    speechBubble.style.display = 'none';
  }, 300);
}

// Custom chicken flapping animation function
function startChickenFlapping() {
  const flapStartTime = Date.now();
  const flapDuration = 4000; // 4 seconds of flapping
  const flapSpeed = 8; // Fast flapping like a chicken!

  function animateFlap() {
    const elapsed = Date.now() - flapStartTime;
    const progress = elapsed / flapDuration;
    
    if (progress >= 1) {
      // Reset arm positions to original
      resetArmPositions();
      return; // Animation complete
    }

    const flapTime = elapsed / 1000; // Convert to seconds
    const intensity = Math.sin(progress * Math.PI); // Fade in and out

    // Chicken-like flapping motion
    const flapAngle = Math.sin(flapTime * flapSpeed * Math.PI);
    const quickFlap = Math.sin(flapTime * flapSpeed * Math.PI * 2) * 0.3;

    // Animate both arms like chicken wings
    if (rightArm) {
      rightArm.rotation.z = flapAngle * 1.2 * intensity; // Big flapping motion
      rightArm.rotation.x = quickFlap * 0.5 * intensity; // Quick up-down
    }
    if (leftArm) {
      leftArm.rotation.z = -flapAngle * 1.2 * intensity; // Opposite direction
      leftArm.rotation.x = quickFlap * 0.5 * intensity; // Quick up-down
    }

    // Animate forearms for more realistic wing motion
    if (rightForearm) {
      rightForearm.rotation.z = flapAngle * 0.8 * intensity;
    }
    if (leftForearm) {
      leftForearm.rotation.z = -flapAngle * 0.8 * intensity;
    }

    // Add chicken-like body bobbing
    avatar.position.y += Math.sin(flapTime * flapSpeed * Math.PI) * 0.02 * intensity;
    avatar.rotation.y = Math.sin(flapTime * 4) * 0.1 * intensity; // Head bobbing

    requestAnimationFrame(animateFlap);
  }

  animateFlap();
}

// Reset arm positions function
function resetArmPositions() {
  if (rightArm) {
    rightArm.rotation.z = 0;
    rightArm.rotation.x = 0;
  }
  if (leftArm) {
    leftArm.rotation.z = 0;
    leftArm.rotation.x = 0;
  }
  if (rightForearm) {
    rightForearm.rotation.z = 0;
  }
  if (leftForearm) {
    leftForearm.rotation.z = 0;
  }
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

  // Add subtle idle breathing animation after chicken intro
  if (avatar && hasPlayedChickenIntro) {
    const time = clock.getElapsedTime();
    avatar.position.y += Math.sin(time * 1.5) * 0.001; // Very gentle breathing
  }

  // Easter egg: Click to make chicken again!
  if (avatar && hasPlayedChickenIntro) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(avatar, true);

    if (intersects.length > 0) {
      // Change cursor to indicate clickable
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  }

  renderer.render(scene, camera);
}
animate();

// Click event for bonus chicken action
window.addEventListener('click', (event) => {
  if (avatar && hasPlayedChickenIntro) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(avatar, true);

    if (intersects.length > 0) {
      // Quick chicken sound on click
      showChickenMessage('BAWK! 🐓');
      setTimeout(() => {
        hideChickenMessage();
      }, 1000);
    }
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});